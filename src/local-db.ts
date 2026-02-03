import type { ILocalVideo } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function ensureString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function ensureNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function ensureBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeLocalVideo(raw: unknown): ILocalVideo | null {
  if (!isRecord(raw)) return null;

  const id = ensureString(raw.id, "").trim();
  if (!id) return null;

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

export function parseLocalVideosFromUnknown(parsed: unknown): ILocalVideo[] {
  const listCandidate = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.videos)
      ? parsed.videos
      : [];

  const map = new Map<string, ILocalVideo>();
  for (const item of listCandidate) {
    const normalized = normalizeLocalVideo(item);
    if (!normalized) continue;
    const existing = map.get(normalized.id);
    if (!existing || normalized.lastSeen >= existing.lastSeen) {
      map.set(normalized.id, normalized);
    }
  }
  return Array.from(map.values());
}

export function serializeLocalVideos(videos: ILocalVideo[]): string {
  return `${JSON.stringify(videos, null, 2)}\n`;
}
