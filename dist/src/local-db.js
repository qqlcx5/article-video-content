"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLocalVideo = normalizeLocalVideo;
exports.parseLocalVideosFromUnknown = parseLocalVideosFromUnknown;
exports.serializeLocalVideos = serializeLocalVideos;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function ensureString(value, fallback) {
    return typeof value === "string" ? value : fallback;
}
function ensureNumber(value, fallback) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function ensureBoolean(value, fallback) {
    return typeof value === "boolean" ? value : fallback;
}
function normalizeLocalVideo(raw) {
    if (!isRecord(raw))
        return null;
    const id = ensureString(raw.id, "").trim();
    if (!id)
        return null;
    const localStatus = raw.localStatus === "lost" ? "lost" : "active";
    return {
        id,
        title: ensureString(raw.title, "无标题"),
        href: ensureString(raw.href, ""),
        thumbnail: ensureString(raw.thumbnail, ""),
        likeCount: ensureNumber(raw.likeCount, 0),
        isUsed: ensureBoolean(raw.isUsed, false),
        isHidden: ensureBoolean(raw.isHidden, false),
        localStatus,
        lastSeen: ensureNumber(raw.lastSeen, 0)
    };
}
function parseLocalVideosFromUnknown(parsed) {
    const listCandidate = Array.isArray(parsed)
        ? parsed
        : isRecord(parsed) && Array.isArray(parsed.videos)
            ? parsed.videos
            : [];
    const map = new Map();
    for (const item of listCandidate) {
        const normalized = normalizeLocalVideo(item);
        if (!normalized)
            continue;
        const existing = map.get(normalized.id);
        if (!existing || normalized.lastSeen >= existing.lastSeen) {
            map.set(normalized.id, normalized);
        }
    }
    return Array.from(map.values());
}
function serializeLocalVideos(videos) {
    return `${JSON.stringify(videos, null, 2)}\n`;
}
