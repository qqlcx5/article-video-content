"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const app_database_repository_1 = require("../src/app-database-repository");
const app_ops_1 = require("../src/app-ops");
const parse_1 = require("../src/parse");
function getArg(name) {
    const idx = process.argv.findIndex((a) => a === name);
    if (idx === -1)
        return undefined;
    return process.argv[idx + 1];
}
function countLost(videos) {
    return videos.filter((v) => v.localStatus === "lost").length;
}
function inferUpKeyFromLatestPath(latestPath) {
    const base = node_path_1.default.basename(latestPath);
    const stem = base.replace(/\.json$/i, "");
    if (!stem)
        return "默认";
    if (stem.toLowerCase() === "crawler_result")
        return "默认";
    return stem;
}
function getUpVideos(db, upKey) {
    return db.ups[upKey]?.videos ?? [];
}
async function main() {
    const latestPath = getArg("--latest") ?? node_path_1.default.resolve(process.cwd(), "data/crawler_result.json");
    const dbPath = getArg("--db") ?? node_path_1.default.resolve(process.cwd(), "data/app_database.json");
    const upKey = getArg("--up") ?? inferUpKeyFromLatestPath(latestPath);
    const latestRaw = await node_fs_1.promises.readFile(latestPath, "utf8");
    const latestParsed = JSON.parse(latestRaw);
    const latestVideos = (0, parse_1.parseCrawlerVideosFromUnknown)(latestParsed);
    const repo = new app_database_repository_1.JsonFileAppDatabaseRepository(dbPath);
    const beforeDb = await repo.load();
    const before = getUpVideos(beforeDb, upKey);
    const afterUp = await (0, app_ops_1.syncUpVideoData)({ upKey, displayName: upKey, latestVideos }, repo);
    const after = afterUp.videos;
    const newCount = after.filter((v) => !before.some((b) => b.id === v.id)).length;
    const lostBefore = countLost(before);
    const lostAfter = countLost(after);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({
        upKey,
        latest: latestVideos.length,
        before: before.length,
        after: after.length,
        added: newCount,
        lostBefore,
        lostAfter,
        dbPath,
        latestPath
    }, null, 2));
}
main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
});
