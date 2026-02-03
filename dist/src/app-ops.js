"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAppDatabase = loadAppDatabase;
exports.syncUpVideoData = syncUpVideoData;
exports.syncManyUpVideoData = syncManyUpVideoData;
exports.setUpVideosUsed = setUpVideosUsed;
exports.setUpVideosHidden = setUpVideosHidden;
const app_database_1 = require("./app-database");
const sync_1 = require("./sync");
function getOrCreateUp(db, upKey, displayName) {
    const existing = db.ups[upKey];
    if (existing) {
        if (displayName && displayName !== existing.displayName) {
            return { ...existing, displayName };
        }
        return existing;
    }
    const created = (0, app_database_1.normalizeUpStore)(upKey, { displayName: displayName ?? upKey, videos: [] }, upKey);
    return created;
}
function createUpVideoRepo(up) {
    let nextVideos = up.videos;
    return {
        repo: {
            async load() {
                return nextVideos;
            },
            async save(videos) {
                nextVideos = videos;
            }
        },
        get: () => nextVideos
    };
}
async function loadAppDatabase(repository) {
    const db = await repository.load();
    if (db && db.schemaVersion === 1 && db.ups)
        return db;
    return (0, app_database_1.createEmptyAppDatabase)();
}
async function syncUpVideoData(input, repository, options = {}) {
    const now = options.now ?? Date.now();
    const db = await loadAppDatabase(repository);
    const up = getOrCreateUp(db, input.upKey, input.displayName);
    const { repo, get } = createUpVideoRepo(up);
    await (0, sync_1.syncVideoData)(input.latestVideos, repo, { now });
    db.ups[input.upKey] = { ...up, videos: get(), lastSyncAt: now };
    await repository.save(db);
    return db.ups[input.upKey];
}
async function syncManyUpVideoData(inputs, repository, options = {}) {
    const now = options.now ?? Date.now();
    const db = await loadAppDatabase(repository);
    for (const input of inputs) {
        const upKey = String(input.upKey ?? "").trim();
        if (!upKey)
            continue;
        const up = getOrCreateUp(db, upKey, input.displayName);
        const { repo, get } = createUpVideoRepo(up);
        await (0, sync_1.syncVideoData)(input.latestVideos, repo, { now });
        db.ups[upKey] = { ...up, videos: get(), lastSyncAt: now };
    }
    await repository.save(db);
    return db;
}
async function setUpVideosUsed(upKey, videoIds, isUsed, repository, options = {}) {
    const now = options.now ?? Date.now();
    const db = await loadAppDatabase(repository);
    const up = db.ups[upKey];
    if (!up)
        return null;
    const idSet = new Set(videoIds.filter(Boolean));
    if (idSet.size === 0)
        return up;
    const nextVideos = up.videos.map((v) => idSet.has(v.id) ? { ...v, isUsed, lastSeen: Math.max(v.lastSeen, now) } : v);
    db.ups[upKey] = { ...up, videos: nextVideos };
    await repository.save(db);
    return db.ups[upKey];
}
async function setUpVideosHidden(upKey, videoIds, isHidden, repository) {
    const db = await loadAppDatabase(repository);
    const up = db.ups[upKey];
    if (!up)
        return null;
    const idSet = new Set(videoIds.filter(Boolean));
    if (idSet.size === 0)
        return up;
    const nextVideos = up.videos.map((v) => (idSet.has(v.id) ? { ...v, isHidden } : v));
    db.ups[upKey] = { ...up, videos: nextVideos };
    await repository.save(db);
    return db.ups[upKey];
}
