<script setup lang="ts">
import { ref } from "vue";
import type { ILocalVideo } from "../src/types";
import { parseCrawlerVideosFromUnknown } from "../src/parse";
import { syncVideoData } from "../src/sync";
import { createTauriVideoRepository } from "../src/tauri/repository";

const videos = ref<ILocalVideo[]>([]);
const loading = ref(false);

async function openFileDialog(): Promise<string | null> {
  try {
    const dialog = await import("@tauri-apps/plugin-dialog");
    const selected = await dialog.open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    return typeof selected === "string" ? selected : null;
  } catch {
    const dialog = await import("@tauri-apps/api/dialog");
    const selected = await dialog.open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }]
    });
    return typeof selected === "string" ? selected : null;
  }
}

async function readTextFile(filePath: string): Promise<string> {
  try {
    const fs = await import("@tauri-apps/plugin-fs");
    return await fs.readTextFile(filePath);
  } catch {
    const fs = await import("@tauri-apps/api/fs");
    return await fs.readTextFile(filePath);
  }
}

const rowClass = ({ row }: { row: ILocalVideo }) => {
  if (row.localStatus === "lost") return "row-lost";
  if (row.isUsed) return "row-used";
  return "";
};

async function onImportLatest() {
  loading.value = true;
  try {
    const filePath = await openFileDialog();
    if (!filePath) return;

    const raw = await readTextFile(filePath);
    const parsed: unknown = JSON.parse(raw);
    const latestVideos = parseCrawlerVideosFromUnknown(parsed);

    const repo = await createTauriVideoRepository({ fileName: "app_database.json" });
    videos.value = await syncVideoData(latestVideos, repo);
  } finally {
    loading.value = false;
  }
}

async function onGenerateScript(row: ILocalVideo) {
  // TODO: 调用你的“生成文稿 API”，成功后把 isUsed 置为 true
  // 示例：await setVideoUsed(row.id, true, repo)
  row.isUsed = true;
}
</script>

<template>
  <div class="video-manager">
    <el-button type="primary" :loading="loading" @click="onImportLatest">导入 crawler_result.json</el-button>

    <el-table
      style="width: 100%; margin-top: 12px"
      :data="videos"
      :row-class-name="rowClass"
      v-loading="loading"
    >
      <el-table-column prop="title" label="标题" min-width="320" />
      <el-table-column prop="likeCount" label="点赞" width="120" />
      <el-table-column label="状态" width="160">
        <template #default="{ row }">
          <span v-if="row.localStatus === 'lost'">可能已删除</span>
          <span v-else-if="row.isUsed">✅ 已使用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" :disabled="row.isUsed" @click="onGenerateScript(row)">
            生成文稿
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.row-lost {
  color: #a0a0a0;
  text-decoration: line-through;
}

.row-used {
  opacity: 0.55;
}
</style>

