import type { ILocalVideo } from "./types";
export interface IVideoRepository {
    load(): Promise<ILocalVideo[]>;
    save(videos: ILocalVideo[]): Promise<void>;
}
export declare class JsonFileVideoRepository implements IVideoRepository {
    readonly filePath: string;
    constructor(filePath: string);
    load(): Promise<ILocalVideo[]>;
    save(videos: ILocalVideo[]): Promise<void>;
}
