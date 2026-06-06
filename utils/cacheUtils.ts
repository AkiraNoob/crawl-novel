import crypto from "crypto";
import fs from "fs";
import path from "path";

export const CACHE_DIR = "data/cache";

export interface ICachedData {
  url: string;
  title: string;
  content: string;
  cachedAt: string;
  index: number;
}

export function normalizeUrl(url: string) {
  const u = new URL(url);

  // Remove tracking params if desired
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ].forEach((param) => u.searchParams.delete(param));

  return u.toString();
}

export function getCacheKey(url: string) {
  return crypto.createHash("sha256").update(normalizeUrl(url)).digest("hex");
}

export function getCachePath(url: string, parentDir: string) {
  const key = getCacheKey(url);

  // Optional: split into subfolders
  return path.join(CACHE_DIR, parentDir, `${key}.json`);
}

export async function saveCache(
  parentDir: string,
  item: Omit<ICachedData, "cachedAt">
) {
  const filePath = getCachePath(item.url, parentDir);

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await fs.promises.writeFile(
    filePath,
    JSON.stringify(
      {
        ...item,
        cachedAt: new Date().toISOString(),
      } as ICachedData,
      null,
      2
    )
  );

  return filePath;
}

export async function readCache(
  url: string,
  parentDir: string
): Promise<ICachedData | null> {
  const filePath = getCachePath(url, parentDir);

  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}
