import type { Chapter, Options } from "epub-gen-memory";
import fs from "fs";
import path from "path";
import { ICachedData } from "../utils/cacheUtils.js";
import logger from "../utils/logger.js";
export interface IFileSavingStrategy {
  execute(cachedDir: string, options: Options): Promise<void>;
}

class FileSavingStrategy implements IFileSavingStrategy {
  _strategy: IFileSavingStrategy | undefined;

  setStrategy(strategy: IFileSavingStrategy) {
    this._strategy = strategy;
  }

  protected async loadCachedContent(cachedDir: string): Promise<Chapter[]> {
    const bookContents: Pick<ICachedData, "content" | "title" | "index">[] = [];
    const files = await fs.promises.readdir(cachedDir);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(cachedDir, file);

      try {
        const raw = await fs.promises.readFile(filePath, "utf8");
        const data: ICachedData = JSON.parse(raw);

        if (data.content) {
          bookContents.push({
            content: data.content,
            title: data.title,
            index: data.index,
          });
        }
      } catch (err) {
        console.error(`Failed to load cache file: ${filePath}`, err);
      }
    }

    return bookContents
      .sort((a, b) => a.index - b.index)
      .map<Chapter>((item) => ({ content: item.content, title: item.title }));
  }

  async execute(cachedDir: string, options: Options) {
    if (!this._strategy) {
      logger.log("Init strategy first");
      return;
    }

    return await this._strategy.execute(cachedDir, options);
  }
}

export default FileSavingStrategy;
