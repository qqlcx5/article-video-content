"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const app_database_1 = require("../src/app-database");
const app_ops_1 = require("../src/app-ops");
class MemoryDbRepo {
    db = (0, app_database_1.createEmptyAppDatabase)();
    async load() {
        return this.db;
    }
    async save(next) {
        this.db = next;
    }
}
(0, node_test_1.default)("parseAppDatabaseFromUnknown: 兼容旧数组格式并落到“默认”UP", () => {
    const db = (0, app_database_1.parseAppDatabaseFromUnknown)([
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
    strict_1.default.equal(db.schemaVersion, 1);
    strict_1.default.ok(db.ups["默认"]);
    strict_1.default.equal(db.ups["默认"].videos.length, 1);
});
(0, node_test_1.default)("syncUpVideoData: 不同UP主分仓保存", async () => {
    const repo = new MemoryDbRepo();
    const latestA = [
        { id: "1", title: "A", href: "a", thumbnail: "", likeCount: 0 }
    ];
    const latestB = [
        { id: "2", title: "B", href: "b", thumbnail: "", likeCount: 0 }
    ];
    await (0, app_ops_1.syncUpVideoData)({ upKey: "UP-A", latestVideos: latestA }, repo, { now: 1 });
    await (0, app_ops_1.syncUpVideoData)({ upKey: "UP-B", latestVideos: latestB }, repo, { now: 1 });
    const db = await repo.load();
    strict_1.default.equal(db.ups["UP-A"].videos.length, 1);
    strict_1.default.equal(db.ups["UP-B"].videos.length, 1);
});
(0, node_test_1.default)("syncManyUpVideoData: 批量导入一次写入", async () => {
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
    const db = await (0, app_ops_1.syncManyUpVideoData)(inputs, repo, { now: 2 });
    strict_1.default.equal(Object.keys(db.ups).length, 2);
    strict_1.default.equal(db.ups["UP-A"].videos[0].lastSeen, 2);
    strict_1.default.equal(db.ups["UP-B"].videos[0].lastSeen, 2);
});
