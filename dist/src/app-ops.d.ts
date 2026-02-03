import type { ICrawlerVideo } from "./types";
import type { IAppDatabaseRepository } from "./app-database-repository";
import type { IAppDatabase, IUpStore, UpKey } from "./app-database";
import { type SyncVideoDataOptions } from "./sync";
export type SyncUpVideoDataInput = {
    upKey: UpKey;
    displayName?: string;
    latestVideos: ICrawlerVideo[];
};
export declare function loadAppDatabase(repository: IAppDatabaseRepository): Promise<IAppDatabase>;
export declare function syncUpVideoData(input: SyncUpVideoDataInput, repository: IAppDatabaseRepository, options?: SyncVideoDataOptions): Promise<IUpStore>;
export declare function syncManyUpVideoData(inputs: SyncUpVideoDataInput[], repository: IAppDatabaseRepository, options?: SyncVideoDataOptions): Promise<IAppDatabase>;
export type BatchUpdateUpVideosOptions = {
    now?: number;
};
export declare function setUpVideosUsed(upKey: UpKey, videoIds: string[], isUsed: boolean, repository: IAppDatabaseRepository, options?: BatchUpdateUpVideosOptions): Promise<IUpStore | null>;
export declare function setUpVideosHidden(upKey: UpKey, videoIds: string[], isHidden: boolean, repository: IAppDatabaseRepository): Promise<IUpStore | null>;
