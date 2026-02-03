<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
  Check,
  Delete,
  Download,
  Refresh,
  RefreshRight,
  Search,
  Setting,
  UploadFilled,
  View
} from "@element-plus/icons-vue";

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
const selectedUpKey = ref<UpKey>("");
const searchText = ref("");
const showHidden = ref(false);
const showUsedOnly = ref(false);
const showLostOnly = ref(false);
const settingsOpen = ref(false);
const selectedRows = ref<ILocalVideo[]>([]);
const lastImport = ref<ImportSummary | null>(null);

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

const filteredVideos = computed(() => {
  const up = currentUp.value;
  if (!up) return [];

  const keyword = searchText.value.trim().toLowerCase();

  return up.videos
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
});

const stats = computed(() => {
  const ups = Object.values(db.value.ups);
  const allVideos = ups.flatMap((u) => u.videos);
  const visibleVideos = allVideos.filter((v) => !v.isHidden);
  const lostVideos = visibleVideos.filter((v) => v.localStatus === "lost");
  const usedVideos = visibleVideos.filter((v) => v.isUsed);

  return {
    totalUps: ups.length,
    totalVideos: visibleVideos.length,
    usedVideos: usedVideos.length,
    lostVideos: lostVideos.length
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

function selectUp(key: string) {
  selectedUpKey.value = key;
  selectedRows.value = [];
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
    `将隐藏 ${ids.length} 条记录（软删除，不会丢失“已使用”标记）。继续吗？`,
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

onMounted(async () => {
  await reloadDb();
});
</script>

<template>
  <el-container class="app-root">
    <el-header class="app-header">
      <div class="title">抖音UP主视频管理器</div>
      <div class="header-actions">
        <el-input
          v-model="searchText"
          class="search"
          placeholder="搜索：ID / 标题 / URL"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button :icon="Setting" @click="settingsOpen = true">设置</el-button>
      </div>
    </el-header>

    <el-container class="app-body">
      <el-aside width="320px" class="aside">
        <el-card class="panel" shadow="never">
          <template #header>
            <div class="panel-header">
              <div class="panel-title">UP主列表</div>
              <el-button :icon="Refresh" text @click="reloadDb" />
            </div>
          </template>

          <el-scrollbar height="420px">
            <el-menu
              :default-active="selectedUpKey"
              class="up-menu"
              @select="selectUp"
            >
              <el-menu-item v-for="up in upList" :key="up.key" :index="up.key">
                <div class="up-item">
                  <span class="up-name">{{ up.displayName }}</span>
                  <el-tag size="small" type="info">{{ up.totalVideos }}</el-tag>
                </div>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>

          <div class="aside-actions">
            <el-button :icon="UploadFilled" type="primary" plain @click="importJsonFiles">
              + 导入新UP主
            </el-button>
            <el-button :icon="Refresh" plain @click="reloadDb">刷新列表</el-button>
          </div>
        </el-card>

        <el-card class="panel stats" shadow="never">
          <template #header>
            <div class="panel-title">统计面板</div>
          </template>
          <div class="stats-grid">
            <div class="stat">
              <div class="k">总UP主</div>
              <div class="v">{{ stats.totalUps }}</div>
            </div>
            <div class="stat">
              <div class="k">总视频</div>
              <div class="v">{{ stats.totalVideos }}</div>
            </div>
            <div class="stat">
              <div class="k">已使用</div>
              <div class="v">{{ stats.usedVideos }}</div>
            </div>
            <div class="stat">
              <div class="k">疑似已删</div>
              <div class="v">{{ stats.lostVideos }}</div>
            </div>
          </div>
          <div v-if="lastImport" class="import-tip">
            上次导入：{{ lastImport.importedFiles }} 文件 / 新增约 {{ lastImport.addedVideos }}
          </div>
        </el-card>
      </el-aside>

      <el-main class="main">
        <el-card class="panel" shadow="never">
          <template #header>
            <div class="panel-header">
              <div class="panel-title">视频列表</div>
              <div class="panel-subtitle" v-if="currentUp">
                {{ currentUp.displayName }}（上次同步：{{ formatLocalTime(currentUp.lastSyncAt) }}）
              </div>
            </div>
          </template>

          <div class="toolbar">
            <div class="toolbar-left">
              <el-button :icon="UploadFilled" @click="importJsonFiles">导入JSON</el-button>
              <el-tooltip content="暂不做抖音端请求检测（后续按你的插件脚本方案接入）" placement="top">
                <span>
                  <el-button :icon="Search" disabled>检测状态</el-button>
                </span>
              </el-tooltip>
              <el-button :icon="RefreshRight" @click="importJsonFiles">对比更新</el-button>
              <el-button :icon="Delete" :disabled="selectedRows.length === 0" @click="hideSelectedVideos">
                删除选中
              </el-button>
              <el-button :icon="Check" :disabled="selectedRows.length === 0" @click="markSelectedUsed(true)">
                标记已用
              </el-button>
              <el-button :disabled="selectedRows.length === 0" @click="markSelectedUsed(false)">
                取消已用
              </el-button>
              <el-button :icon="Download" @click="exportReport">导出报告</el-button>
            </div>
            <div class="toolbar-right">
              <el-switch v-model="showUsedOnly" active-text="仅已用" />
              <el-switch v-model="showLostOnly" active-text="仅疑似已删" />
              <el-switch v-model="showHidden" active-text="显示已删除" />
            </div>
          </div>

          <el-table
            v-loading="isLoading"
            :data="filteredVideos"
            height="610"
            border
            stripe
            row-key="id"
            :row-class-name="videoRowClassName"
            @selection-change="onSelectionChange"
          >
            <el-table-column type="selection" width="44" />
            <el-table-column label="视频ID" prop="id" width="200" />
            <el-table-column label="标题" min-width="260">
              <template #default="{ row }">
                <div class="title-cell">
                  <div class="t">{{ row.title || "无标题" }}</div>
                  <div class="s">{{ row.href }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.localStatus === 'lost'" type="warning">可能已删除</el-tag>
                <el-tag v-else type="success">正常</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="点赞" prop="likeCount" width="90" sortable />
            <el-table-column label="已使用" width="110">
              <template #default="{ row }">
                <el-tag v-if="row.isUsed" type="info">✅ 已使用</el-tag>
                <span v-else>❌</span>
              </template>
            </el-table-column>
            <el-table-column label="最近出现" width="160">
              <template #default="{ row }">{{ formatLocalTime(row.lastSeen) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button :icon="View" text @click="openVideoLink(row)" :disabled="!row.href">
                  打开
                </el-button>
                <el-button text type="danger" @click="hideOneVideo(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <el-drawer v-model="settingsOpen" title="设置" size="420px">
      <el-alert
        title="提示：目前仅实现本地导入/合并/软删除/已用标记与导出。抖音侧“检测状态/对比更新脚本化”会按你后续插件脚本方案再接入。"
        type="info"
        :closable="false"
      />
      <div class="settings">
        <el-divider>显示</el-divider>
        <el-checkbox v-model="showUsedOnly">仅显示已使用</el-checkbox>
        <el-checkbox v-model="showLostOnly">仅显示疑似已删</el-checkbox>
        <el-checkbox v-model="showHidden">显示已删除（隐藏）</el-checkbox>

        <el-divider>操作</el-divider>
        <el-button :icon="Refresh" @click="reloadDb">重新加载数据库</el-button>
      </div>
    </el-drawer>
  </el-container>
</template>

<style scoped>
.app-root {
  height: 100vh;
  background: #f6f7fb;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #e6e8ee;
  background: #ffffff;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search {
  width: 420px;
}

.app-body {
  height: calc(100vh - 60px);
}

.aside {
  padding: 14px;
}

.main {
  padding: 14px 14px 14px 0;
}

.panel {
  border-radius: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.panel-title {
  font-weight: 700;
}

.panel-subtitle {
  color: #909399;
  font-size: 12px;
}

.up-menu {
  border-right: none;
}

.up-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.up-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aside-actions {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f7fb;
  border: 1px solid #ebeef5;
}

.stat .k {
  color: #909399;
  font-size: 12px;
}

.stat .v {
  font-size: 18px;
  font-weight: 700;
  margin-top: 4px;
}

.import-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-cell .t {
  font-weight: 600;
}

.title-cell .s {
  color: #909399;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

:deep(.row-lost) td {
  color: #a8abb2;
  text-decoration: line-through;
}

:deep(.row-used) td {
  opacity: 0.75;
}

:deep(.row-hidden) td {
  opacity: 0.45;
}
</style>
