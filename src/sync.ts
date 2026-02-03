import type { ICrawlerVideo, ILocalVideo, LocalStatus } from "./types";
import type { IVideoRepository } from "./repository";

function normalizeCrawlerVideo(raw: ICrawlerVideo): ICrawlerVideo {
  return {
    id: String(raw.id ?? "").trim(),
    title: String(raw.title ?? "无标题"),
    href: String(raw.href ?? ""),
    thumbnail: String(raw.thumbnail ?? ""),
    likeCount: Number.isFinite(raw.likeCount) ? raw.likeCount : 0
  };
}

function createLocalVideoFromCrawler(
  crawler: ICrawlerVideo,
  now: number
): ILocalVideo {
  return {
    ...crawler,
    isUsed: false,
    isHidden: false,
    localStatus: "active",
    lastSeen: now
  };
}

function mergeCrawlerIntoLocal(
  existing: ILocalVideo,
  crawler: ICrawlerVideo,
  now: number
): ILocalVideo {
  const nextStatus: LocalStatus =
    existing.localStatus === "lost" ? "active" : existing.localStatus;

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

export type SyncVideoDataOptions = {
  now?: number;
};

export async function syncVideoData(
  latestVideos: ICrawlerVideo[],
  repository: IVideoRepository,
  options: SyncVideoDataOptions = {}
): Promise<ILocalVideo[]> {
  const now = options.now ?? Date.now();

  const localList = await repository.load();
  const localMap = new Map<string, ILocalVideo>();
  for (const local of localList) {
    if (!local.id) continue;
    const existing = localMap.get(local.id);
    if (!existing || local.lastSeen >= existing.lastSeen) {
      localMap.set(local.id, local);
    }
  }

  const seenIds = new Set<string>();
  const ordered: ILocalVideo[] = [];

  for (const raw of latestVideos) {
    const crawler = normalizeCrawlerVideo(raw);
    if (!crawler.id) continue;
    if (seenIds.has(crawler.id)) continue;
    seenIds.add(crawler.id);

    const existing = localMap.get(crawler.id);
    const merged = existing
      ? mergeCrawlerIntoLocal(existing, crawler, now)
      : createLocalVideoFromCrawler(crawler, now);

    localMap.set(crawler.id, merged);
    ordered.push(merged);
  }

  for (const local of localMap.values()) {
    if (seenIds.has(local.id)) continue;
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

export type SetVideoUsedOptions = {
  now?: number;
};

export async function setVideoUsed(
  videoId: string,
  isUsed: boolean,
  repository: IVideoRepository,
  options: SetVideoUsedOptions = {}
): Promise<ILocalVideo[]> {
  const now = options.now ?? Date.now();
  const list = await repository.load();
  const next = list.map((v) =>
    v.id === videoId ? { ...v, isUsed, lastSeen: Math.max(v.lastSeen, now) } : v
  );
  await repository.save(next);
  return next;
}
