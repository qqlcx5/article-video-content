import path from "node:path";
import { promises as fs } from "node:fs";
import { JsonFileAppDatabaseRepository } from "../src/app-database-repository";
import { generateRequestScript } from "../src/request-script";
import type { ILocalVideo } from "../src/types";

function getArg(name: string): string | undefined {
  const idx = process.argv.findIndex((a) => a === name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function getBoolArg(name: string, fallback: boolean): boolean {
  const raw = getArg(name);
  if (raw === undefined) return fallback;
  if (raw === "1" || raw.toLowerCase() === "true") return true;
  if (raw === "0" || raw.toLowerCase() === "false") return false;
  return fallback;
}

function getNumberArg(name: string, fallback: number): number {
  const raw = getArg(name);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function inferUpKeyFromOutOrDb(dbPath: string): string {
  const base = path.basename(dbPath).replace(/\.json$/i, "");
  return base || "默认";
}

function filterVideos(
  list: ILocalVideo[],
  options: {
    onlyUnused: boolean;
    includeLost: boolean;
    includeHidden: boolean;
    limit: number | null;
  }
): ILocalVideo[] {
  let result = list;
  if (options.onlyUnused) result = result.filter((v) => !v.isUsed);
  if (!options.includeLost) result = result.filter((v) => v.localStatus !== "lost");
  if (!options.includeHidden) result = result.filter((v) => !v.isHidden);
  if (options.limit !== null) result = result.slice(0, options.limit);
  return result;
}

async function main(): Promise<void> {
  const dbPath = getArg("--db") ?? path.resolve(process.cwd(), "data/app_database.json");
  const upKey = getArg("--up") ?? inferUpKeyFromOutOrDb(dbPath);
  const outPath =
    getArg("--out") ?? path.resolve(process.cwd(), `data/${upKey}.request.js`);

  const onlyUnused = getBoolArg("--only-unused", true);
  const includeLost = getBoolArg("--include-lost", false);
  const includeHidden = getBoolArg("--include-hidden", false);
  const delayMs = getNumberArg("--delay-ms", 3000);
  const limitRaw = getArg("--limit");
  const limit = limitRaw ? (Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : null) : null;

  const repo = new JsonFileAppDatabaseRepository(dbPath);
  const db = await repo.load();
  const up = db.ups[upKey];
  if (!up) {
    throw new Error(`找不到 UP：${upKey}（db: ${dbPath}）`);
  }

  const picked = filterVideos(up.videos, { onlyUnused, includeLost, includeHidden, limit });
  const script = generateRequestScript(
    picked.map((v) => ({ id: v.id, href: v.href, title: v.title })),
    { delayMs }
  );

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, script, "utf8");

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        upKey,
        dbPath,
        outPath,
        total: up.videos.length,
        exported: picked.length,
        onlyUnused,
        includeLost,
        includeHidden,
        delayMs,
        limit
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

