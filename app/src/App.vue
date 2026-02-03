<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { IAppDatabase, IUpStore } from "@core/app-database";
import type { IAppDatabaseRepository } from "@core/app-database-repository";
import type { ICrawlerVideo, ILocalVideo } from "@core/types";
import {
  createEmptyAppDatabase,
  parseAppDatabaseFromUnknown,
  serializeAppDatabase
} from "@core/app-database";
import { parseCrawlerVideosFromUnknown } from "@core/parse";
import { generateRequestScript } from "@core/request-script";
import { setUpVideosHidden, setUpVideosUsed, syncManyUpVideoData } from "@core/app-ops";
import { createTauriAppDatabaseRepository } from "@core/tauri/app-database-repository";

const STORAGE_KEY = "app_database.json";

const db = ref<IAppDatabase>(createEmptyAppDatabase());
const selectedUpKey = ref<string>("");
const selectedRows = ref<ILocalVideo[]>([]);
const loading = ref(false);
const lastImportCount = ref<number | null>(null);
const upSearch = ref("");
const videoSearch = ref("");
const showHidden = ref(false);

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && Boolean(window.__TAURI__);
}

const localStorageRepo: IAppDatabaseRepository = {
  async load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyAppDatabase();
    try {
      const parsed: unknown = JSON.parse(raw);
      return parseAppDatabaseFromUnknown(parsed);
    } catch {
      return createEmptyAppDatabase();
    }
  },
  async save(nextDb) {
    localStorage.setItem(STORAGE_KEY, serializeAppDatabase(nextDb));
  }
};

let cachedRepo: IAppDatabaseRepository | null = null;
async function getRepo(): Promise<IAppDatabaseRepository> {
  if (cachedRepo) return cachedRepo;
  if (isTauriRuntime()) {
    cachedRepo = await createTauriAppDatabaseRepository({ fileName: STORAGE_KEY });
  } else {
    cachedRepo = localStorageRepo;
  }
  return cachedRepo;
}

function ensureSelectedUp(dbValue: IAppDatabase) {
  if (selectedUpKey.value && dbValue.ups[selectedUpKey.value]) return;
  const keys = Object.keys(dbValue.ups);
  selectedUpKey.value = keys[0] ?? "";
}

async function reloadDb() {
  const repo = await getRepo();
  const next = await repo.load();
  db.value = next;
  ensureSelectedUp(next);
}

onMounted(() => {
  void reloadDb();
});

watch(selectedUpKey, () => {
  selectedRows.value = [];
});

const upList = computed<IUpStore[]>(() => {
  const list = Object.values(db.value.ups);
  const q = upSearch.value.trim().toLowerCase();
  const filtered = q
    ? list.filter((u) => u.displayName.toLowerCase().includes(q) || u.key.toLowerCase().includes(q))
    : list;
  return filtered.sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-Hans-CN"));
});

const selectedUp = computed<IUpStore | null>(() => {
  return selectedUpKey.value ? db.value.ups[selectedUpKey.value] ?? null : null;
});

const videos = computed<ILocalVideo[]>(() => {
  const up = selectedUp.value;
  if (!up) return [];
  const q = videoSearch.value.trim().toLowerCase();
  const base = showHidden.value ? up.videos : up.videos.filter((v) => !v.isHidden);
  if (!q) return base;
  return base.filter((v) => v.id.toLowerCase().includes(q) || v.title.toLowerCase().includes(q));
});

const rowClassName = ({ row }: { row: ILocalVideo }) => {
  if (row.isHidden) return "row-hidden";
  if (row.localStatus === "lost") return "row-lost";
  if (row.isUsed) return "row-used";
  return "";
};

const stats = computed(() => {
  const up = selectedUp.value;
  const list = up?.videos ?? [];
  const lost = list.filter((v) => v.localStatus === "lost").length;
  const used = list.filter((v) => v.isUsed).length;
  const hidden = list.filter((v) => v.isHidden).length;
  return {
    upTotal: Object.keys(db.value.ups).length,
    total: list.length,
    lost,
    used,
    hidden
  };
});

function upKeyFromFileName(fileName: string): string {
  const normalized = fileName.trim();
  if (!normalized) return "未命名";
  return normalized.replace(/\.json$/i, "");
}

async function onPickFiles(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = "";
  if (files.length === 0) return;

  loading.value = true;
  try {
    const repo = await getRepo();
    const inputs: { upKey: string; displayName: string; latestVideos: ICrawlerVideo[] }[] = [];

    let totalImported = 0;
    for (const file of files) {
      const raw = await file.text();
      const parsed: unknown = JSON.parse(raw);
      const latestVideos: ICrawlerVideo[] = parseCrawlerVideosFromUnknown(parsed);
      const upKey = upKeyFromFileName(file.name);
      totalImported += latestVideos.length;
      inputs.push({ upKey, displayName: upKey, latestVideos });
    }

    lastImportCount.value = totalImported;
    db.value = await syncManyUpVideoData(inputs, repo);
    ensureSelectedUp(db.value);
  } finally {
    loading.value = false;
  }
}

function downloadText(filename: string, text: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function onSelectionChange(rows: ILocalVideo[]) {
  selectedRows.value = rows;
}

async function onMarkUsed() {
  const up = selectedUp.value;
  if (!up) return;
  const ids = selectedRows.value.map((r) => r.id).filter(Boolean);
  if (ids.length === 0) return;
  const repo = await getRepo();
  const nextUp = await setUpVideosUsed(up.key, ids, true, repo);
  if (nextUp) db.value.ups[nextUp.key] = nextUp;
  selectedRows.value = [];
}

async function onHideSelected() {
  const up = selectedUp.value;
  if (!up) return;
  const ids = selectedRows.value.map((r) => r.id).filter(Boolean);
  if (ids.length === 0) return;
  const repo = await getRepo();
  const nextUp = await setUpVideosHidden(up.key, ids, true, repo);
  if (nextUp) db.value.ups[nextUp.key] = nextUp;
  selectedRows.value = [];
}

function onExportReport() {
  const up = selectedUp.value;
  if (!up) return;
  const payload = { upKey: up.key, displayName: up.displayName, videos: up.videos };
  downloadText(`${up.key}.report.json`, `${JSON.stringify(payload, null, 2)}\n`, "application/json");
}

function onExportRequestScript() {
  const up = selectedUp.value;
  if (!up) return;

  const picked = selectedRows.value.length > 0 ? selectedRows.value : null;
  const candidates = (picked ?? up.videos).filter(
    (v) => !v.isUsed && !v.isHidden && v.localStatus === "active"
  );

  const script = generateRequestScript(
    candidates.map((v) => ({ id: v.id, href: v.href, title: v.title })),
    { delayMs: 3000 }
  );
  downloadText(`${up.key}.request.js`, script, "application/javascript;charset=utf-8");
}
</script>

<template>
  <div class="page">
    <header class="header">
      <div class="title">
        <div class="name">抖音UP主视频管理</div>
        <div class="sub">
          运行环境：<b>{{ isTauriRuntime() ? "Tauri" : "Web" }}</b>
          <span v-if="lastImportCount !== null">｜本次导入 {{ lastImportCount }} 条</span>
        </div>
      </div>

      <div class="actions">
        <label class="file-btn">
          <input type="file" multiple accept=".json,application/json" @change="onPickFiles" />
          导入JSON
        </label>
        <el-button size="small" @click="reloadDb">刷新</el-button>
      </div>
    </header>

    <section class="content">
      <aside class="sidebar">
        <div class="sidebar-top">
          <el-input v-model="upSearch" size="small" clearable placeholder="搜索UP主" />
        </div>

        <div class="up-list">
          <button
            v-for="up in upList"
            :key="up.key"
            class="up-item"
            :class="{ active: up.key === selectedUpKey }"
            type="button"
            @click="selectedUpKey = up.key"
          >
            <span class="up-name">{{ up.displayName }}</span>
            <span class="up-count">{{ up.videos.length }}</span>
          </button>
          <div v-if="upList.length === 0" class="empty">还没有导入任何UP主数据</div>
        </div>

        <div class="stats-panel">
          <div class="stat-line">总UP主：{{ stats.upTotal }}</div>
          <div class="stat-line">当前UP视频：{{ stats.total }}</div>
          <div class="stat-line">已使用：{{ stats.used }}</div>
          <div class="stat-line">疑似删除：{{ stats.lost }}</div>
          <div class="stat-line">已隐藏：{{ stats.hidden }}</div>
        </div>
      </aside>

      <main class="main">
        <div class="main-top">
          <div class="main-title">
            <span v-if="selectedUp">{{ selectedUp.displayName }}</span>
            <span v-else>请选择UP主</span>
          </div>
          <div class="main-tools">
            <el-input v-model="videoSearch" size="small" clearable placeholder="搜索视频ID/标题" />
            <el-switch v-model="showHidden" active-text="显示隐藏" />
          </div>
        </div>

        <div class="ops">
          <el-button size="small" type="primary" :disabled="!selectedUp" @click="onExportRequestScript">
            导出请求脚本
          </el-button>
          <el-button size="small" :disabled="selectedRows.length === 0" @click="onMarkUsed">
            标记已用
          </el-button>
          <el-button size="small" :disabled="selectedRows.length === 0" @click="onHideSelected">
            隐藏选中
          </el-button>
          <el-button size="small" :disabled="!selectedUp" @click="onExportReport">导出报告</el-button>
        </div>

        <section class="table">
          <el-table
            :data="videos"
            :row-class-name="rowClassName"
            style="width: 100%"
            v-loading="loading"
            @selection-change="onSelectionChange"
          >
            <el-table-column type="selection" width="48" />
            <el-table-column prop="id" label="ID" width="230" />
            <el-table-column prop="title" label="标题" min-width="360" />
            <el-table-column prop="likeCount" label="点赞" width="110" />
            <el-table-column label="状态" width="160">
              <template #default="{ row }">
                <span v-if="row.isHidden">已隐藏</span>
                <span v-else-if="row.localStatus === 'lost'">可能已删除</span>
                <span v-else-if="row.isUsed">已使用</span>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </main>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 1260px;
  margin: 0 auto;
  padding: 18px 16px 28px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 14px 16px;
}

.name {
  font-size: 18px;
  font-weight: 700;
}

.sub {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}

.file-btn input {
  display: none;
}

.content {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.sidebar {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.sidebar-top {
  padding: 4px 4px 8px;
}

.up-list {
  flex: 1;
  overflow: auto;
  padding: 4px;
}

.up-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid transparent;
  background: transparent;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
}

.up-item:hover {
  background: #f7f8fb;
}

.up-item.active {
  border-color: #dbe4ff;
  background: #eef2ff;
}

.up-name {
  font-weight: 700;
  font-size: 13px;
  color: #111827;
}

.up-count {
  font-size: 12px;
  color: #6b7280;
}

.empty {
  padding: 14px 10px;
  font-size: 12px;
  color: #6b7280;
}

.stats-panel {
  border-top: 1px solid #eef0f5;
  padding: 10px 8px 4px;
  font-size: 12px;
  color: #374151;
}

.stat-line {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-top {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.main-title {
  font-weight: 800;
  color: #111827;
}

.main-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ops {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.table {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 14px;
  padding: 10px;
}

:deep(.row-lost) {
  color: #9ca3af;
  text-decoration: line-through;
}

:deep(.row-used) {
  opacity: 0.55;
}

:deep(.row-hidden) {
  opacity: 0.3;
}
</style>
