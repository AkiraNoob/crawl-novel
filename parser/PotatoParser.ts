import * as cheerio from "cheerio";
import type { Chapter } from "epub-gen-memory";
import { SOURCE_TYPE, SOURCE_TYPE_TO_DOMAIN } from "../constants/index.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import { CACHE_DIR } from "../utils/cacheUtils.js";
import logger from "../utils/logger.js";
import { fetching } from "../utils/scraperUtils.js";
import Parser, { IParser, IParserOptions } from "./parser.js";

class PotatoParser extends Parser implements IParser {
  private _metaDataQuery: string = "a[class='min-w-0 flex-1']";

  async execute(
    _url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions
  ) {
    try {
      const {
        title: bookTitle,
        cover: bookCover,
        chapterUrls,
        contentQuery,
      } = options;
      this.bookTitle = bookTitle;
      this.contentQuery = contentQuery;

      const bookContents: Chapter[] = [];

      let condition = false;
      while (!condition)
        condition = await this.loopGetContent(chapterUrls, SOURCE_TYPE.POTATO);

      logger.log(
        `[PROGRESS] Done fetching content of all chapters. Start saving file.`
      );
      fileSavingStrategy.execute(`${CACHE_DIR}/${this.bookTitle}`, {
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
      const URL_PREFIX = `https://${SOURCE_TYPE_TO_DOMAIN[SOURCE_TYPE.POTATO]}`;
      const html = await fetching(url);
      const $ = cheerio.load(html);

      const title = $("h1[class='mt-2 text-3xl font-bold sm:text-4xl']").text();
      const cover =
        URL_PREFIX +
        $(
          "div[class='aspect-[3/4] bg-stone-200 dark:bg-zinc-800'] img[class='h-full w-full object-cover']"
        ).attr("src");

      const links = $(this._metaDataQuery);
      const chapterUrls = links
        .map((_, el) => {
          return {
            url: URL_PREFIX + $(el).attr("href") || "",
            title: $(el).children("h3").text(),
            index: _ + 1,
          };
        })
        .get();
      logger.log(
        `Get meta data:`,
        JSON.stringify({
          chapterUrlsLength: chapterUrls.length,
          title,
          cover,
        })
      );

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
