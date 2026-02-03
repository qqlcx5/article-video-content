import type { IAppDatabaseRepository } from "../app-database-repository";
import type { IAppDatabase } from "../app-database";
import { parseAppDatabaseFromUnknown, serializeAppDatabase } from "../app-database";

type PathApi = typeof import("@tauri-apps/api/path");

type FsApi = {
  readTextFile: (path: string) => Promise<string>;
  writeTextFile: (path: string, contents: string) => Promise<void>;
  exists?: (path: string) => Promise<boolean>;
  mkdir?: (path: string, options?: { recursive?: boolean }) => Promise<void>;
  remove?: (path: string) => Promise<void>;
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
  const mod = (await import(/* @vite-ignore */ "@tauri-apps/plugin-fs")) as unknown as {
    readTextFile: (path: string) => Promise<string>;
    writeTextFile: (path: string, contents: string) => Promise<void>;
    exists?: (path: string) => Promise<boolean>;
    mkdir?: (path: string, options?: { recursive?: boolean }) => Promise<void>;
    rename?: (oldPath: string, newPath: string) => Promise<void>;
    remove?: (path: string) => Promise<void>;
  };
  return {
    readTextFile: mod.readTextFile,
    writeTextFile: mod.writeTextFile,
    exists: mod.exists,
    mkdir: mod.mkdir,
    rename: mod.rename,
    remove: mod.remove
  };
}

async function loadPathApi(): Promise<PathApi> {
  return (await import(/* @vite-ignore */ "@tauri-apps/api/path")) as unknown as PathApi;
}

async function ensureDirForFile(filePath: string, fsApi: FsApi, pathApi: PathApi) {
  const dir = await Promise.resolve(pathApi.dirname(filePath));
  const mkdirFn = fsApi.mkdir;
  if (!mkdirFn) return;
  await mkdirFn(dir, { recursive: true });
}

async function removeTempFileBestEffort(tempPath: string, fsApi: FsApi): Promise<void> {
  if (fsApi.remove) {
    await fsApi.remove(tempPath).catch(() => undefined);
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

export type CreateTauriAppDatabaseRepositoryOptions = {
  fileName?: string;
};

export async function createTauriAppDatabaseRepository(
  options: CreateTauriAppDatabaseRepositoryOptions = {}
): Promise<IAppDatabaseRepository> {
  const fileName = options.fileName ?? "app_database.json";
  const [fsApi, pathApi] = await Promise.all([loadFs(), loadPathApi()]);

  const baseDir = await pathApi.appDataDir();
  const filePath = await Promise.resolve(pathApi.join(baseDir, fileName));

  return {
    async load(): Promise<IAppDatabase> {
      try {
        if (fsApi.exists) {
          const ok = await fsApi.exists(filePath);
          if (!ok) return parseAppDatabaseFromUnknown(undefined);
        }

        const raw = await fsApi.readTextFile(filePath);
        const parsed: unknown = JSON.parse(raw);
        return parseAppDatabaseFromUnknown(parsed);
      } catch (error) {
        if (isNotFoundError(error)) return parseAppDatabaseFromUnknown(undefined);
        throw error;
      }
    },
    async save(db: IAppDatabase): Promise<void> {
      const content = serializeAppDatabase(db);
      await writeTextFileAtomicBestEffort(filePath, content, fsApi, pathApi);
    }
  };
}
