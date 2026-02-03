import type { IVideoRepository } from "../repository";
import type { ILocalVideo } from "../types";
import { parseLocalVideosFromUnknown, serializeLocalVideos } from "../local-db";

type FsV1 = typeof import("@tauri-apps/api/fs");
type PathApi = typeof import("@tauri-apps/api/path");

type FsApi = {
  readTextFile: (path: string) => Promise<string>;
  writeTextFile: (path: string, contents: string) => Promise<void>;
  exists?: (path: string) => Promise<boolean>;
  createDir?: (path: string, options?: { recursive?: boolean }) => Promise<void>;
  removeFile?: (path: string) => Promise<void>;
  rename?: (oldPath: string, newPath: string) => Promise<void>;
};

function isNotFoundError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  return (
    lower.includes("not found") ||
    lower.includes("no such file") ||
    lower.includes("os error 2") ||
    lower.includes("enoent")
  );
}

async function loadFs(): Promise<FsApi> {
  const mod = (await import(/* @vite-ignore */ "@tauri-apps/api/fs")) as unknown as FsV1;
  return {
    readTextFile: mod.readTextFile,
    writeTextFile: mod.writeTextFile,
    exists: mod.exists,
    createDir: mod.createDir,
    rename: mod.renameFile,
    removeFile: mod.removeFile
  };
}

async function loadPathApi(): Promise<PathApi> {
  return (await import(/* @vite-ignore */ "@tauri-apps/api/path")) as unknown as PathApi;
}

async function ensureDirForFile(filePath: string, fsApi: FsApi, pathApi: PathApi) {
  const dir = await Promise.resolve(pathApi.dirname(filePath));
  const mkdirFn = fsApi.createDir;
  if (!mkdirFn) return;
  await mkdirFn(dir, { recursive: true });
}

async function removeTempFileBestEffort(tempPath: string, fsApi: FsApi): Promise<void> {
  if (fsApi.removeFile) {
    await fsApi.removeFile(tempPath).catch(() => undefined);
  }
}

async function writeTextFileAtomicBestEffort(
  filePath: string,
  content: string,
  fsApi: FsApi,
  pathApi: PathApi
): Promise<void> {
  await ensureDirForFile(filePath, fsApi, pathApi);

  const tempPath = `${filePath}.tmp.${Date.now()}`;
  await fsApi.writeTextFile(tempPath, content);

  if (fsApi.rename) {
    try {
      await fsApi.rename(tempPath, filePath);
      return;
    } catch {
      // 回退到直接覆盖
    }
  }

  await fsApi.writeTextFile(filePath, content);
  await removeTempFileBestEffort(tempPath, fsApi);
}

export type CreateTauriVideoRepositoryOptions = {
  fileName?: string;
};

export async function createTauriVideoRepository(
  options: CreateTauriVideoRepositoryOptions = {}
): Promise<IVideoRepository> {
  const fileName = options.fileName ?? "app_database.json";
  const [fsApi, pathApi] = await Promise.all([loadFs(), loadPathApi()]);

  const baseDir = await pathApi.appDataDir();
  const filePath = await Promise.resolve(pathApi.join(baseDir, fileName));

  return {
    async load(): Promise<ILocalVideo[]> {
      try {
        if (fsApi.exists) {
          const ok = await fsApi.exists(filePath);
          if (!ok) return [];
        }

        const raw = await fsApi.readTextFile(filePath);
        const parsed: unknown = JSON.parse(raw);
        return parseLocalVideosFromUnknown(parsed);
      } catch (error) {
        if (isNotFoundError(error)) return [];
        throw error;
      }
    },
    async save(videos: ILocalVideo[]): Promise<void> {
      const content = serializeLocalVideos(videos);
      await writeTextFileAtomicBestEffort(filePath, content, fsApi, pathApi);
    }
  };
}
