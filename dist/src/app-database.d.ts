import type { ILocalVideo } from "./types";
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
export declare function createEmptyAppDatabase(): IAppDatabase;
export declare function normalizeUpStore(upKey: string, raw: unknown, fallbackName?: string): IUpStore;
export declare function parseAppDatabaseFromUnknown(parsed: unknown): IAppDatabase;
export declare function serializeAppDatabase(db: IAppDatabase): string;
