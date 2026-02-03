import test from "node:test";
import assert from "node:assert/strict";
import type { IAppDatabaseRepository } from "../src/app-database-repository";
import { createEmptyAppDatabase, parseAppDatabaseFromUnknown } from "../src/app-database";
import type { IAppDatabase } from "../src/app-database";
import type { ICrawlerVideo } from "../src/types";
import { syncManyUpVideoData, syncUpVideoData } from "../src/app-ops";

class MemoryDbRepo implements IAppDatabaseRepository {
  private db = createEmptyAppDatabase();

  async load() {
    return this.db;
  }

  async save(next: IAppDatabase) {
    this.db = next;
  }
}

test("parseAppDatabaseFromUnknown: 兼容旧数组格式并落到“默认”UP", () => {
  const db = parseAppDatabaseFromUnknown([
    {
      id: "1",
      title: "A",
      href: "a",
      thumbnail: "",
      likeCount: 0,
      isUsed: true,
      isHidden: false,
      localStatus: "active",
      lastSeen: 1
    }
  ]);

  assert.equal(db.schemaVersion, 1);
  assert.ok(db.ups["默认"]);
  assert.equal(db.ups["默认"].videos.length, 1);
});

test("syncUpVideoData: 不同UP主分仓保存", async () => {
  const repo = new MemoryDbRepo();
  const latestA: ICrawlerVideo[] = [
    { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 }
  ];
  const latestB: ICrawlerVideo[] = [
    { id: "2", title: "B", href: "b", thumbnail: "", likeCount: 0 }
  ];

  await syncUpVideoData({ upKey: "UP-A", latestVideos: latestA }, repo, { now: 1 });
  await syncUpVideoData({ upKey: "UP-B", latestVideos: latestB }, repo, { now: 1 });

  const db = await repo.load();
  assert.equal(db.ups["UP-A"].videos.length, 1);
  assert.equal(db.ups["UP-B"].videos.length, 1);
});

test("syncManyUpVideoData: 批量导入一次写入", async () => {
  const repo = new MemoryDbRepo();

  const inputs = [
    {
      upKey: "UP-A",
      latestVideos: [{ id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 }]
    },
    {
      upKey: "UP-B",
      latestVideos: [{ id: "2", title: "B", href: "b", thumbnail: "", likeCount: 0 }]
    }
  ];

  const db = await syncManyUpVideoData(inputs, repo, { now: 2 });
  assert.equal(Object.keys(db.ups).length, 2);
  assert.equal(db.ups["UP-A"].videos[0].lastSeen, 2);
  assert.equal(db.ups["UP-B"].videos[0].lastSeen, 2);
});
