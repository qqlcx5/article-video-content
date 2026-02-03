import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/videos"
  },
  {
    path: "/videos",
    name: "VideoManager",
    component: () => import("../views/VideoManager.vue"),
    meta: { title: "视频管理" }
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { title: "设置" }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
