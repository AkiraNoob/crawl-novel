import { SOURCE_TYPE } from "../constants/index.js";
import { loadSite } from "../utils/scraperUtils.js";
import * as cheerio from "cheerio";
import { IParser, IParserOptions } from "./parser.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import type {Options, Chapter} from 'epub-gen-memory'

class AtlantisVienDongParser implements IParser {
  _query = 'span[style="font-weight: 400"]';

  async execute(url: string, fileSavingStrategy: IFileSavingStrategy, options: IParserOptions) {
    try {
      const { title: bookTitle, cover: bookCover, chapterUrls } = options;


      const bookContents: Chapter[] = [];

      for (const url of chapterUrls) {
        const html = await loadSite(url, {
          waitForSelector: {
            selector: this._query,
            timeout: 80000,
          },
        });
        const $ = cheerio.load(html);

        const title = $("title").text();
        const texts = $(this._query)
          .map((i, el) => {
            console.log(`<p>${$(el).toString()}</p>`);
            return `<p>${$(el).toString()}</p>`
          })
          .get();

        bookContents.push({
          title,
          content: texts.join(""),
        });
      }

      await fileSavingStrategy.execute(bookContents, {
        title: bookTitle,
        cover: bookCover,
        lang: 'vi',
        publisher: SOURCE_TYPE.ATLANTIS_VIEN_DONG
      });
    } catch (error) {
      console.error("ERROR getContent:", error);
      throw error;
    }
  }

 
  async getMetaData(url: string) {
    try {
      const html = await loadSite(url);
      const $ = cheerio.load(html);

      const title = $("title").text();
      const cover = $("meta[property='og:image']").attr("content");

      const links = $(".uk-width-1-1.uk-width-4-5\\@m a");
      const chapterUrls = links
        .map((_, el) => {
          return $(el).attr("href");
        })
        .get();

      return {
        title,
        cover,
        chapterUrls,
      };
    } catch (error) {
      console.error("ERROR getMetaData:", error);
      throw error;
    }
  }
}

export default AtlantisVienDongParser;
