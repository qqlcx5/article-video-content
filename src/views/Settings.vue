<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import {
  Database,
  Trash2,
  Download,
  Upload,
  FolderOpen,
  HardDrive,
  RefreshCw,
  Check
} from "lucide-vue-next";
import Button from "../components/ui/Button.vue";
import Card from "../components/ui/Card.vue";
import Input from "../components/ui/Input.vue";
import type { IAppDatabase } from "../app-database";
import { createTauriAppDatabaseRepository } from "../tauri/app-database-repository";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";

interface Props {
  db: IAppDatabase;
}

interface Emits {
  (e: "update:db", db: IAppDatabase): void;
  (e: "reloadDb"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isExporting = ref(false);
const isImporting = ref(false);
const isClearing = ref(false);

// 数据库统计
const dbStats = reactive({
  totalUps: 0,
  totalVideos: 0,
  hiddenVideos: 0,
  usedVideos: 0,
  lostVideos: 0,
  dbSize: "0 MB"
});

// 更新统计信息
function updateStats() {
  const ups = Object.values(props.db.ups);
  const allVideos = ups.flatMap((u) => u.videos);

  dbStats.totalUps = ups.length;
  dbStats.totalVideos = allVideos.filter((v) => !v.isHidden).length;
  dbStats.hiddenVideos = allVideos.filter((v) => v.isHidden).length;
  dbStats.usedVideos = allVideos.filter((v) => v.isUsed).length;
  dbStats.lostVideos = allVideos.filter((v) => v.localStatus === "lost").length;
}

// 初始化时更新统计
updateStats();

// 导出完整数据库
async function exportFullDatabase() {
  try {
    isExporting.value = true;

    const filePath = await save({
      defaultPath: `up_videos_db_backup_${Date.now()}.json`,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    if (!filePath) return;

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      stats: {
        totalUps: dbStats.totalUps,
        totalVideos: dbStats.totalVideos,
        hiddenVideos: dbStats.hiddenVideos,
        usedVideos: dbStats.usedVideos,
        lostVideos: dbStats.lostVideos
      },
      data: props.db
    };

    await writeTextFile(filePath, JSON.stringify(exportData, null, 2));
    ElMessage.success(`数据库已导出到：${filePath}`);
  } catch (e) {
    ElMessage.error(`导出失败：${String(e)}`);
  } finally {
    isExporting.value = false;
  }
}

// 导入数据库
async function importDatabase() {
  try {
    isImporting.value = true;

    const filePath = await open({
      filters: [{ name: "JSON", extensions: ["json"] }]
    });

    if (!filePath) return;

    const raw = await readTextFile(filePath);
    const imported = JSON.parse(raw);

    if (!imported.data || !imported.data.ups) {
      ElMessage.error("文件格式不正确，缺少有效的数据库数据");
      return;
    }

    const confirm = await ElMessage.confirm(
      `导入数据库将覆盖当前数据，此操作不可撤销。是否继续？`,
      "确认导入",
      {
        type: "warning",
        confirmButtonText: "继续",
        cancelButtonText: "取消"
      }
    );

    const repo = await createTauriAppDatabaseRepository();

    // 保存导入的数据
    for (const [key, up] of Object.entries(imported.data.ups)) {
      await repo.saveUp(up as any);
    }

    emit("reloadDb");
    ElMessage.success("数据库导入成功");
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error(`导入失败：${String(e)}`);
    }
  } finally {
    isImporting.value = false;
  }
}

// 清空隐藏视频
async function clearHiddenVideos() {
  try {
    isClearing.value = true;

    const repo = await createTauriAppDatabaseRepository();
    const ups = Object.values(props.db.ups);

    let clearedCount = 0;
    for (const up of ups) {
      const visibleVideos = up.videos.filter((v) => !v.isHidden);
      if (visibleVideos.length < up.videos.length) {
        const updated = { ...up, videos: visibleVideos };
        await repo.saveUp(updated);
        clearedCount += up.videos.length - visibleVideos.length;
      }
    }

    if (clearedCount > 0) {
      emit("reloadDb");
      ElMessage.success(`已清理 ${clearedCount} 个隐藏视频`);
    } else {
      ElMessage.info("没有找到隐藏视频");
    }
  } catch (e) {
    ElMessage.error(`清理失败：${String(e)}`);
  } finally {
    isClearing.value = false;
  }
}

// 清空所有数据
async function clearAllData() {
  try {
    const confirm = await ElMessage.confirm(
      "此操作将清空所有数据，不可撤销！请输入 'DELETE ALL' 确认：",
      "危险操作",
      {
        type: "error",
        confirmButtonText: "清空",
        cancelButtonText: "取消"
      }
    );

    const repo = await createTauriAppDatabaseRepository();
    await repo.clear();

    emit("reloadDb");
    ElMessage.success("所有数据已清空");
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error(`清空失败：${String(e)}`);
    }
  }
}
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <header class="content-header">
      <div class="header-left">
        <h2 class="page-title">设置</h2>
        <span class="page-subtitle">管理数据库和应用设置</span>
      </div>
    </header>

    <!-- Content -->
    <div class="content-body">
      <!-- Database Stats -->
      <Card class="mb-4">
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Database :size="18" />
              <span>数据库概览</span>
            </div>
            <Button variant="ghost" size="sm" :icon="RefreshCw" @click="updateStats">
              刷新
            </Button>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <FolderOpen :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ dbStats.totalUps }}</div>
                <div class="stat-label">UP主数量</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">
                <HardDrive :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ dbStats.totalVideos }}</div>
                <div class="stat-label">视频总数</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon stat-used">
                <Check :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ dbStats.usedVideos }}</div>
                <div class="stat-label">已使用</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon stat-lost">
                <Trash2 :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ dbStats.lostVideos }}</div>
                <div class="stat-label">疑似已删</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon stat-hidden">
                <Database :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ dbStats.hiddenVideos }}</div>
                <div class="stat-label">已隐藏</div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Data Management -->
      <Card class="mb-4">
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Database :size="18" />
              <span>数据管理</span>
            </div>
          </div>

          <div class="action-section">
            <h3 class="section-title">备份与恢复</h3>
            <div class="action-buttons">
              <Button
                variant="default"
                :icon="Download"
                :loading="isExporting"
                @click="exportFullDatabase"
              >
                导出完整数据库
              </Button>
              <Button
                variant="default"
                :icon="Upload"
                :loading="isImporting"
                @click="importDatabase"
              >
                导入数据库备份
              </Button>
            </div>
            <p class="action-hint">
              导出数据库会保存所有UP主和视频数据，可用于数据迁移或备份恢复。
            </p>
          </div>

          <div class="action-section">
            <h3 class="section-title">数据清理</h3>
            <div class="action-buttons">
              <Button
                variant="ghost"
                :icon="Trash2"
                :loading="isClearing"
                @click="clearHiddenVideos"
              >
                清理隐藏视频
              </Button>
              <Button
                variant="ghost"
                :icon="Trash2"
                @click="clearAllData"
                class="text-red-600"
              >
                清空所有数据
              </Button>
            </div>
            <p class="action-hint">
              清理隐藏视频将永久删除所有已隐藏的视频记录。清空所有数据将删除所有数据且不可恢复。
            </p>
          </div>
        </template>
      </Card>

      <!-- About -->
      <Card>
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Database :size="18" />
              <span>关于</span>
            </div>
          </div>

          <div class="about-content">
            <div class="about-item">
              <span class="about-label">应用名称</span>
              <span class="about-value">抖音UP主视频管理器</span>
            </div>
            <div class="about-item">
              <span class="about-label">版本</span>
              <span class="about-value">1.0.0</span>
            </div>
            <div class="about-item">
              <span class="about-label">数据存储</span>
              <span class="about-value">本地 SQLite</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
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

.content-body {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #18181B;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 8px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFFFFF;
  border-radius: 8px;
  color: #71717A;
}

.stat-icon.stat-used {
  color: #16A34A;
  background: rgba(34, 197, 94, 0.1);
}

.stat-icon.stat-lost {
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.1);
}

.stat-icon.stat-hidden {
  color: #71717A;
  background: rgba(113, 113, 122, 0.1);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #18181B;
}

.stat-label {
  font-size: 12px;
  color: #71717A;
}

.action-section {
  margin-bottom: 24px;
}

.action-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #18181B;
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.action-hint {
  font-size: 12px;
  color: #71717A;
  line-height: 1.5;
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.about-item:last-child {
  border-bottom: none;
}

.about-label {
  font-size: 13px;
  color: #71717A;
}

.about-value {
  font-size: 13px;
  font-weight: 500;
  color: #18181B;
}
</style>
