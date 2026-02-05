<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { IAppDatabase, IUpStore, UpKey } from "../app-database";
import type { ILocalVideo } from "../types";
import {
  setUpVideosHidden,
  setUpVideosUsed,
  syncManyUpVideoData,
  type SyncUpVideoDataInput
} from "../app-ops";
import { parseCrawlerVideosFromUnknown } from "../parse";
import { createTauriAppDatabaseRepository } from "../tauri/app-database-repository";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  RefreshCw,
  Search,
  Check,
  Trash2,
  Download,
  ExternalLink,
  RotateCcw,
  Sparkles,
  FileText,
} from "lucide-vue-next";
import Button from "../components/ui/Button.vue";
import Card from "../components/ui/Card.vue";
import Input from "../components/ui/Input.vue";

type ImportSummary = {
  importedFiles: number;
  importedUps: number;
  addedVideos: number;
  lostVideos: number;
};

function baseNameWithoutExt(filePath: string): string {
  const normalized = String(filePath ?? "").split("\\").join("/");
  const name = normalized.split("/").filter(Boolean).pop() ?? "";
  return name.replace(/\.json$/i, "").trim() || "未命名UP主";
}

function uniqStrings(list: string[]): string[] {
  const set = new Set<string>();
  for (const item of list) {
    const v = String(item ?? "").trim();
    if (v) set.add(v);
  }
  return Array.from(set);
}

function formatLocalTime(ts: number): string {
  if (!Number.isFinite(ts) || ts <= 0) return "-";
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

interface Props {
  db: IAppDatabase;
  selectedUpKey: UpKey;
}

interface Emits {
  (e: "update:selectedUpKey", key: UpKey): void;
  (e: "update:db", db: IAppDatabase): void;
  (e: "reloadDb"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isLoading = ref(false);
const isSwitchingUp = ref(false);
const searchText = ref("");
const showHidden = ref(false);
const showUsedOnly = ref(false);
const showLostOnly = ref(false);
const selectedRows = ref<ILocalVideo[]>([]);
const lastImport = ref<ImportSummary | null>(null);
const isGeneratingAiNote = ref(false);
const showNoteDialog = ref(false);
const currentNoteContent = ref("");
const currentNoteTitle = ref("");

// 分页
const currentPage = ref(1);
const pageSize = ref(50);

const upList = computed(() => {
  const items = Object.values(props.db.ups);
  return items
    .map((up) => ({
      ...up,
      totalVideos: up.videos.filter((v) => !v.isHidden).length
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-Hans-CN"));
});

const currentUp = computed<IUpStore | null>(() => {
  const key = props.selectedUpKey;
  return key ? props.db.ups[key] ?? null : null;
});

// 缓存过滤后的视频
const filteredVideos = ref<ILocalVideo[]>([]);

// 优化：使用 watch 来更新过滤后的视频
watch(
  [currentUp, searchText, showHidden, showUsedOnly, showLostOnly],
  ([up]) => {
    if (!up) {
      filteredVideos.value = [];
      currentPage.value = 1;
      return;
    }

    const keyword = searchText.value.trim().toLowerCase();

    const result = up.videos
      .filter((v) => (showHidden.value ? v.isHidden : !v.isHidden))
      .filter((v) => (showUsedOnly.value ? v.isUsed : true))
      .filter((v) => (showLostOnly.value ? v.localStatus === "lost" : true))
      .filter((v) => {
        if (!keyword) return true;
        return (
          v.id.toLowerCase().includes(keyword) ||
          v.title.toLowerCase().includes(keyword) ||
          v.href.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => b.likeCount - a.likeCount);

    filteredVideos.value = result;
    currentPage.value = 1;
  },
  { immediate: true }
);

// 分页后的视频
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredVideos.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / pageSize.value);
});

// 当前UP主的统计
const currentUpStats = computed(() => {
  const up = currentUp.value;
  if (!up) return null;

  const videos = up.videos.filter((v) => !v.isHidden);
  const lostVideos = videos.filter((v) => v.localStatus === "lost");
  const usedVideos = videos.filter((v) => v.isUsed);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const avgLikes = videos.length > 0 ? Math.round(totalLikes / videos.length) : 0;

  return {
    total: videos.length,
    lost: lostVideos.length,
    used: usedVideos.length,
    totalLikes,
    avgLikes,
    lostRate: videos.length > 0 ? Math.round((lostVideos.length / videos.length) * 100) : 0,
    usedRate: videos.length > 0 ? Math.round((usedVideos.length / videos.length) * 100) : 0,
  };
});

async function selectUp(key: string) {
  if (key === props.selectedUpKey) return;
  emit("update:selectedUpKey", key);
  isSwitchingUp.value = true;
  selectedRows.value = [];

  setTimeout(() => {
    isSwitchingUp.value = false;
  }, 300);
}

function onSelectionChange(rows: ILocalVideo[]) {
  selectedRows.value = rows;
}

async function importJsonFiles(): Promise<void> {
  try {
    const picked = await open({
      multiple: true,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    const filePaths = Array.isArray(picked) ? picked : picked ? [picked] : [];
    if (filePaths.length === 0) return;

    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const beforeDb = props.db;

    const inputs: SyncUpVideoDataInput[] = [];
    for (const filePath of filePaths) {
      const raw = await readTextFile(filePath);
      const parsed: unknown = JSON.parse(raw);
      const latestVideos = parseCrawlerVideosFromUnknown(parsed);
      const upKey = baseNameWithoutExt(filePath);
      inputs.push({ upKey, displayName: upKey, latestVideos });
    }

    const nextDb = await syncManyUpVideoData(inputs, repo);
    emit("update:db", nextDb);

    const summary: ImportSummary = {
      importedFiles: filePaths.length,
      importedUps: uniqStrings(inputs.map((i) => i.upKey)).length,
      addedVideos: 0,
      lostVideos: 0
    };

    for (const input of inputs) {
      const beforeUp = beforeDb.ups[input.upKey];
      const beforeIds = new Set((beforeUp?.videos ?? []).map((v) => v.id));
      const afterUp = nextDb.ups[input.upKey];
      if (!afterUp) continue;

      summary.addedVideos += afterUp.videos.filter((v) => !beforeIds.has(v.id)).length;
      summary.lostVideos += afterUp.videos.filter((v) => !v.isHidden && v.localStatus === "lost").length;
    }

    lastImport.value = summary;

    if (!props.selectedUpKey) {
      emit("update:selectedUpKey", upList.value[0]?.key ?? "");
    }

    ElMessage.success(
      `导入完成：${summary.importedFiles} 个文件 / ${summary.importedUps} 个UP主；新增视频约 ${summary.addedVideos}；疑似已删 ${summary.lostVideos}`
    );
  } catch (e) {
    ElMessage.error(`导入失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function markSelectedUsed(isUsed: boolean): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  const ids = uniqStrings(selectedRows.value.map((r) => r.id));
  if (ids.length === 0) {
    ElMessage.warning("请先勾选要标记的视频。");
    return;
  }

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosUsed(up.key, ids, isUsed, repo);
    if (!updated) return;

    const newDb = {
      ...props.db,
      ups: { ...props.db.ups, [updated.key]: updated }
    };
    emit("update:db", newDb);
    ElMessage.success(isUsed ? "已标记为已用。" : "已取消已用。");
  } catch (e) {
    ElMessage.error(`更新失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function hideSelectedVideos(): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  const ids = uniqStrings(selectedRows.value.map((r) => r.id));
  if (ids.length === 0) {
    ElMessage.warning("请先勾选要删除（隐藏）的视频。");
    return;
  }

  const ok = await ElMessageBox.confirm(
    `将隐藏 ${ids.length} 条记录（软删除，不会丢失"已使用"标记）。继续吗？`,
    "删除选中",
    { type: "warning", confirmButtonText: "继续", cancelButtonText: "取消" }
  )
    .then(() => true)
    .catch(() => false);

  if (!ok) return;

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosHidden(up.key, ids, true, repo);
    if (!updated) return;

    const newDb = {
      ...props.db,
      ups: { ...props.db.ups, [updated.key]: updated }
    };
    emit("update:db", newDb);
    ElMessage.success("已隐藏选中视频。");
  } catch (e) {
    ElMessage.error(`删除失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function hideOneVideo(video: ILocalVideo): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  if (!video.id) return;

  const ok = await ElMessageBox.confirm(`隐藏该视频：${video.id}？`, "删除", {
    type: "warning",
    confirmButtonText: "继续",
    cancelButtonText: "取消"
  })
    .then(() => true)
    .catch(() => false);

  if (!ok) return;

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosHidden(up.key, [video.id], true, repo);
    if (!updated) return;

    const newDb = {
      ...props.db,
      ups: { ...props.db.ups, [updated.key]: updated }
    };
    emit("update:db", newDb);
    ElMessage.success("已隐藏该视频。");
  } catch (e) {
    ElMessage.error(`删除失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function restoreOneVideo(video: ILocalVideo): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  if (!video.id) return;

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosHidden(up.key, [video.id], false, repo);
    if (!updated) return;

    const newDb = {
      ...props.db,
      ups: { ...props.db.ups, [updated.key]: updated }
    };
    emit("update:db", newDb);
    ElMessage.success("已恢复该视频。");
  } catch (e) {
    ElMessage.error(`恢复失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function restoreSelectedVideos(): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  const ids = uniqStrings(selectedRows.value.map((r) => r.id));
  if (ids.length === 0) {
    ElMessage.warning("请先勾选要恢复的视频。");
    return;
  }

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosHidden(up.key, ids, false, repo);
    if (!updated) return;

    const newDb = {
      ...props.db,
      ups: { ...props.db.ups, [updated.key]: updated }
    };
    emit("update:db", newDb);
    ElMessage.success(`已恢复 ${ids.length} 个视频。`);
  } catch (e) {
    ElMessage.error(`恢复失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function exportReport(): Promise<void> {
  const up = currentUp.value;
  if (!up) return;

  const ids = uniqStrings(selectedRows.value.map((r) => r.id));
  const exportVideos = ids.length
    ? up.videos.filter((v) => ids.includes(v.id))
    : filteredVideos.value;

  try {
    const filePath = await save({
      defaultPath: `${up.displayName || up.key}_report.json`,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    if (!filePath) return;

    const report = {
      exportedAt: Date.now(),
      up: { key: up.key, displayName: up.displayName, lastSyncAt: up.lastSyncAt },
      selection: { mode: ids.length ? "selected" : "filtered", count: exportVideos.length },
      videos: exportVideos
    };

    await writeTextFile(filePath, `${JSON.stringify(report, null, 2)}\n`);
    ElMessage.success(`已导出：${filePath}`);
  } catch (e) {
    ElMessage.error(`导出失败：${String(e)}`);
  }
}

async function openVideoLink(video: ILocalVideo) {
  if (!video.href) return;
  await openUrl(video.href).catch((e: unknown) => {
    ElMessage.error(`打开链接失败：${String(e)}`);
  });
}

async function generateAiNote(): Promise<void> {
  const ids = uniqStrings(selectedRows.value.map((r) => r.id));
  if (ids.length === 0) {
    ElMessage.warning("请先勾选要生成笔记的视频。");
    return;
  }

  if (ids.length > 1) {
    ElMessage.warning("一次只能为一个视频生成AI笔记。");
    return;
  }

  const video = selectedRows.value[0];
  if (!video.href) {
    ElMessage.warning("该视频没有链接信息。");
    return;
  }

  // 检查AI配置
  let aiConfig;
  try {
    const aiConfigStr = localStorage.getItem("aiApiConfig");
    if (!aiConfigStr) {
      ElMessage.warning("请先在设置中配置AI API。");
      return;
    }
    aiConfig = JSON.parse(aiConfigStr);
  } catch (e) {
    ElMessage.error("读取AI配置失败，请重新配置。");
    return;
  }

  if (!aiConfig.url || !aiConfig.token) {
    ElMessage.warning("请先在设置中配置完整的AI API信息（API地址和Token）。");
    return;
  }

  isGeneratingAiNote.value = true;

  try {
    // 生成输出路径
    const outputFileName = `ai_note_${video.id}_${Date.now()}.md`;
    const outputPath = `ai_notes/${outputFileName}`;

    ElMessage.info("正在生成AI笔记，这可能需要一些时间...");

    // 调用后端命令生成笔记
    const { invoke } = await import("@tauri-apps/api/core");
    const resultPath = await invoke<string>("generate_ai_note", {
      request: {
        api_url: aiConfig.url,
        token: aiConfig.token,
        video_url: video.href,
        video_title: video.title || "未命名视频",
        prompt_template: aiConfig.promptTemplate || "",
        output_path: outputPath
      }
    });

    // 更新视频记录：添加笔记路径并标记为已用
    const up = currentUp.value;
    if (up) {
      try {
        const repo = await createTauriAppDatabaseRepository();
        const updatedVideo = { ...video, aiNotePath: resultPath, isUsed: true };
        const updatedVideos = up.videos.map(v => v.id === video.id ? updatedVideo : v);
        const updatedUp = { ...up, videos: updatedVideos };

        // 更新数据库
        const newDb = {
          ...props.db,
          ups: { ...props.db.ups, [updatedUp.key]: updatedUp }
        };
        await repo.save(newDb);
        emit("update:db", newDb);
      } catch (dbError) {
        console.error("更新数据库失败:", dbError);
        // 即使数据库更新失败，也继续显示笔记
      }
    }

    ElMessage.success(`AI笔记生成成功！已自动标记为已用。`);

    // 读取并显示笔记内容
    try {
      const noteContent = await readTextFile(resultPath);
      currentNoteContent.value = noteContent;
      currentNoteTitle.value = video.title || "未命名视频";
      showNoteDialog.value = true;
    } catch (readError) {
      console.error("读取笔记文件失败:", readError);
      ElMessage.warning("笔记已生成，但读取文件失败。路径: " + resultPath);
    }
  } catch (e) {
    // 错误已经在后端处理并返回详细消息，直接显示
    const errorMessage = String(e);
    console.error("生成AI笔记失败:", errorMessage);

    // 显示详细的错误消息
    if (errorMessage.includes("403") || errorMessage.includes("认证失败")) {
      ElMessage.error({
        message: "API 认证失败！\n\n请检查：\n1. Token 是否正确\n2. Token 是否已过期\n3. 是否有正确的访问权限",
        duration: 5000
      });
    } else if (errorMessage.includes("401")) {
      ElMessage.error({
        message: "API 未授权！\n\n请检查 Token 是否已配置。",
        duration: 5000
      });
    } else if (errorMessage.includes("网络") || errorMessage.includes("连接")) {
      ElMessage.error({
        message: "网络连接失败！\n\n请检查网络连接和API地址是否正确。",
        duration: 5000
      });
    } else {
      ElMessage.error({
        message: `生成失败：${errorMessage}`,
        duration: 5000
      });
    }
  } finally {
    isGeneratingAiNote.value = false;
  }
}

// 查看已有笔记
async function viewAiNote(video: ILocalVideo): Promise<void> {
  if (!video.aiNotePath) {
    ElMessage.warning("该视频还没有生成AI笔记。");
    return;
  }

  try {
    const noteContent = await readTextFile(video.aiNotePath);
    currentNoteContent.value = noteContent;
    currentNoteTitle.value = video.title || "未命名视频";
    showNoteDialog.value = true;
  } catch (e) {
    ElMessage.error(`读取笔记失败：${String(e)}\n文件路径: ${video.aiNotePath}`);
  }
}

function videoRowClassName({ row }: { row: ILocalVideo }) {
  const classes: string[] = [];
  if (row.localStatus === "lost") classes.push("row-lost");
  if (row.isUsed) classes.push("row-used");
  if (row.isHidden) classes.push("row-hidden");
  return classes.join(" ");
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  selectedRows.value = [];
}

function handlePageChange(page: number) {
  goToPage(page);
}

function handleSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  selectedRows.value = [];
}

// 导出方法供父组件调用
defineExpose({
  importJsonFiles,
  selectUp
});
</script>

<template>
  <div class="video-manager-page">
    <!-- Header -->
    <header class="content-header">
      <div class="header-left">
        <h2 class="page-title">{{ currentUp?.displayName || "选择UP主" }}</h2>
        <span v-if="currentUp" class="page-subtitle">
          上次同步：{{ formatLocalTime(currentUp.lastSyncAt) }}
        </span>
      </div>
      <div class="header-right">
        <Input
          v-model="searchText"
          placeholder="搜索视频..."
          :icon="Search"
          class="search-input"
          size="sm"
        />
      </div>
    </header>

    <!-- Content -->
    <div class="content-body">
      <Card>
        <template #default>
          <!-- Toolbar -->
          <div class="toolbar">
            <div class="toolbar-left">
              <Button variant="ghost" size="sm" :icon="RefreshCw" @click="$emit('reloadDb')">
                刷新
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :icon="Trash2"
                :disabled="selectedRows.length === 0"
                @click="hideSelectedVideos"
              >
                删除
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :icon="RotateCcw"
                :disabled="selectedRows.length === 0"
                @click="restoreSelectedVideos"
                class="text-green-600"
              >
                恢复
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :icon="Check"
                :disabled="selectedRows.length === 0"
                @click="markSelectedUsed(true)"
              >
                标记已用
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :disabled="selectedRows.length === 0"
                @click="markSelectedUsed(false)"
              >
                取消已用
              </Button>
              <Button
                variant="ghost"
                size="sm"
                :icon="Sparkles"
                :disabled="selectedRows.length !== 1"
                :loading="isGeneratingAiNote"
                @click="generateAiNote"
                class="text-purple-600"
              >
                生成AI笔记
              </Button>
              <Button variant="ghost" size="sm" :icon="Download" @click="exportReport">
                导出
              </Button>
            </div>
            <div class="toolbar-right">
              <label class="filter-toggle">
                <input type="checkbox" v-model="showUsedOnly" />
                <span>仅已用</span>
              </label>
              <label class="filter-toggle">
                <input type="checkbox" v-model="showLostOnly" />
                <span>疑似已删</span>
              </label>
              <label class="filter-toggle">
                <input type="checkbox" v-model="showHidden" />
                <span>仅已删除</span>
              </label>
            </div>
          </div>

          <!-- Stats Cards -->
          <div v-if="currentUpStats" class="stats-cards">
            <div class="stat-card">
              <div class="stat-label">总视频</div>
              <div class="stat-value">{{ currentUpStats.total }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">已使用</div>
              <div class="stat-value">{{ currentUpStats.used }}</div>
              <div class="stat-rate">{{ currentUpStats.usedRate }}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">疑似已删</div>
              <div class="stat-value stat-value-warn">{{ currentUpStats.lost }}</div>
              <div class="stat-rate">{{ currentUpStats.lostRate }}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">总点赞</div>
              <div class="stat-value">{{ currentUpStats.totalLikes.toLocaleString() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">平均点赞</div>
              <div class="stat-value">{{ currentUpStats.avgLikes.toLocaleString() }}</div>
            </div>
          </div>

          <!-- Video Count -->
          <div class="video-count">
            显示 {{ paginatedVideos.length }} / {{ filteredVideos.length }} 条
          </div>

          <!-- Video Table -->
          <div class="video-table-wrapper" v-loading="isLoading || isSwitchingUp">
            <el-table
              :data="paginatedVideos"
              height="calc(100vh - 380px)"
              border
              stripe
              row-key="id"
              :row-class-name="videoRowClassName"
              @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
              <el-table-column label="标题" min-width="220" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="title-cell">
                    <div class="title-text">{{ row.title || "无标题" }}</div>
                    <div class="title-url">{{ row.href }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80" align="center">
                <template #default="{ row }">
                  <span v-if="row.localStatus === 'lost'" class="status-tag status-warn">
                    已删
                  </span>
                  <span v-else class="status-tag status-ok">正常</span>
                </template>
              </el-table-column>
              <el-table-column prop="likeCount" label="点赞" width="90" align="right" sortable />
              <el-table-column label="已使用" width="80" align="center">
                <template #default="{ row }">
                  <span v-if="row.isUsed" class="status-tag status-info">✓</span>
                  <span v-else class="text-zinc-400">—</span>
                </template>
              </el-table-column>
              <el-table-column label="最近出现" width="130" align="center">
                <template #default="{ row }">{{ formatLocalTime(row.lastSeen) }}</template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right" align="center">
                <template #default="{ row }">
                  <div class="table-actions-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      :icon="ExternalLink"
                      :disabled="!row.href"
                      @click="openVideoLink(row)"
                    >
                      打开
                    </Button>
                    <Button
                      v-if="row.aiNotePath"
                      variant="ghost"
                      size="sm"
                      :icon="FileText"
                      @click="viewAiNote(row)"
                      class="text-purple-600"
                    >
                      笔记
                    </Button>
                    <Button
                      v-if="row.isHidden"
                      variant="ghost"
                      size="sm"
                      @click="restoreOneVideo(row)"
                      class="text-green-600"
                    >
                      恢复
                    </Button>
                    <Button
                      v-else
                      variant="ghost"
                      size="sm"
                      @click="hideOneVideo(row)"
                      class="text-red-600"
                    >
                      删除
                    </Button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <!-- Pagination -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="filteredVideos.length"
                :page-sizes="[20, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- AI Note Viewer Dialog -->
    <el-dialog
      v-model="showNoteDialog"
      :title="`AI笔记 - ${currentNoteTitle}`"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="note-content">
        <pre class="note-text">{{ currentNoteContent }}</pre>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showNoteDialog = false">关闭</Button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.video-manager-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #18181B;
  margin: 0;
}

.page-subtitle {
  font-size: 12px;
  color: #71717A;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 240px;
}

.content-body {
  flex: 1;
  padding: 14px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #71717A;
  cursor: pointer;
  user-select: none;
}

.filter-toggle input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.video-count {
  font-size: 12px;
  color: #71717A;
  margin-bottom: 8px;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 8px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: #FFFFFF;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 60px;
  justify-content: center;
}

.stat-label {
  font-size: 11px;
  color: #71717A;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #18181B;
}

.stat-value-warn {
  color: #F59E0B;
}

.stat-rate {
  font-size: 11px;
  color: #71717A;
  margin-top: 2px;
}

.video-table-wrapper {
  position: relative;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  border-radius: 6px;
}

:deep(.el-pagination .el-pager li.is-active) {
  background-color: #18181B;
}

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-text {
  font-weight: 500;
  color: #18181B;
  font-size: 13px;
}

.title-url {
  font-size: 11px;
  color: #71717A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.status-ok {
  background: rgba(34, 197, 94, 0.1);
  color: #16A34A;
}

.status-warn {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  color: #2563EB;
}

/* Element Plus table overrides */
:deep(.el-table) {
  font-size: 13px;
  table-layout: fixed;
}

:deep(.el-table th.el-table__cell) {
  background: #F9F9FB;
  color: #71717A;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.015em;
  padding: 10px 0;
}

:deep(.el-table td.el-table__cell) {
  color: #18181B;
  padding: 10px 0;
}

:deep(.el-table__cell) {
  box-sizing: border-box;
}

:deep(.el-table__fixed) {
  box-sizing: border-box;
}

:deep(.el-table__fixed-right) {
  right: 0 !important;
}

:deep(.el-table__fixed-right-patch) {
  background: #F9F9FB;
}

:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.el-table--border th.el-table__cell) {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

:deep(.el-table tbody tr) {
  box-sizing: border-box;
}

:deep(.row-lost) td {
  color: #A1A1AA;
  text-decoration: line-through;
}

:deep(.row-used) td {
  opacity: 0.75;
}

:deep(.row-hidden) td {
  opacity: 0.45;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #18181B;
  border-color: #18181B;
}

.note-content {
  max-height: 60vh;
  overflow-y: auto;
}

.note-text {
  margin: 0;
  padding: 16px;
  background: #F9F9FB;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>
