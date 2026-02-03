import { promises as fs } from "node:fs";
import type { ILocalVideo } from "./types";
import { parseLocalVideosFromUnknown, serializeLocalVideos } from "./local-db";
import { writeFileAtomic } from "./write-file-atomic";

export interface IVideoRepository {
  load(): Promise<ILocalVideo[]>;
  save(videos: ILocalVideo[]): Promise<void>;
}

export class JsonFileVideoRepository implements IVideoRepository {
  readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async load(): Promise<ILocalVideo[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed: unknown = JSON.parse(raw);
      return parseLocalVideosFromUnknown(parsed);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return [];
      throw error;
    }
  }

  async save(videos: ILocalVideo[]): Promise<void> {
    const content = serializeLocalVideos(videos);
    await writeFileAtomic(this.filePath, content);
  }
}
