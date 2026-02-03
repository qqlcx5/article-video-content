import type { ILocalVideo } from "./types";
import { parseLocalVideosFromUnknown } from "./local-db";

export type UpKey = string;

export interface IUpStore {
  key: UpKey;
  displayName: string;
  videos: ILocalVideo[];
  lastSyncAt: number;
}

export interface IAppDatabase {
  schemaVersion: 1;
  ups: Record<UpKey, IUpStore>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function ensureString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function ensureNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function createEmptyAppDatabase(): IAppDatabase {
  return { schemaVersion: 1, ups: {} };
}

export function normalizeUpStore(
  upKey: string,
  raw: unknown,
  fallbackName?: string
): IUpStore {
  const record = isRecord(raw) ? raw : {};
  const displayName = ensureString(record.displayName, fallbackName ?? upKey) || upKey;
  const lastSyncAt = ensureNumber(record.lastSyncAt, 0);
  const videos = parseLocalVideosFromUnknown(record.videos);
  return { key: upKey, displayName, lastSyncAt, videos };
}

export function parseAppDatabaseFromUnknown(parsed: unknown): IAppDatabase {
  if (Array.isArray(parsed)) {
    const videos = parseLocalVideosFromUnknown(parsed);
    return {
      schemaVersion: 1,
      ups: {
        默认: { key: "默认", displayName: "默认", lastSyncAt: 0, videos }
      }
    };
  }

  if (!isRecord(parsed)) return createEmptyAppDatabase();

  if (Array.isArray(parsed.videos)) {
    const videos = parseLocalVideosFromUnknown(parsed.videos);
    return {
      schemaVersion: 1,
      ups: {
        默认: { key: "默认", displayName: "默认", lastSyncAt: 0, videos }
      }
    };
  }

  const schemaVersion = parsed.schemaVersion === 1 ? 1 : 1;
  const upsCandidate = isRecord(parsed.ups) ? parsed.ups : {};

  const ups: Record<UpKey, IUpStore> = {};
  for (const [key, value] of Object.entries(upsCandidate)) {
    const upKey = ensureString(key, "").trim();
    if (!upKey) continue;
    ups[upKey] = normalizeUpStore(upKey, value, upKey);
  }

  return { schemaVersion, ups };
}

export function serializeAppDatabase(db: IAppDatabase): string {
  return `${JSON.stringify(db, null, 2)}\n`;
}

