import * as cheerio from "cheerio";
import { SOURCE_TYPE } from "../constants/index.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import { CACHE_DIR } from "../utils/cacheUtils.js";
import logger from "../utils/logger.js";
import { unblockFetching } from "../utils/scraperUtils.js";
import Parser, { IMetaDataReturns, IParser, IParserOptions } from "./parser.js";

class AtlantisVienDongParser extends Parser implements IParser {
  private _metaDataQuery: string = ".uk-nav-sub li a";

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

      let condition = false;
      while (!condition)
        condition = await this.loopGetContent(
          chapterUrls,
          SOURCE_TYPE.ATLANTIS_VIEN_DONG
        );

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
      const html = await unblockFetching(url, {
        waitForSelector: {
          selector: this._metaDataQuery,
          timeout: 60000,
        },
      });
      const $ = cheerio.load(html);

      const title =
        $("title").text() ||
        ($("meta[property='og:title']").attr("content") as string);
      const cover = $("meta[property='og:image']").attr("content");

      const links = $(this._metaDataQuery);
      const chapterUrls = links
        .map((_, el) => {
          return {
            url: $(el).attr("href") || "",
            title: $(el).text(),
            index: _ + 1,
          };
        })
        .get() as IMetaDataReturns["chapterUrls"];
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

export default AtlantisVienDongParser;
