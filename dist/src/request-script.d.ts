import type { ILocalVideo } from "./types";
export type RequestScriptOptions = {
    endpoint?: string;
    delayMs?: number;
    topicId?: string;
    topicDirectoryId?: string;
    authorization?: string;
    xRequestId?: string;
};
export declare function generateRequestScript(videos: Pick<ILocalVideo, "id" | "href" | "title">[], options?: RequestScriptOptions): string;
