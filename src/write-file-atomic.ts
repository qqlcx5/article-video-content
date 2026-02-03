import path from "node:path";
import { promises as fs } from "node:fs";

export async function writeFileAtomic(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tempPath, content, "utf8");

  try {
    await fs.rename(tempPath, filePath);
    return;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "EEXIST" && err.code !== "EPERM" && err.code !== "EBUSY") {
      throw error;
    }
  }

  await fs.rm(filePath, { force: true });
  await fs.rename(tempPath, filePath);
}

