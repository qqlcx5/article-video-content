"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncVideoData = syncVideoData;
exports.setVideoUsed = setVideoUsed;
function normalizeCrawlerVideo(raw) {
    return {
        id: String(raw.id ?? "").trim(),
        title: String(raw.title ?? "无标题"),
        href: String(raw.href ?? ""),
        thumbnail: String(raw.thumbnail ?? ""),
        likeCount: Number.isFinite(raw.likeCount) ? raw.likeCount : 0
    };
}
function createLocalVideoFromCrawler(crawler, now) {
    return {
        ...crawler,
        isUsed: false,
        isHidden: false,
        localStatus: "active",
        lastSeen: now
    };
}
function mergeCrawlerIntoLocal(existing, crawler, now) {
    const nextStatus = existing.localStatus === "lost" ? "active" : existing.localStatus;
    return {
        ...existing,
        id: crawler.id,
        title: crawler.title,
        href: crawler.href,
        thumbnail: crawler.thumbnail,
        likeCount: crawler.likeCount,
        localStatus: nextStatus,
        lastSeen: now
    };
}
async function syncVideoData(latestVideos, repository, options = {}) {
    const now = options.now ?? Date.now();
    const localList = await repository.load();
    const localMap = new Map();
    for (const local of localList) {
        if (!local.id)
            continue;
        const existing = localMap.get(local.id);
        if (!existing || local.lastSeen >= existing.lastSeen) {
            localMap.set(local.id, local);
        }
    }
    const seenIds = new Set();
    const ordered = [];
    for (const raw of latestVideos) {
        const crawler = normalizeCrawlerVideo(raw);
        if (!crawler.id)
            continue;
        if (seenIds.has(crawler.id))
            continue;
        seenIds.add(crawler.id);
        const existing = localMap.get(crawler.id);
        const merged = existing
            ? mergeCrawlerIntoLocal(existing, crawler, now)
            : createLocalVideoFromCrawler(crawler, now);
        localMap.set(crawler.id, merged);
        ordered.push(merged);
    }
    for (const local of localMap.values()) {
        if (seenIds.has(local.id))
            continue;
        if (local.lastSeen < now) {
            localMap.set(local.id, { ...local, localStatus: "lost" });
        }
    }
    const remaining = Array.from(localMap.values())
        .filter((v) => !seenIds.has(v.id))
        .sort((a, b) => b.lastSeen - a.lastSeen);
    const result = [...ordered, ...remaining];
    await repository.save(result);
    return result;
}
async function setVideoUsed(videoId, isUsed, repository, options = {}) {
    const now = options.now ?? Date.now();
    const list = await repository.load();
    const next = list.map((v) => v.id === videoId ? { ...v, isUsed, lastSeen: Math.max(v.lastSeen, now) } : v);
    await repository.save(next);
    return next;
}
