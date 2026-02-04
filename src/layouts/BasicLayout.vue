<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { RefreshCw, Upload, Settings, FolderOpen, X } from "lucide-vue-next";
import { ElMessageBox } from "element-plus";
import Button from "../components/ui/Button.vue";

interface UpInfo {
  key: string;
  displayName: string;
  totalVideos: number;
}

interface Props {
  upList: UpInfo[];
  selectedUpKey: string;
  stats: {
    totalVideos: number;
    usedVideos: number;
    lostVideos: number;
  };
}

interface Emits {
  (e: "selectUp", key: string): void;
  (e: "reloadDb"): void;
  (e: "importJson"): void;
  (e: "deleteUp", key: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const route = useRoute();

const currentPath = computed(() => route.path);

function navigateTo(path: string) {
  router.push(path);
}

function selectUp(key: string) {
  emit("selectUp", key);
  if (currentPath.value !== "/videos") {
    navigateTo("/videos");
  }
}

async function handleDeleteUp(up: UpInfo, event: Event) {
  event.stopPropagation();

  const ok = await ElMessageBox.confirm(
    `确定要删除 UP主"${up.displayName}"吗？这将删除其所有视频数据（包含 ${up.totalVideos} 个视频），此操作不可恢复。`,
    "删除确认",
    {
      type: "warning",
      confirmButtonText: "确定删除",
      cancelButtonText: "取消"
    }
  )
    .then(() => true)
    .catch(() => false);

  if (!ok) return;

  emit("deleteUp", up.key);
}
</script>

<template>
  <div class="basic-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Header -->
      <!-- <div class="sidebar-header">
        <h1 class="app-title">短视频管理</h1>
      </div> -->

      <!-- Navigation -->
      <div class="sidebar-nav">
        <div
          :class="['nav-item', { 'nav-item-active': currentPath === '/videos' }]"
          @click="navigateTo('/videos')"
        >
          <FolderOpen :size="16" />
          <span>视频管理</span>
        </div>
        <div
          :class="['nav-item', { 'nav-item-active': currentPath === '/settings' }]"
          @click="navigateTo('/settings')"
        >
          <Settings :size="16" />
          <span>设置</span>
        </div>
      </div>

      <!-- UP List -->
      <div class="sidebar-section" v-show="currentPath === '/videos'">
        <div class="section-header">
          <span class="section-title">UP主列表 ({{ upList.length }})</span>
          <Button variant="ghost" size="sm" :icon="RefreshCw" @click="$emit('reloadDb')" />
        </div>
        <div class="up-list">
          <div
            v-for="up in upList"
            :key="up.key"
            :class="['up-item', { 'up-item-active': selectedUpKey === up.key }]"
            @click="selectUp(up.key)"
          >
            <span class="up-name">{{ up.displayName }}</span>
            <div class="up-item-right">
              <button
              class="delete-btn"
              @click="handleDeleteUp(up, $event)"
              title="删除UP主"
              >
              <X :size="12" />
            </button>
            <span class="up-count">{{ up.totalVideos }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="sidebar-actions">
        <Button variant="default" size="sm" :icon="Upload" @click="$emit('importJson')" class="w-full">
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
      <slot />
    </main>
  </div>
</template>

<style scoped>
.basic-layout {
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

.sidebar-nav {
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 2px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  color: #52525B;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  color: #18181B;
}

.nav-item-active {
  background-color: rgba(0, 0, 0, 0.08);
  color: #18181B;
  font-weight: 500;
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

.up-item-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.up-count {
  font-size: 11px;
  font-weight: 500;
  color: #71717A;
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
}

.delete-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: #EF4444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.up-item:hover .delete-btn {
  display: flex;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
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
