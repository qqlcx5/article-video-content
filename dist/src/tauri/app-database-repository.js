"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTauriAppDatabaseRepository = createTauriAppDatabaseRepository;
const app_database_1 = require("../app-database");
function isNotFoundError(error) {
    const msg = error instanceof Error ? error.message : String(error);
    const lower = msg.toLowerCase();
    return (lower.includes("not found") ||
        lower.includes("no such file") ||
        lower.includes("os error 2") ||
        lower.includes("enoent"));
}
async function loadFs() {
    const mod = (await Promise.resolve().then(() => __importStar(require(/* @vite-ignore */ "@tauri-apps/api/fs"))));
    return {
        readTextFile: mod.readTextFile,
        writeTextFile: mod.writeTextFile,
        exists: mod.exists,
        createDir: mod.createDir,
        rename: mod.renameFile,
        removeFile: mod.removeFile
    };
}
async function loadPathApi() {
    return (await Promise.resolve().then(() => __importStar(require(/* @vite-ignore */ "@tauri-apps/api/path"))));
}
async function ensureDirForFile(filePath, fsApi, pathApi) {
    const dir = await Promise.resolve(pathApi.dirname(filePath));
    const mkdirFn = fsApi.createDir;
    if (!mkdirFn)
        return;
    await mkdirFn(dir, { recursive: true });
}
async function removeTempFileBestEffort(tempPath, fsApi) {
    if (fsApi.removeFile) {
        await fsApi.removeFile(tempPath).catch(() => undefined);
    }
}
async function writeTextFileAtomicBestEffort(filePath, content, fsApi, pathApi) {
    await ensureDirForFile(filePath, fsApi, pathApi);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    await fsApi.writeTextFile(tempPath, content);
    if (fsApi.rename) {
        try {
            await fsApi.rename(tempPath, filePath);
            return;
        }
        catch {
            // 回退到直接覆盖
        }
    }
    await fsApi.writeTextFile(filePath, content);
    await removeTempFileBestEffort(tempPath, fsApi);
}
async function createTauriAppDatabaseRepository(options = {}) {
    const fileName = options.fileName ?? "app_database.json";
    const [fsApi, pathApi] = await Promise.all([loadFs(), loadPathApi()]);
    const baseDir = await pathApi.appDataDir();
    const filePath = await Promise.resolve(pathApi.join(baseDir, fileName));
    return {
        async load() {
            try {
                if (fsApi.exists) {
                    const ok = await fsApi.exists(filePath);
                    if (!ok)
                        return (0, app_database_1.parseAppDatabaseFromUnknown)(undefined);
                }
                const raw = await fsApi.readTextFile(filePath);
                const parsed = JSON.parse(raw);
                return (0, app_database_1.parseAppDatabaseFromUnknown)(parsed);
            }
            catch (error) {
                if (isNotFoundError(error))
                    return (0, app_database_1.parseAppDatabaseFromUnknown)(undefined);
                throw error;
            }
        },
        async save(db) {
            const content = (0, app_database_1.serializeAppDatabase)(db);
            await writeTextFileAtomicBestEffort(filePath, content, fsApi, pathApi);
        }
    };
}
