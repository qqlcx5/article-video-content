import path from "node:path";
import { promises as fs } from "node:fs";
import { JsonFileAppDatabaseRepository } from "../src/app-database-repository";
import type { ILocalVideo } from "../src/types";
import type { IAppDatabase } from "../src/app-database";
import { syncUpVideoData } from "../src/app-ops";
import { parseCrawlerVideosFromUnknown } from "../src/parse";

function getArg(name: string): string | undefined {
  const idx = process.argv.findIndex((a) => a === name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function countLost(videos: ILocalVideo[]): number {
  return videos.filter((v) => v.localStatus === "lost").length;
}

function inferUpKeyFromLatestPath(latestPath: string): string {
  const base = path.basename(latestPath);
  const stem = base.replace(/\.json$/i, "");
  if (!stem) return "默认";
  if (stem.toLowerCase() === "crawler_result") return "默认";
  return stem;
}

function getUpVideos(db: IAppDatabase, upKey: string): ILocalVideo[] {
  return db.ups[upKey]?.videos ?? [];
}

async function main(): Promise<void> {
  const latestPath =
    getArg("--latest") ?? path.resolve(process.cwd(), "data/crawler_result.json");
  const dbPath =
    getArg("--db") ?? path.resolve(process.cwd(), "data/app_database.json");
  const upKey = getArg("--up") ?? inferUpKeyFromLatestPath(latestPath);

  const latestRaw = await fs.readFile(latestPath, "utf8");
  const latestParsed: unknown = JSON.parse(latestRaw);
  const latestVideos = parseCrawlerVideosFromUnknown(latestParsed);

  const repo = new JsonFileAppDatabaseRepository(dbPath);
  const beforeDb = await repo.load();
  const before = getUpVideos(beforeDb, upKey);

  const afterUp = await syncUpVideoData(
    { upKey, displayName: upKey, latestVideos },
    repo
  );
  const after = afterUp.videos;

  const newCount = after.filter((v) => !before.some((b) => b.id === v.id)).length;
  const lostBefore = countLost(before);
  const lostAfter = countLost(after);

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        upKey,
        latest: latestVideos.length,
        before: before.length,
        after: after.length,
        added: newCount,
        lostBefore,
        lostAfter,
        dbPath,
        latestPath
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
