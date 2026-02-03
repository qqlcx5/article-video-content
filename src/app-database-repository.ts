import { promises as fs } from "node:fs";
import { parseAppDatabaseFromUnknown, serializeAppDatabase } from "./app-database";
import type { IAppDatabase } from "./app-database";
import { writeFileAtomic } from "./write-file-atomic";

export interface IAppDatabaseRepository {
  load(): Promise<IAppDatabase>;
  save(db: IAppDatabase): Promise<void>;
}

export class JsonFileAppDatabaseRepository implements IAppDatabaseRepository {
  readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async load(): Promise<IAppDatabase> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed: unknown = JSON.parse(raw);
      return parseAppDatabaseFromUnknown(parsed);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return parseAppDatabaseFromUnknown(undefined);
      throw error;
    }
  }

  async save(db: IAppDatabase): Promise<void> {
    const content = serializeAppDatabase(db);
    await writeFileAtomic(this.filePath, content);
  }
}

