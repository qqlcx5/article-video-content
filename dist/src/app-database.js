"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyAppDatabase = createEmptyAppDatabase;
exports.normalizeUpStore = normalizeUpStore;
exports.parseAppDatabaseFromUnknown = parseAppDatabaseFromUnknown;
exports.serializeAppDatabase = serializeAppDatabase;
const local_db_1 = require("./local-db");
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function ensureString(value, fallback) {
    return typeof value === "string" ? value : fallback;
}
function ensureNumber(value, fallback) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function createEmptyAppDatabase() {
    return { schemaVersion: 1, ups: {} };
}
function normalizeUpStore(upKey, raw, fallbackName) {
    const record = isRecord(raw) ? raw : {};
    const displayName = ensureString(record.displayName, fallbackName ?? upKey) || upKey;
    const lastSyncAt = ensureNumber(record.lastSyncAt, 0);
    const videos = (0, local_db_1.parseLocalVideosFromUnknown)(record.videos);
    return { key: upKey, displayName, lastSyncAt, videos };
}
function parseAppDatabaseFromUnknown(parsed) {
    if (Array.isArray(parsed)) {
        const videos = (0, local_db_1.parseLocalVideosFromUnknown)(parsed);
        return {
            schemaVersion: 1,
            ups: {
                默认: { key: "默认", displayName: "默认", lastSyncAt: 0, videos }
            }
        };
    }
    if (!isRecord(parsed))
        return createEmptyAppDatabase();
    if (Array.isArray(parsed.videos)) {
        const videos = (0, local_db_1.parseLocalVideosFromUnknown)(parsed.videos);
        return {
            schemaVersion: 1,
            ups: {
                默认: { key: "默认", displayName: "默认", lastSyncAt: 0, videos }
            }
        };
    }
    const schemaVersion = parsed.schemaVersion === 1 ? 1 : 1;
    const upsCandidate = isRecord(parsed.ups) ? parsed.ups : {};
    const ups = {};
    for (const [key, value] of Object.entries(upsCandidate)) {
        const upKey = ensureString(key, "").trim();
        if (!upKey)
            continue;
        ups[upKey] = normalizeUpStore(upKey, value, upKey);
    }
    return { schemaVersion, ups };
}
function serializeAppDatabase(db) {
    return `${JSON.stringify(db, null, 2)}\n`;
}
