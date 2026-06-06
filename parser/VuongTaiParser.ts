import { SOURCE_TYPE, SOURCE_TYPE_TO_DOMAIN } from "../constants/index.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import { CACHE_DIR } from "../utils/cacheUtils.js";
import logger from "../utils/logger.js";
import { fetchingJson } from "../utils/scraperUtils.js";
import Parser, { IMetaDataReturns, IParser, IParserOptions } from "./parser.js";

class VuongTaiParser extends Parser implements IParser {
  private _URL_PREFIX = `https://${
    SOURCE_TYPE_TO_DOMAIN[SOURCE_TYPE.VUONG_TAI]
  }/api/public`;

  protected async getContent(
    _contentQuery: string,
    title: string,
    _sourceType: string,
    url: string
  ): Promise<string> {
    logger.log(`[PROGRESS] Fetching content of chap ${title}. URL: ${url}`);

    const _url = new URL(url);
    const chapterId = _url.searchParams.get("chapter");

    const chapterMetaData = await fetchingJson(
      `${this._URL_PREFIX}/chapter/${chapterId}.json`
    );
    if (chapterMetaData.error) {
      logger.log("ERROR getMetaData:", chapterMetaData.error);
      throw new Error(
        `Error fetching chapter metadata from ${
          SOURCE_TYPE_TO_DOMAIN[SOURCE_TYPE.VUONG_TAI]
        }`
      );
    }

    let data = chapterMetaData.data;

    const texts = (
      data.content.blocks as {
        id: string;
        type: string;
        inline: { text: string; marks: any[] }[];
      }[]
    ).map((item) => item.inline.map((_) => `<p>${_.text}</p>`).join(""));

    return texts.join("");
  }

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

  async getMetaData(_url: string) {
    const normalizedTitle = new URL(_url).pathname.split("/")[2];

    try {
      const novelMetaData = await fetchingJson(
        `${this._URL_PREFIX}/story/${normalizedTitle}.json`
      );

      if (novelMetaData.error) {
        logger.log("ERROR getMetaData:", novelMetaData.error);
        return;
      }

      let data = novelMetaData.data;

      const title = data?.title as string;
      const cover = data?.cover_url as string;
      const novelId = data?.id as string;

      const chapterUrls: IMetaDataReturns["chapterUrls"] = (
        (data?.chapters as {
          id: string;
          title: string;
          order_number: number;
        }[]) ?? []
      ).map((item) => ({
        index: item.order_number,
        title: item.title,
        url: `https://${
          SOURCE_TYPE_TO_DOMAIN[SOURCE_TYPE.VUONG_TAI]
        }/reader/?storyId=${novelId}&chapter=${item.id}`,
      }));

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

export default VuongTaiParser;
