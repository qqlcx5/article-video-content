<script setup lang="ts">
import { computed, onMounted, ref, provide } from "vue";
import { ElMessage } from "element-plus";
import type { IAppDatabase, UpKey } from "./app-database";
import { createEmptyAppDatabase } from "./app-database";
import { loadAppDatabase } from "./app-ops";
import { createTauriAppDatabaseRepository } from "./tauri/app-database-repository";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import { parseCrawlerVideosFromUnknown } from "./parse";
import { syncManyUpVideoData, type SyncUpVideoDataInput } from "./app-ops";
import BasicLayout from "./layouts/BasicLayout.vue";

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

const db = ref<IAppDatabase>(createEmptyAppDatabase());
const repoReady = ref(false);
const isLoading = ref(false);
const selectedUpKey = ref<UpKey>("");

// 提供全局数据给子组件
provide("db", db);
provide("selectedUpKey", selectedUpKey);

const upList = computed(() => {
  const items = Object.values(db.value.ups);
  return items
    .map((up) => ({
      ...up,
      totalVideos: up.videos.filter((v) => !v.isHidden).length
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "zh-Hans-CN"));
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

    const addedVideos = inputs.reduce((sum, input) => {
      const beforeUp = beforeDb.ups[input.upKey];
      const beforeIds = new Set((beforeUp?.videos ?? []).map((v) => v.id));
      const afterUp = nextDb.ups[input.upKey];
      if (!afterUp) return sum;

      return sum + afterUp.videos.filter((v) => !beforeIds.has(v.id)).length;
    }, 0);

    const lostVideos = inputs.reduce((sum, input) => {
      const afterUp = nextDb.ups[input.upKey];
      if (!afterUp) return sum;
      return sum + afterUp.videos.filter((v) => !v.isHidden && v.localStatus === "lost").length;
    }, 0);

    if (!selectedUpKey.value) {
      selectedUpKey.value = upList.value[0]?.key ?? "";
    }

    ElMessage.success(
      `导入完成：${filePaths.length} 个文件 / ${uniqStrings(inputs.map((i) => i.upKey)).length} 个UP主；新增视频约 ${addedVideos}；疑似已删 ${lostVideos}`
    );
  } catch (e) {
    ElMessage.error(`导入失败：${String(e)}`);
  } finally {
    isLoading.value = false;
  }
}

function updateDb(newDb: IAppDatabase) {
  db.value = newDb;
}

function updateSelectedUpKey(key: UpKey) {
  selectedUpKey.value = key;
}

onMounted(async () => {
  await reloadDb();
});
</script>

<template>
  <BasicLayout
    :up-list="upList"
    :selected-up-key="selectedUpKey"
    :stats="stats"
    @select-up="updateSelectedUpKey"
    @reload-db="reloadDb"
    @import-json="importJsonFiles"
  >
    <RouterView
      :db="db"
      :selected-up-key="selectedUpKey"
      @update:db="updateDb"
      @update:selected-up-key="updateSelectedUpKey"
      @reload-db="reloadDb"
    />
  </BasicLayout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
