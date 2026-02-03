"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const sync_1 = require("../src/sync");
class MemoryRepo {
    data;
    constructor(initial = []) {
        this.data = initial;
    }
    async load() {
        return this.data;
    }
    async save(videos) {
        this.data = videos;
    }
}
(0, node_test_1.default)("syncVideoData: 新增视频并初始化字段", async () => {
    const repo = new MemoryRepo();
    const latest = [
        {
            id: "1",
            title: "A",
            href: "https://www.douyin.com/video/1",
            thumbnail: "t",
            likeCount: 10
        }
    ];
    const now = 1700000000000;
    const merged = await (0, sync_1.syncVideoData)(latest, repo, { now });
    strict_1.default.equal(merged.length, 1);
    strict_1.default.deepEqual(merged[0], {
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
(0, node_test_1.default)("syncVideoData: 更新基础字段但不覆盖 isUsed", async () => {
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
    const latest = [
        { id: "1", title: "新标题", href: "new", thumbnail: "new", likeCount: 99 }
    ];
    const merged = await (0, sync_1.syncVideoData)(latest, repo, { now: 2 });
    strict_1.default.equal(merged[0].isUsed, true);
    strict_1.default.equal(merged[0].title, "新标题");
    strict_1.default.equal(merged[0].likeCount, 99);
    strict_1.default.equal(merged[0].lastSeen, 2);
});
(0, node_test_1.default)("syncVideoData: 本次未出现的视频标记为 lost（软删除）", async () => {
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
    const merged = await (0, sync_1.syncVideoData)([], repo, { now: 2 });
    strict_1.default.equal(merged[0].localStatus, "lost");
});
(0, node_test_1.default)("syncVideoData: lost 视频再次出现会恢复为 active", async () => {
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
    const latest = [
        { id: "1", title: "A2", href: "a2", thumbnail: "", likeCount: 0 }
    ];
    const merged = await (0, sync_1.syncVideoData)(latest, repo, { now: 2 });
    strict_1.default.equal(merged[0].localStatus, "active");
});
(0, node_test_1.default)("syncVideoData: 重复 ID 只保留一份", async () => {
    const repo = new MemoryRepo();
    const latest = [
        { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 },
        { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 }
    ];
    const merged = await (0, sync_1.syncVideoData)(latest, repo, { now: 1 });
    strict_1.default.equal(merged.length, 1);
});
(0, node_test_1.default)("setVideoUsed: 设置 isUsed 并保存", async () => {
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
    const updated = await (0, sync_1.setVideoUsed)("1", true, repo, { now: 2 });
    strict_1.default.equal(updated[0].isUsed, true);
    strict_1.default.equal(updated[0].lastSeen, 2);
});
