<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Database,
  Trash2,
  Download,
  Upload,
  FolderOpen,
  HardDrive,
  RefreshCw,
  Check,
  Cloud,
  CloudOff
} from "lucide-vue-next";
import Button from "../components/ui/Button.vue";
import Card from "../components/ui/Card.vue";
import Input from "../components/ui/Input.vue";
import type { IAppDatabase } from "../app-database";
import { createTauriAppDatabaseRepository } from "../tauri/app-database-repository";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

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
const webdavFileList = ref<Array<{ name: string; href: string }>>([]);
const showWebdavFileList = ref(false);

// WebDAV 配置
const webdavConfig = reactive({
  url: "https://dav.jianguoyun.com/dav/",
  username: "893917884@qq.com",
  password: "areb8rx6yqpk8e8i",
  path: "/up_videos_backup"
});
const isTestingWebdav = ref(false);
const webdavConnected = ref(false);

// S3 兼容存储配置
const s3Config = reactive({
  bucket: "cherry-studio",
  region: "cn-south-1",
  accessKeyId: "JlZCYlupd9dy-ZwT-5g3WDR_AmUTgQPa1U23-UX8",
  secretAccessKey: "tUF3njBtLrVdXKs3G0m5Ptx4X8o50big3Zb1lEhF",
  endpoint: "http://appx.s3.cn-south-1.qiniucs.com", // 非AWS S3需要配置，如阿里云OSS、腾讯云COS、Cloudflare R2
  customDomain: "" // 可选：自定义域名
});
const isTestingS3 = ref(false);
const s3Connected = ref(false);
const s3FileList = ref<Array<{ name: string; size: number; lastModified: string }>>([]);
const showS3FileList = ref(false);

// AI API 配置
const aiApiConfig = reactive({
  url: "https://get-notes.luojilab.com/voicenotes/web/notes/stream",
  token: "",
  promptTemplate: `**这个问题，世界上谁最懂？TA 会怎么说? 写出他们的思考过程？**

最强大脑、顶级专家、世界级、best minds

## 原则
1. **找真正最懂的** — 不是找"合适的"，是找"最强的"
2. **基于真实** — 模拟要基于 TA 公开的思想、著作、言论
3. **引用原话** — 尽可能用 TA 说过的话`
});
const isSavingAiConfig = ref(false);

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

// 加载 AI API 配置
async function loadAiApiConfig() {
  try {
    const configStr = localStorage.getItem("aiApiConfig");
    if (configStr) {
      const config = JSON.parse(configStr);
      Object.assign(aiApiConfig, config);
    }
  } catch (e) {
    console.error("加载AI配置失败:", e);
  }
}

// 保存 AI API 配置
async function saveAiApiConfig() {
  try {
    isSavingAiConfig.value = true;

    if (!aiApiConfig.url) {
      ElMessage.warning("请输入 API 地址");
      return;
    }

    if (!aiApiConfig.token) {
      ElMessage.warning("请输入 Authorization Token");
      return;
    }

    if (!aiApiConfig.promptTemplate) {
      ElMessage.warning("请输入 Prompt 模板");
      return;
    }

    // 保存到 localStorage
    localStorage.setItem("aiApiConfig", JSON.stringify(aiApiConfig));

    ElMessage.success("AI API 配置已保存");
  } catch (e) {
    ElMessage.error(`保存失败：${String(e)}`);
  } finally {
    isSavingAiConfig.value = false;
  }
}

// 初始化时加载配置
loadAiApiConfig();

// 加载 S3 配置
async function loadS3Config() {
  try {
    const configStr = localStorage.getItem("s3Config");
    if (configStr) {
      const config = JSON.parse(configStr);
      Object.assign(s3Config, config);
    }
  } catch (e) {
    console.error("加载S3配置失败:", e);
  }
}

// 保存 S3 配置
async function saveS3Config() {
  try {
    localStorage.setItem("s3Config", JSON.stringify(s3Config));
  } catch (e) {
    console.error("保存S3配置失败:", e);
  }
}

// 测试 S3 连接
async function testS3Connection() {
  if (!s3Config.bucket) {
    ElMessage.warning("请先输入 Bucket 名称");
    return;
  }
  if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
    ElMessage.warning("请先输入 Access Key ID 和 Secret Access Key");
    return;
  }

  try {
    isTestingS3.value = true;
    const result = await invoke<string>("s3_test_connection", {
      config: s3Config
    });
    if (result === "success") {
      s3Connected.value = true;
      await saveS3Config();
      ElMessage.success("S3 存储连接成功！");
    } else {
      s3Connected.value = false;
      ElMessage.error(`S3 连接失败：${result}`);
    }
  } catch (e) {
    s3Connected.value = false;
    ElMessage.error(`S3 连接失败：${String(e)}`);
  } finally {
    isTestingS3.value = false;
  }
}

// 导出到 S3
async function exportToS3() {
  if (!s3Connected.value) {
    ElMessage.warning("请先测试 S3 连接");
    return;
  }

  try {
    isExporting.value = true;

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

    const jsonData = JSON.stringify(exportData, null, 2);
    const filename = `up_videos_backup_${Date.now()}.json`;

    const success = await invoke<boolean>("s3_upload", {
      config: s3Config,
      filename,
      content: jsonData
    });

    if (success) {
      ElMessage.success(`已导出到 S3：${filename}`);
    } else {
      ElMessage.error("导出失败：服务器返回错误");
    }
  } catch (e) {
    ElMessage.error(`导出失败：${String(e)}`);
  } finally {
    isExporting.value = false;
  }
}

// 从 S3 导入
async function importFromS3() {
  if (!s3Connected.value) {
    ElMessage.warning("请先测试 S3 连接");
    return;
  }

  try {
    isImporting.value = true;

    const files = await invoke<Array<{ name: string; size: number; lastModified: string }>>("s3_list_files", {
      config: s3Config
    });

    if (!files || files.length === 0) {
      ElMessage.info("S3 上没有找到备份文件");
      return;
    }

    files.sort((a, b) => b.name.localeCompare(a.name));
    s3FileList.value = files;
    showS3FileList.value = true;
  } catch (e) {
    ElMessage.error(`获取文件列表失败：${String(e)}`);
  } finally {
    isImporting.value = false;
  }
}

// 下载并恢复选中的 S3 备份
async function restoreFromS3(file: { name: string; size: number; lastModified: string }) {
  try {
    isImporting.value = true;
    showS3FileList.value = false;

    await ElMessageBox.confirm(
      `从 S3 导入备份文件 ${file.name} 将覆盖当前数据，是否继续？`,
      "确认导入",
      {
        type: "warning",
        confirmButtonText: "继续",
        cancelButtonText: "取消"
      }
    );

    const jsonData = await invoke<string>("s3_download", {
      config: s3Config,
      filename: file.name
    });

    const imported = JSON.parse(jsonData);

    if (!imported.data || !imported.data.ups) {
      ElMessage.error("备份文件格式不正确");
      return;
    }

    const repo = await createTauriAppDatabaseRepository();
    await repo.save(imported.data);

    emit("reloadDb");
    ElMessage.success(`已从 S3 导入：${file.name}`);
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error(`导入失败：${String(e)}`);
    }
  } finally {
    isImporting.value = false;
  }
}

// 格式化 S3 文件时间
function formatS3FileTime(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch {
    return timeStr;
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// 初始化时加载 S3 配置
loadS3Config();

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

    await ElMessageBox.confirm(
      `导入数据库将覆盖当前数据，此操作不可撤销。是否继续？`,
      "确认导入",
      {
        type: "warning",
        confirmButtonText: "继续",
        cancelButtonText: "取消"
      }
    );

    const repo = await createTauriAppDatabaseRepository();

    // 直接保存导入的数据库
    await repo.save(imported.data);

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
    const currentDb = await repo.load();

    let clearedCount = 0;
    for (const [key, up] of Object.entries(currentDb.ups)) {
      const visibleVideos = up.videos.filter((v) => !v.isHidden);
      if (visibleVideos.length < up.videos.length) {
        currentDb.ups[key] = { ...up, videos: visibleVideos };
        clearedCount += up.videos.length - visibleVideos.length;
      }
    }

    if (clearedCount > 0) {
      await repo.save(currentDb);
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
    await ElMessageBox.confirm(
      "此操作将清空所有数据，不可撤销！是否继续？",
      "危险操作",
      {
        type: "error",
        confirmButtonText: "清空",
        cancelButtonText: "取消"
      }
    );

    const repo = await createTauriAppDatabaseRepository();
    const emptyDb = {
      schemaVersion: 1 as const,
      ups: {}
    };

    await repo.save(emptyDb);
    emit("reloadDb");
    ElMessage.success("所有数据已清空");
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error(`清空失败：${String(e)}`);
    }
  }
}

// ============ WebDAV 相关功能 ============

// 测试 WebDAV 连接
async function testWebdavConnection() {
  if (!webdavConfig.url) {
    ElMessage.warning("请先输入 WebDAV 服务器地址");
    return;
  }

  try {
    isTestingWebdav.value = true;

    const result = await invoke<string>("webdav_test_connection", {
      config: webdavConfig
    });

    if (result === "success") {
      webdavConnected.value = true;
      ElMessage.success("WebDAV 连接成功！");
    } else {
      webdavConnected.value = false;
      ElMessage.error(`WebDAV 连接失败：${result}`);
    }
  } catch (e) {
    webdavConnected.value = false;
    ElMessage.error(`WebDAV 连接失败：${String(e)}`);
  } finally {
    isTestingWebdav.value = false;
  }
}

// WebDAV 导出
async function exportToWebdav() {
  if (!webdavConnected.value) {
    ElMessage.warning("请先测试 WebDAV 连接");
    return;
  }

  try {
    isExporting.value = true;

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

    const jsonData = JSON.stringify(exportData, null, 2);
    const filename = `up_videos_backup_${Date.now()}.json`;

    const success = await invoke<boolean>("webdav_upload", {
      config: webdavConfig,
      filename,
      content: jsonData
    });

    if (success) {
      ElMessage.success(`已导出到 WebDAV：${filename}`);
    } else {
      ElMessage.error("导出失败：服务器返回错误");
    }
  } catch (e) {
    ElMessage.error(`导出失败：${String(e)}`);
  } finally {
    isExporting.value = false;
  }
}

// WebDAV 导入
async function importFromWebdav() {
  if (!webdavConnected.value) {
    ElMessage.warning("请先测试 WebDAV 连接");
    return;
  }

  try {
    isImporting.value = true;

    // 获取文件列表
    const files = await invoke<Array<{ name: string; href: string }>>("webdav_list_files", {
      config: webdavConfig
    });

    if (!files || files.length === 0) {
      ElMessage.info("WebDAV 上没有找到备份文件");
      return;
    }

    // 按文件名排序（最新的在前）
    files.sort((a, b) => b.name.localeCompare(a.name));
    webdavFileList.value = files;
    showWebdavFileList.value = true;
  } catch (e) {
    ElMessage.error(`获取文件列表失败：${String(e)}`);
  } finally {
    isImporting.value = false;
  }
}

// 下载并恢复选中的备份
async function restoreFromWebdav(file: { name: string; href: string }) {
  try {
    isImporting.value = true;
    showWebdavFileList.value = false;

    await ElMessageBox.confirm(
      `从 WebDAV 导入备份文件 ${file.name} 将覆盖当前数据，是否继续？`,
      "确认导入",
      {
        type: "warning",
        confirmButtonText: "继续",
        cancelButtonText: "取消"
      }
    );

    // 下载文件
    const jsonData = await invoke<string>("webdav_download", {
      config: webdavConfig,
      filename: file.name
    });

    const imported = JSON.parse(jsonData);

    if (!imported.data || !imported.data.ups) {
      ElMessage.error("备份文件格式不正确");
      return;
    }

    // 导入数据
    const repo = await createTauriAppDatabaseRepository();
    await repo.save(imported.data);

    emit("reloadDb");
    ElMessage.success(`已从 WebDAV 导入：${file.name}`);
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error(`导入失败：${String(e)}`);
    }
  } finally {
    isImporting.value = false;
  }
}

// 格式化文件名显示
function formatFileName(filename: string): string {
  // 文件名格式: up_videos_backup_1234567890.json
  const match = filename.match(/up_videos_backup_(\d+)\.json/);
  if (match) {
    const timestamp = parseInt(match[1]);
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  return filename;
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

      <!-- WebDAV Backup -->
      <Card class="mb-4">
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Cloud :size="18" />
              <span>WebDAV 云备份</span>
            </div>
            <div :class="['status-badge', webdavConnected ? 'status-ok' : 'status-off']">
              <CloudOff v-if="!webdavConnected" :size="14" />
              <Check v-else :size="14" />
              <span>{{ webdavConnected ? "已连接" : "未连接" }}</span>
            </div>
          </div>

          <div class="webdav-config">
            <div class="form-group">
              <label class="form-label">服务器地址</label>
              <Input
                v-model="webdavConfig.url"
                placeholder="https://dav.example.com"
                :disabled="webdavConnected"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <Input
                  v-model="webdavConfig.username"
                  placeholder="username"
                  :disabled="webdavConnected"
                />
              </div>
              <div class="form-group">
                <label class="form-label">密码</label>
                <Input
                  v-model="webdavConfig.password"
                  type="password"
                  placeholder="•••••••"
                  :disabled="webdavConnected"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">备份路径</label>
              <Input
                v-model="webdavConfig.path"
                placeholder="/up_videos_backup"
                :disabled="webdavConnected"
              />
            </div>

            <div class="action-buttons">
              <Button
                variant="default"
                :icon="RefreshCw"
                :loading="isTestingWebdav"
                @click="testWebdavConnection"
              >
                测试连接
              </Button>
            </div>
          </div>

          <div class="action-section">
            <h3 class="section-title">云备份操作</h3>
            <div class="action-buttons">
              <Button
                variant="default"
                :icon="Upload"
                :loading="isExporting"
                :disabled="!webdavConnected"
                @click="exportToWebdav"
              >
                导出到云端
              </Button>
              <Button
                variant="default"
                :icon="Download"
                :loading="isImporting"
                :disabled="!webdavConnected"
                @click="importFromWebdav"
              >
                从云端恢复
              </Button>
            </div>
            <p class="action-hint">
              支持 WebDAV 协议的云存储服务（如坚果云、Nextcloud 等）。导出会自动创建备份文件，导入会自动选择最新的备份文件。
            </p>
          </div>
        </template>
      </Card>

      <!-- S3 兼容存储备份 -->
      <Card class="mb-4">
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Cloud :size="18" />
              <span>S3 兼容存储备份</span>
            </div>
            <div :class="['status-badge', s3Connected ? 'status-ok' : 'status-off']">
              <CloudOff v-if="!s3Connected" :size="14" />
              <Check v-else :size="14" />
              <span>{{ s3Connected ? "已连接" : "未连接" }}</span>
            </div>
          </div>

          <div class="s3-config">
            <div class="form-group">
              <label class="form-label">Bucket 名称</label>
              <Input v-model="s3Config.bucket" placeholder="my-bucket" :disabled="s3Connected" />
            </div>
            <div class="form-group">
              <label class="form-label">Region（区域）</label>
              <Input v-model="s3Config.region" placeholder="us-east-1" :disabled="s3Connected" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Access Key ID</label>
                <Input
                  v-model="s3Config.accessKeyId"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  :disabled="s3Connected"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Secret Access Key</label>
                <Input
                  v-model="s3Config.secretAccessKey"
                  type="password"
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  :disabled="s3Connected"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Endpoint（可选，非 AWS S3 必填）</label>
              <Input
                v-model="s3Config.endpoint"
                placeholder="https://oss-cn-hangzhou.aliyuncs.com"
                :disabled="s3Connected"
              />
            </div>
            <div class="form-group">
              <label class="form-label">自定义域名（可选）</label>
              <Input
                v-model="s3Config.customDomain"
                placeholder="https://cdn.example.com"
                :disabled="s3Connected"
              />
            </div>

            <div class="action-buttons">
              <Button
                variant="default"
                :icon="RefreshCw"
                :loading="isTestingS3"
                @click="testS3Connection"
              >
                测试连接
              </Button>
            </div>
          </div>

          <div class="action-section">
            <h3 class="section-title">云备份操作</h3>
            <div class="action-buttons">
              <Button
                variant="default"
                :icon="Upload"
                :loading="isExporting"
                :disabled="!s3Connected"
                @click="exportToS3"
              >
                导出到云端
              </Button>
              <Button
                variant="default"
                :icon="Download"
                :loading="isImporting"
                :disabled="!s3Connected"
                @click="importFromS3"
              >
                从云端恢复
              </Button>
            </div>
            <p class="action-hint">
              支持 AWS S3 API 兼容的对象存储服务，包括 AWS S3、Cloudflare R2、阿里云 OSS、腾讯云 COS 等。
              Endpoint 为非 AWS S3 服务的 API 地址。
            </p>
          </div>
        </template>
      </Card>

      <!-- AI API Configuration -->
      <Card class="mb-4">
        <template #default>
          <div class="card-header">
            <div class="card-title">
              <Database :size="18" />
              <span>AI 笔记生成配置</span>
            </div>
          </div>

          <div class="ai-api-config">
            <div class="form-group">
              <label class="form-label">API 地址</label>
              <Input
                v-model="aiApiConfig.url"
                placeholder="https://get-notes.luojilab.com/voicenotes/web/notes/stream"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Authorization Token</label>
              <Input
                v-model="aiApiConfig.token"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsInZlciI6Mn0..."
              />
            </div>
            <div class="form-group">
              <label class="form-label">Prompt 模板</label>
              <textarea
                v-model="aiApiConfig.promptTemplate"
                class="form-textarea"
                rows="8"
                placeholder="输入 AI 笔记生成的 Prompt 模板..."
              />
            </div>

            <div class="action-buttons">
              <Button
                variant="default"
                :loading="isSavingAiConfig"
                @click="saveAiApiConfig"
              >
                保存配置
              </Button>
            </div>
          </div>

          <div class="action-section">
            <h3 class="section-title">使用说明</h3>
            <p class="action-hint">
              配置 AI API 后，在视频管理页面选中视频，点击"生成AI笔记"按钮即可生成笔记。
              生成的笔记将保存在应用数据目录的 ai_notes 文件夹中。
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
              <span class="about-value">短视频管理</span>
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

    <!-- WebDAV 文件列表弹窗 -->
    <el-dialog
      v-model="showWebdavFileList"
      title="选择要恢复的备份文件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="file-list">
        <div
          v-for="file in webdavFileList"
          :key="file.name"
          class="file-item"
          @click="restoreFromWebdav(file)"
        >
          <div class="file-info">
            <Download :size="20" />
            <div class="file-details">
              <div class="file-name">{{ formatFileName(file.name) }}</div>
              <div class="file-original">{{ file.name }}</div>
            </div>
          </div>
          <Upload :size="18" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showWebdavFileList = false">取消</Button>
      </template>
    </el-dialog>

    <!-- S3 文件列表弹窗 -->
    <el-dialog
      v-model="showS3FileList"
      title="选择要恢复的备份文件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="file-list">
        <div
          v-for="file in s3FileList"
          :key="file.name"
          class="file-item"
          @click="restoreFromS3(file)"
        >
          <div class="file-info">
            <Download :size="20" />
            <div class="file-details">
              <div class="file-name">{{ formatS3FileTime(file.lastModified) }}</div>
              <div class="file-original">{{ file.name }} · {{ formatFileSize(file.size) }}</div>
            </div>
          </div>
          <Upload :size="18" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showS3FileList = false">取消</Button>
      </template>
    </el-dialog>
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

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-ok {
  background: rgba(34, 197, 94, 0.1);
  color: #16A34A;
}

.status-off {
  background: rgba(107, 114, 128, 0.1);
  color: #64748B;
}

.webdav-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 8px;
  margin-bottom: 16px;
}

.s3-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: #71717A;
}

.ai-api-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  background: #FFFFFF;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #18181B;
  box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.1);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #F9F9FB;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #F3F4F6;
  border-color: rgba(0, 0, 0, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #18181B;
}

.file-original {
  font-size: 11px;
  color: #71717A;
}
</style>
