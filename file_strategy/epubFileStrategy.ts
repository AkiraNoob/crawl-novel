import { EPub } from "epub-gen-memory";
import type { Options, Chapter } from "epub-gen-memory";
import { DOWNLOAD_TYPE } from "../constants/index.js";
import { IFileSavingStrategy } from "./strategy.js";
import fs from "fs";
import path from "path";

class EpubStrategy implements IFileSavingStrategy {
  async execute(data: Chapter[], options: Options) {
    try {
      const content = await new EPub(
        { ...options },
        data.map((item) => ({
          title: item.title,
          content: item.content,
        })),
      ).genEpub();

      const dir = path.resolve(process.cwd(), "files");
      console.log(dir);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filePath = path.join(dir, `${options.title}.${DOWNLOAD_TYPE.EPUB}`);
      await fs.promises.writeFile(filePath, Buffer.from(content));
    } catch (error) {
      console.log("Error", error);
    }
  }
}

export default EpubStrategy;
