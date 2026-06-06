import type { Options } from "epub-gen-memory";
import { EPub } from "epub-gen-memory";
import fs from "fs";
import path from "path";
import { DOWNLOAD_TYPE } from "../constants/index.js";
import logger from "../utils/logger.js";
import FileSavingStrategy, { IFileSavingStrategy } from "./strategy.js";

class EpubStrategy extends FileSavingStrategy implements IFileSavingStrategy {
  async execute(cachedDir: string, options: Options) {
    try {
      const data = await this.loadCachedContent(cachedDir);
      const content = await new EPub(
        { ...options },
        data.map((item) => ({
          title: item.title,
          content: item.content,
        }))
      ).genEpub();

      const dir = path.resolve(process.cwd(), `files/epubs`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      logger.log(`[PROGRESS]: Saving content to epub format at ${dir}`);
      const filePath = path.join(dir, `${options.title}.${DOWNLOAD_TYPE.EPUB}`);
      await fs.promises.writeFile(filePath, Buffer.from(content));
      logger.log(`[PROGRESS]: Saved successfully`);
    } catch (error) {
      logger.log("Error", error);
    }
  }
}

export default EpubStrategy;
