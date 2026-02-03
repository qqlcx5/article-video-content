<script setup lang="ts">
import { computed, ref } from "vue";
import type { ICrawlerVideo, ILocalVideo, IVideoRepository } from "../src";
import { setVideoUsed, syncVideoData } from "../src";

const STORAGE_KEY = "app_database.json";

const localStorageRepo: IVideoRepository = {
  async load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ILocalVideo[];
    } catch {
      return [];
    }
  },
  async save(videos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }
};

const videos = ref<ILocalVideo[]>([]);

const tableRowClassName = ({ row }: { row: ILocalVideo }) => {
  if (row.localStatus === "lost") return "row-lost";
  if (row.isUsed) return "row-used";
  return "";
};

const usedLabel = computed(() => (v: ILocalVideo) => (v.isUsed ? "✅ 已使用" : ""));

async function onImportCrawlerJson(latestVideos: ICrawlerVideo[]) {
  videos.value = await syncVideoData(latestVideos, localStorageRepo);
}

async function onGenerateScript(row: ILocalVideo) {
  // 这里调用你的“生成文稿 API”
  // await generateScriptApi(row.href)
  videos.value = await setVideoUsed(row.id, true, localStorageRepo);
}
</script>

<template>
  <div class="video-manager">
    <el-table :data="videos" :row-class-name="tableRowClassName" style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="320" />
      <el-table-column prop="likeCount" label="点赞" width="120" />
      <el-table-column label="状态" width="140">
        <template #default="{ row }">
          <span v-if="row.localStatus === 'lost'">可能已删除</span>
          <span v-else>{{ usedLabel(row) }}</span>
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

