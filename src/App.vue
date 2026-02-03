<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { IAppDatabase, IUpStore, UpKey } from "./app-database";
import type { ILocalVideo } from "./types";
import { createEmptyAppDatabase } from "./app-database";
import {
  loadAppDatabase,
  setUpVideosHidden,
  setUpVideosUsed,
  syncManyUpVideoData,
  type SyncUpVideoDataInput
} from "./app-ops";
import { parseCrawlerVideosFromUnknown } from "./parse";
import { createTauriAppDatabaseRepository } from "./tauri/app-database-repository";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  RefreshCw,
  Upload,
  Search,
  Check,
  Trash2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-vue-next";
import Button from "./components/ui/Button.vue";
import Card from "./components/ui/Card.vue";
import Input from "./components/ui/Input.vue";

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

const db = ref<IAppDatabase>(createEmptyAppDatabase());
const repoReady = ref(false);
const isLoading = ref(false);
const isSwitchingUp = ref(false); // UP主切换加载状态
const selectedUpKey = ref<UpKey>("");
const searchText = ref("");
const showHidden = ref(false);
const showUsedOnly = ref(false);
const showLostOnly = ref(false);
const selectedRows = ref<ILocalVideo[]>([]);
const lastImport = ref<ImportSummary | null>(null);

// 分页
const pageSize = 50;
const currentPage = ref(1);

const upList = computed(() => {
  const items = Object.values(db.value.ups);
  return items
    .map((up) => ({
      ...up,
      totalVideos: up.videos.filter((v) => !v.isHidden).length
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-Hans-CN"));
});

const currentUp = computed<IUpStore | null>(() => {
  const key = selectedUpKey.value;
  return key ? db.value.ups[key] ?? null : null;
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
      .filter((v) => (showHidden.value ? true : !v.isHidden))
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
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredVideos.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / pageSize);
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

const stats = computed(() => {
  const ups = Object.values(db.value.ups);
  const allVideos = ups.flatMap((u) => u.videos);
  const visibleVideos = allVideos.filter((v) => !v.isHidden);
  const lostVideos = visibleVideos.filter((v) => v.localStatus === "lost");
  const usedVideos = visibleVideos.filter((v) => v.isUsed);
  const hiddenVideos = allVideos.filter((v) => v.isHidden);
  const totalLikes = visibleVideos.reduce((sum, v) => sum + v.likeCount, 0);

  return {
    totalUps: ups.length,
    totalVideos: visibleVideos.length,
    usedVideos: usedVideos.length,
    lostVideos: lostVideos.length,
    hiddenVideos: hiddenVideos.length,
    totalLikes,
    avgLikes: visibleVideos.length > 0 ? Math.round(totalLikes / visibleVideos.length) : 0,
  };
});

async function ensureRepositoryReady(): Promise<void> {
  if (repoReady.value) return;
  await createTauriAppDatabaseRepository();
  repoReady.value = true;
}

async function reloadDb(): Promise<void> {
  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    db.value = await loadAppDatabase(repo);

    if (!selectedUpKey.value) {
      selectedUpKey.value = upList.value[0]?.key ?? "";
    } else if (!db.value.ups[selectedUpKey.value]) {
      selectedUpKey.value = upList.value[0]?.key ?? "";
    }
  } catch (e) {
    ElMessage.error(`加载本地数据库失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

async function selectUp(key: string) {
  if (key === selectedUpKey.value) return;

  isSwitchingUp.value = true;
  selectedUpKey.value = key;
  selectedRows.value = [];

  // 延迟清除 loading 状态，让数据有时间加载
  setTimeout(() => {
    isSwitchingUp.value = false;
  }, 300);
}

function onSelectionChange(rows: ILocalVideo[]) {
  selectedRows.value = rows;
}

async function importJsonFiles(): Promise<void> {
  try {
    await ensureRepositoryReady();

    const picked = await open({
      multiple: true,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    const filePaths = Array.isArray(picked) ? picked : picked ? [picked] : [];
    if (filePaths.length === 0) return;

    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const beforeDb = db.value;

    const inputs: SyncUpVideoDataInput[] = [];
    for (const filePath of filePaths) {
      const raw = await readTextFile(filePath);
      const parsed: unknown = JSON.parse(raw);
      const latestVideos = parseCrawlerVideosFromUnknown(parsed);
      const upKey = baseNameWithoutExt(filePath);
      inputs.push({ upKey, displayName: upKey, latestVideos });
    }

    const nextDb = await syncManyUpVideoData(inputs, repo);
    db.value = nextDb;

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

    if (!selectedUpKey.value) {
      selectedUpKey.value = upList.value[0]?.key ?? "";
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
    db.value = { ...db.value, ups: { ...db.value.ups, [updated.key]: updated } };
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
    db.value = { ...db.value, ups: { ...db.value.ups, [updated.key]: updated } };
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
    db.value = { ...db.value, ups: { ...db.value.ups, [updated.key]: updated } };
    ElMessage.success("已隐藏该视频。");
  } catch (e) {
    ElMessage.error(`删除失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

// 恢复单个视频
async function restoreOneVideo(video: ILocalVideo): Promise<void> {
  const up = currentUp.value;
  if (!up) return;
  if (!video.id) return;

  try {
    isLoading.value = true;
    const repo = await createTauriAppDatabaseRepository();
    const updated = await setUpVideosHidden(up.key, [video.id], false, repo);
    if (!updated) return;
    db.value = { ...db.value, ups: { ...db.value.ups, [updated.key]: updated } };
    ElMessage.success("已恢复该视频。");
  } catch (e) {
    ElMessage.error(`恢复失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

// 批量恢复视频
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
    db.value = { ...db.value, ups: { ...db.value.ups, [updated.key]: updated } };
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
    await ensureRepositoryReady();

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

onMounted(async () => {
  await reloadDb();
});
</script>

<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Header -->
      <div class="sidebar-header">
        <h1 class="app-title">抖音UP主视频管理器</h1>
      </div>

      <!-- UP List -->
      <div class="sidebar-section">
        <div class="section-header">
          <span class="section-title">UP主列表 ({{ upList.length }})</span>
          <Button variant="ghost" size="sm" :icon="RefreshCw" @click="reloadDb" />
        </div>
        <div class="up-list">
          <div
            v-for="up in upList"
            :key="up.key"
            :class="['up-item', { 'up-item-active': selectedUpKey === up.key }]"
            @click="selectUp(up.key)"
          >
            <span class="up-name">{{ up.displayName }}</span>
            <span class="up-count">{{ up.totalVideos }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="sidebar-actions">
        <Button variant="default" size="sm" :icon="Upload" @click="importJsonFiles" class="w-full">
          导入JSON
        </Button>
      </div>

      <!-- Stats -->
      <div class="sidebar-stats">
        <div class="stat-row">
          <span class="stat-label">总视频</span>
          <span class="stat-value">{{ stats.totalVideos }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">已使用</span>
          <span class="stat-value">{{ stats.usedVideos }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">疑似已删</span>
          <span class="stat-value stat-value-warn">{{ stats.lostVideos }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
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
                <Button variant="default" size="sm" :icon="Upload" @click="importJsonFiles">
                  导入
                </Button>
                <Button variant="ghost" size="sm" :icon="RefreshCw" @click="reloadDb">
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
                  <span>显示已删除</span>
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
                height="calc(100vh - 340px)"
                border
                stripe
                row-key="id"
                :row-class-name="videoRowClassName"
                @selection-change="onSelectionChange"
              >
                <el-table-column type="selection" width="44" />
                <el-table-column label="视频ID" prop="id" width="180" />
                <el-table-column label="标题" min-width="260">
                  <template #default="{ row }">
                    <div class="title-cell">
                      <div class="title-text">{{ row.title || "无标题" }}</div>
                      <div class="title-url">{{ row.href }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                  <template #default="{ row }">
                    <span v-if="row.localStatus === 'lost'" class="status-tag status-warn">
                      已删
                    </span>
                    <span v-else class="status-tag status-ok">正常</span>
                  </template>
                </el-table-column>
                <el-table-column label="点赞" prop="likeCount" width="80" sortable />
                <el-table-column label="已使用" width="90">
                  <template #default="{ row }">
                    <span v-if="row.isUsed" class="status-tag status-info">✓</span>
                    <span v-else class="text-zinc-400">—</span>
                  </template>
                </el-table-column>
                <el-table-column label="最近出现" width="140">
                  <template #default="{ row }">{{ formatLocalTime(row.lastSeen) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                  <template #default="{ row }">
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
                      v-if="row.isHidden"
                      variant="ghost"
                      size="sm"
                      :icon="RotateCcw"
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
                  </template>
                </el-table-column>
              </el-table>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="pagination">
                <Button
                  variant="ghost"
                  size="sm"
                  :icon="ChevronLeft"
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                >
                  上一页
                </Button>
                <span class="pagination-info">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  :icon="ChevronRight"
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)"
                >
                  下一页
                </Button>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: #F9F9FB;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #F4F4F5;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.app-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #18181B;
  margin: 0;
}

.sidebar-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #71717A;
  letter-spacing: -0.01em;
}

.up-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.up-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  margin-bottom: 1px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.up-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.up-item-active {
  background-color: rgba(0, 0, 0, 0.06);
}

.up-name {
  font-size: 13px;
  font-weight: 500;
  color: #18181B;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.up-count {
  font-size: 11px;
  font-weight: 500;
  color: #71717A;
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.sidebar-actions {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-stats {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.stat-label {
  color: #71717A;
}

.stat-value {
  font-weight: 600;
  color: #18181B;
}

.stat-value-warn {
  color: #F59E0B;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
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
  grid-template-columns: repeat(5, 1fr);
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
  padding: 8px 12px;
  background: #FFFFFF;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
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
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.pagination-info {
  font-size: 13px;
  font-weight: 500;
  color: #71717A;
  min-width: 60px;
  text-align: center;
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
}

:deep(.el-table th.el-table__cell) {
  background: #F9F9FB;
  color: #71717A;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.015em;
}

:deep(.el-table td.el-table__cell) {
  color: #18181B;
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

/* Scrollbar */
.up-list::-webkit-scrollbar {
  width: 6px;
}

.up-list::-webkit-scrollbar-track {
  background: transparent;
}

.up-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.up-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>
