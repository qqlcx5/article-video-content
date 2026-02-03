import type { ICrawlerVideo } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringOrEmpty(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function toNumberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function parseCrawlerVideosFromUnknown(parsed: unknown): ICrawlerVideo[] {
  const listCandidate = Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.videos)
      ? parsed.videos
      : [];

  const result: ICrawlerVideo[] = [];
  for (const item of listCandidate) {
    if (!isRecord(item)) continue;

    const id = toStringOrEmpty(item.id).trim();
    if (!id) continue;

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

