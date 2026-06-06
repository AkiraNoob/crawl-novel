import * as cheerio from "cheerio";
import { SOURCE_TYPE } from "../constants/index.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import { readCache, saveCache } from "../utils/cacheUtils.js";
import logger from "../utils/logger.js";
import { fetching, smartScapeFetching } from "../utils/scraperUtils.js";

export interface IParserOptions extends Pick<IMetaDataReturns, "chapterUrls"> {
  title: string;
  cover: string;
  contentQuery: string;
}

export interface IMetaDataReturns {
  title: string;
  cover?: string;
  chapterUrls: { url: string; title: string; index: number }[];
}
export interface IParser {
  execute(
    url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions
  ): Promise<void>;
  getMetaData(url: string): Promise<IMetaDataReturns | undefined>;
}

class Parser implements IParser {
  _parser: IParser | undefined;
  private _contentQuery: string = "";
  private _bookTitle: string = "";
  private _hashedFetchingMethod = {
    [SOURCE_TYPE.ATLANTIS_VIEN_DONG]: smartScapeFetching,
    [SOURCE_TYPE.POTATO]: fetching,
  };

  setParser(parser: IParser) {
    this._parser = parser;
  }

  get contentQuery(): string {
    return this._contentQuery;
  }
  set contentQuery(value: string) {
    this._contentQuery = value;
  }

  get bookTitle(): string {
    return this._bookTitle;
  }
  set bookTitle(value: string) {
    this._bookTitle = value;
  }

  protected getContent(html: string, contentQuery: string): string {
    const $ = cheerio.load(html);
    const texts = $(contentQuery)
      .map((i, el) => {
        return `<p>${$(el).text().toString()}</p>`;
      })
      .get();

    return texts.join("");
  }

  protected async loopGetContent(
    chapterUrls: IMetaDataReturns["chapterUrls"],
    sourceType: string
  ): Promise<boolean> {
    let succeed = true;

    for (const chapter of chapterUrls) {
      const title = chapter.title;
      const url = chapter.url;
      const index = chapter.index;

      logger.log(
        `[PROGRESS] Check if content of chap ${title} has been stored or not.`
      );

      const cachedContent = (await readCache(url, this._bookTitle))?.content;
      if (cachedContent) {
        logger.log(`[PROGRESS] Done get the cached content of chap ${title}.`);
        continue;
      }

      logger.log(`[PROGRESS] Fetching content of chap ${title}. URL: ${url}`);
      const html = (await this._hashedFetchingMethod[sourceType](url)) ?? "";
      const content = this.getContent(html, this._contentQuery);

      if (title && (content ?? []).length > 0) {
        await saveCache(this._bookTitle, {
          url,
          title,
          content,
          index,
        });

        logger.log(`[PROGRESS] Done fetching content of chap ${title}.`);
        continue;
      }

      logger.log(`[PROGRESS] Cannot get content of chap ${title}.`);
      succeed = false;
    }

    return succeed;
  }

  async execute(
    url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions
  ) {
    if (!this._parser) {
      logger.log("Init parser first");
      return;
    }
    return await this._parser.execute(url, fileSavingStrategy, options);
  }

  async getMetaData(url: string) {
    if (!this._parser) {
      logger.log("Init parser first");
      return;
    }
    return await this._parser.getMetaData(url);
  }
}

export default Parser;
