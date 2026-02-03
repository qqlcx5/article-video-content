import type { ICrawlerVideo, ILocalVideo } from "./types";
import type { IVideoRepository } from "./repository";
export type SyncVideoDataOptions = {
    now?: number;
};
export declare function syncVideoData(latestVideos: ICrawlerVideo[], repository: IVideoRepository, options?: SyncVideoDataOptions): Promise<ILocalVideo[]>;
export type SetVideoUsedOptions = {
    now?: number;
};
export declare function setVideoUsed(videoId: string, isUsed: boolean, repository: IVideoRepository, options?: SetVideoUsedOptions): Promise<ILocalVideo[]>;
