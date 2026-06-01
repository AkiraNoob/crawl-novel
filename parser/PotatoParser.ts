import { SOURCE_TYPE } from "../constants/index.js";
import { loadSite } from "../utils/scraperUtils.js";
import * as cheerio from "cheerio";
import { IParser, IParserOptions } from "./parser.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import type { Options, Chapter } from "epub-gen-memory";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";

class PotatoParser implements IParser {
  _query = 'span[style="font-weight: 400"]';

  async execute(
    url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions,
  ) {
    try {
      const { title: bookTitle, cover: bookCover, chapterUrls } = options;

      const bookContents: Chapter[] = [];

      for (const url of chapterUrls) {
        logger.log(`[PROGRESS] Fetching content of chap ${url}.`);
        const html = await loadSite(url);
        const $ = cheerio.load(html);

        const title =
          $("title").text() || $("meta[property='og:title']").attr("content");
        const texts = $(this._query)
          .map((i, el) => {
            return `<p>${$(el).text().toString()}</p>`;
          })
          .get();

        const dir = path.resolve(process.cwd(), `files/contents/${bookTitle}`);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `${title}.txt`);

        await fs.promises.writeFile(filePath, texts.join(""));
        bookContents.push({
          title,
          content: texts.join(""),
        });
        logger.log(
          `[PROGRESS] Done fetching content of chap ${url}. Title: ${title}`,
        );
      }

      logger.log(
        `[PROGRESS] Done fetching content of all chapters. Start saving file.`,
      );
      fileSavingStrategy.execute(bookContents, {
        title: bookTitle,
        cover: bookCover,
        lang: "vi",
        publisher: SOURCE_TYPE.ATLANTIS_VIEN_DONG,
      });
    } catch (error) {
      logger.log("ERROR getContent:", error);
      throw error;
    }
  }

  async getMetaData(url: string) {
    try {
      const html = await loadSite(url);
      const $ = cheerio.load(html);

      const title =
        $("title").text() || $("meta[property='og:title']").attr("content") as string;
      const cover = $("meta[property='og:image']").attr("content");

      const links = $(".uk-nav-sub");
      logger.log(`Get meta data:`, links.length);
      const chapterUrls = links
        .map((_, el) => {
          return $(el.children).attr("href");
        })
        .get();
      logger.log(`Get meta data:`, chapterUrls);

      return {
        title,
        cover,
        chapterUrls,
      };
    } catch (error) {
      logger.log("ERROR getMetaData:", error);
      throw error;
    }
  }
}

export default PotatoParser;
