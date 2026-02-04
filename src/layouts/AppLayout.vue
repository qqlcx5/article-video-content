<script setup lang="ts">
import { computed } from "vue";
import {
  Home,
  FolderOpen,
  Settings,
  RefreshCw,
  Upload,
  FileText,
  Database,
} from "lucide-vue-next";

export interface NavItem {
  id: string;
  label: string;
  icon: any;
}

const props = defineProps<{
  navItems?: NavItem[];
  activeNav?: string;
}>();

const emit = defineEmits<{
  (e: "nav-click", id: string): void;
}>();

const handleNavClick = (id: string) => {
  emit("nav-click", id);
};

// Default navigation items if not provided
const defaultNavItems: NavItem[] = [
  { id: "home", label: "主页", icon: Home },
  { id: "videos", label: "视频管理", icon: FolderOpen },
  { id: "reports", label: "报告", icon: FileText },
  { id: "database", label: "数据库", icon: Database },
  { id: "settings", label: "设置", icon: Settings },
];

const navItems = computed(() => props.navItems || defaultNavItems);
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="app-title">
          <span class="title-text">短视频管理</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          :class="[
            'nav-item',
            activeNav === item.id ? 'nav-item-active' : ''
          ]"
          @click="handleNavClick(item.id)"
        >
          <component :is="item.icon" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="action-btn">
          <RefreshCw class="action-icon" />
          <span>刷新</span>
        </button>
        <button class="action-btn">
          <Upload class="action-icon" />
          <span>导入</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="main-header">
        <div class="header-title">
          <slot name="header-title">{{ navItems.find(i => i.id === activeNav)?.label || '主页' }}</slot>
        </div>
        <div class="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content-area">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #F9F9FB;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #F4F4F5;
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
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 0 10px;
  margin-bottom: 2px;
  border: none;
  background: transparent;
  color: #71717A;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.015em;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  color: #18181B;
}

.nav-item-active {
  background-color: rgba(0, 0, 0, 0.06);
  color: #18181B;
}

.nav-icon {
  width: 15px;
  height: 15px;
  stroke-width: 1.5;
}

.nav-label {
  flex: 1;
  text-align: left;
}

.sidebar-footer {
  padding: 10px 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 10px;
  border: none;
  background: transparent;
  color: #71717A;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
  color: #18181B;
}

.action-icon {
  width: 14px;
  height: 14px;
  stroke-width: 1.5;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FFFFFF;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background-color: #FFFFFF;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #18181B;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #F9F9FB;
}
</style>
