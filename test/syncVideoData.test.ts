import test from "node:test";
import assert from "node:assert/strict";
import type { ICrawlerVideo, ILocalVideo } from "../src/types";
import type { IVideoRepository } from "../src/repository";
import { setVideoUsed, syncVideoData } from "../src/sync";

class MemoryRepo implements IVideoRepository {
  private data: ILocalVideo[];

  constructor(initial: ILocalVideo[] = []) {
    this.data = initial;
  }

  async load(): Promise<ILocalVideo[]> {
    return this.data;
  }

  async save(videos: ILocalVideo[]): Promise<void> {
    this.data = videos;
  }
}

test("syncVideoData: 新增视频并初始化字段", async () => {
  const repo = new MemoryRepo();
  const latest: ICrawlerVideo[] = [
    {
      id: "1",
      title: "A",
      href: "https://www.douyin.com/video/1",
      thumbnail: "t",
      likeCount: 10
    }
  ];

  const now = 1700000000000;
  const merged = await syncVideoData(latest, repo, { now });

  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0], {
    id: "1",
    title: "A",
    href: "https://www.douyin.com/video/1",
    thumbnail: "t",
    likeCount: 10,
    isUsed: false,
    isHidden: false,
    localStatus: "active",
    lastSeen: now
  });
});

test("syncVideoData: 更新基础字段但不覆盖 isUsed", async () => {
  const repo = new MemoryRepo([
    {
      id: "1",
      title: "旧标题",
      href: "old",
      thumbnail: "old",
      likeCount: 1,
      isUsed: true,
      isHidden: false,
      localStatus: "active",
      lastSeen: 1
    }
  ]);

  const latest: ICrawlerVideo[] = [
    { id: "1", title: "新标题", href: "new", thumbnail: "new", likeCount: 99 }
  ];

  const merged = await syncVideoData(latest, repo, { now: 2 });
  assert.equal(merged[0].isUsed, true);
  assert.equal(merged[0].title, "新标题");
  assert.equal(merged[0].likeCount, 99);
  assert.equal(merged[0].lastSeen, 2);
});

test("syncVideoData: 本次未出现的视频标记为 lost（软删除）", async () => {
  const repo = new MemoryRepo([
    {
      id: "1",
      title: "A",
      href: "a",
      thumbnail: "",
      likeCount: 0,
      isUsed: false,
      isHidden: false,
      localStatus: "active",
      lastSeen: 1
    }
  ]);

  const merged = await syncVideoData([], repo, { now: 2 });
  assert.equal(merged[0].localStatus, "lost");
});

test("syncVideoData: lost 视频再次出现会恢复为 active", async () => {
  const repo = new MemoryRepo([
    {
      id: "1",
      title: "A",
      href: "a",
      thumbnail: "",
      likeCount: 0,
      isUsed: false,
      isHidden: false,
      localStatus: "lost",
      lastSeen: 1
    }
  ]);

  const latest: ICrawlerVideo[] = [
    { id: "1", title: "A2", href: "a2", thumbnail: "", likeCount: 0 }
  ];
  const merged = await syncVideoData(latest, repo, { now: 2 });
  assert.equal(merged[0].localStatus, "active");
});

test("syncVideoData: 重复 ID 只保留一份", async () => {
  const repo = new MemoryRepo();
  const latest: ICrawlerVideo[] = [
    { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 },
    { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 }
  ];
  const merged = await syncVideoData(latest, repo, { now: 1 });
  assert.equal(merged.length, 1);
});

test("setVideoUsed: 设置 isUsed 并保存", async () => {
  const repo = new MemoryRepo([
    {
      id: "1",
      title: "A",
      href: "a",
      thumbnail: "",
      likeCount: 0,
      isUsed: false,
      isHidden: false,
      localStatus: "active",
      lastSeen: 1
    }
  ]);

  const updated = await setVideoUsed("1", true, repo, { now: 2 });
  assert.equal(updated[0].isUsed, true);
  assert.equal(updated[0].lastSeen, 2);
});
