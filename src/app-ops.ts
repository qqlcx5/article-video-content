import type { ICrawlerVideo, ILocalVideo } from "./types";
import type { IVideoRepository } from "./repository";
import type { IAppDatabaseRepository } from "./app-database-repository";
import type { IAppDatabase, IUpStore, UpKey } from "./app-database";
import { createEmptyAppDatabase, normalizeUpStore } from "./app-database";
import { syncVideoData, type SyncVideoDataOptions } from "./sync";

export type SyncUpVideoDataInput = {
  upKey: UpKey;
  displayName?: string;
  latestVideos: ICrawlerVideo[];
};

function getOrCreateUp(
  db: IAppDatabase,
  upKey: UpKey,
  displayName?: string
): IUpStore {
  const existing = db.ups[upKey];
  if (existing) {
    if (displayName && displayName !== existing.displayName) {
      return { ...existing, displayName };
    }
    return existing;
  }
  const created = normalizeUpStore(upKey, { displayName: displayName ?? upKey, videos: [] }, upKey);
  return created;
}

function createUpVideoRepo(up: IUpStore): { repo: IVideoRepository; get: () => ILocalVideo[] } {
  let nextVideos: ILocalVideo[] = up.videos;
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

export async function loadAppDatabase(repository: IAppDatabaseRepository): Promise<IAppDatabase> {
  const db = await repository.load();
  if (db && db.schemaVersion === 1 && db.ups) return db;
  return createEmptyAppDatabase();
}

export async function syncUpVideoData(
  input: SyncUpVideoDataInput,
  repository: IAppDatabaseRepository,
  options: SyncVideoDataOptions = {}
): Promise<IUpStore> {
  const now = options.now ?? Date.now();
  const db = await loadAppDatabase(repository);

  const up = getOrCreateUp(db, input.upKey, input.displayName);
  const { repo, get } = createUpVideoRepo(up);
  await syncVideoData(input.latestVideos, repo, { now });

  db.ups[input.upKey] = { ...up, videos: get(), lastSyncAt: now };
  await repository.save(db);
  return db.ups[input.upKey];
}

export async function syncManyUpVideoData(
  inputs: SyncUpVideoDataInput[],
  repository: IAppDatabaseRepository,
  options: SyncVideoDataOptions = {}
): Promise<IAppDatabase> {
  const now = options.now ?? Date.now();
  const db = await loadAppDatabase(repository);

  for (const input of inputs) {
    const upKey = String(input.upKey ?? "").trim();
    if (!upKey) continue;

    const up = getOrCreateUp(db, upKey, input.displayName);
    const { repo, get } = createUpVideoRepo(up);
    await syncVideoData(input.latestVideos, repo, { now });
    db.ups[upKey] = { ...up, videos: get(), lastSyncAt: now };
  }

  await repository.save(db);
  return db;
}

export type BatchUpdateUpVideosOptions = { now?: number };

export async function setUpVideosUsed(
  upKey: UpKey,
  videoIds: string[],
  isUsed: boolean,
  repository: IAppDatabaseRepository,
  options: BatchUpdateUpVideosOptions = {}
): Promise<IUpStore | null> {
  const now = options.now ?? Date.now();
  const db = await loadAppDatabase(repository);
  const up = db.ups[upKey];
  if (!up) return null;

  const idSet = new Set(videoIds.filter(Boolean));
  if (idSet.size === 0) return up;

  const nextVideos = up.videos.map((v) =>
    idSet.has(v.id) ? { ...v, isUsed, lastSeen: Math.max(v.lastSeen, now) } : v
  );

  db.ups[upKey] = { ...up, videos: nextVideos };
  await repository.save(db);
  return db.ups[upKey];
}

export async function setUpVideosHidden(
  upKey: UpKey,
  videoIds: string[],
  isHidden: boolean,
  repository: IAppDatabaseRepository
): Promise<IUpStore | null> {
  const db = await loadAppDatabase(repository);
  const up = db.ups[upKey];
  if (!up) return null;

  const idSet = new Set(videoIds.filter(Boolean));
  if (idSet.size === 0) return up;

  const nextVideos = up.videos.map((v) => (idSet.has(v.id) ? { ...v, isHidden } : v));
  db.ups[upKey] = { ...up, videos: nextVideos };
  await repository.save(db);
  return db.ups[upKey];
}

