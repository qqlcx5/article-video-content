import type { ILocalVideo } from "./types";
export declare function normalizeLocalVideo(raw: unknown): ILocalVideo | null;
export declare function parseLocalVideosFromUnknown(parsed: unknown): ILocalVideo[];
export declare function serializeLocalVideos(videos: ILocalVideo[]): string;
