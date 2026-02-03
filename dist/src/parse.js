"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCrawlerVideosFromUnknown = parseCrawlerVideosFromUnknown;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function toStringOrEmpty(value) {
    if (typeof value === "string")
        return value;
    if (typeof value === "number" && Number.isFinite(value))
        return String(value);
    return "";
}
function toNumberOrZero(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function parseCrawlerVideosFromUnknown(parsed) {
    const listCandidate = Array.isArray(parsed)
        ? parsed
        : isRecord(parsed) && Array.isArray(parsed.videos)
            ? parsed.videos
            : [];
    const result = [];
    for (const item of listCandidate) {
        if (!isRecord(item))
            continue;
        const id = toStringOrEmpty(item.id).trim();
        if (!id)
            continue;
        result.push({
            id,
            title: typeof item.title === "string" ? item.title : "无标题",
            href: typeof item.href === "string" ? item.href : "",
            thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : "",
            likeCount: toNumberOrZero(item.likeCount)
        });
    }
    return result;
}
