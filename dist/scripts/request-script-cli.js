"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const app_database_repository_1 = require("../src/app-database-repository");
const request_script_1 = require("../src/request-script");
function getArg(name) {
    const idx = process.argv.findIndex((a) => a === name);
    if (idx === -1)
        return undefined;
    return process.argv[idx + 1];
}
function getBoolArg(name, fallback) {
    const raw = getArg(name);
    if (raw === undefined)
        return fallback;
    if (raw === "1" || raw.toLowerCase() === "true")
        return true;
    if (raw === "0" || raw.toLowerCase() === "false")
        return false;
    return fallback;
}
function getNumberArg(name, fallback) {
    const raw = getArg(name);
    if (!raw)
        return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
}
function inferUpKeyFromOutOrDb(dbPath) {
    const base = node_path_1.default.basename(dbPath).replace(/\.json$/i, "");
    return base || "默认";
}
function filterVideos(list, options) {
    let result = list;
    if (options.onlyUnused)
        result = result.filter((v) => !v.isUsed);
    if (!options.includeLost)
        result = result.filter((v) => v.localStatus !== "lost");
    if (!options.includeHidden)
        result = result.filter((v) => !v.isHidden);
    if (options.limit !== null)
        result = result.slice(0, options.limit);
    return result;
}
async function main() {
    const dbPath = getArg("--db") ?? node_path_1.default.resolve(process.cwd(), "data/app_database.json");
    const upKey = getArg("--up") ?? inferUpKeyFromOutOrDb(dbPath);
    const outPath = getArg("--out") ?? node_path_1.default.resolve(process.cwd(), `data/${upKey}.request.js`);
    const onlyUnused = getBoolArg("--only-unused", true);
    const includeLost = getBoolArg("--include-lost", false);
    const includeHidden = getBoolArg("--include-hidden", false);
    const delayMs = getNumberArg("--delay-ms", 3000);
    const limitRaw = getArg("--limit");
    const limit = limitRaw ? (Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : null) : null;
    const repo = new app_database_repository_1.JsonFileAppDatabaseRepository(dbPath);
    const db = await repo.load();
    const up = db.ups[upKey];
    if (!up) {
        throw new Error(`找不到 UP：${upKey}（db: ${dbPath}）`);
    }
    const picked = filterVideos(up.videos, { onlyUnused, includeLost, includeHidden, limit });
    const script = (0, request_script_1.generateRequestScript)(picked.map((v) => ({ id: v.id, href: v.href, title: v.title })), { delayMs });
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(outPath), { recursive: true });
    await node_fs_1.promises.writeFile(outPath, script, "utf8");
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({
        upKey,
        dbPath,
        outPath,
        total: up.videos.length,
        exported: picked.length,
        onlyUnused,
        includeLost,
        includeHidden,
        delayMs,
        limit
    }, null, 2));
}
main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
});
