import { FileSavingStrategy } from "../file_strategy/index.js";
import { loadSite } from "../utils/scraperUtils.js";
import * as cheerio from "cheerio";

class AtlantisVienDongParser {
  _query = 'span[style="font-weight: 400"]';

  /**
   * Get novel content
   * @param {string} url
   * @param {FileSavingStrategy} fileSavingStrategy
   * @param {{title: string, cover: string, chapterUrls: string[]}} options
   */
  async execute(url, fileSavingStrategy, options) {
    try {
      const { title: bookTitle, cover: bookCover, chapterUrls } = options;

      /**
       * @type {{title: string, texts: string}[]}
       */
      const bookContents = [];

      for (const url of chapterUrls) {
         const html = await loadSite(url);
        const $ = cheerio.load(html);

        const title = $("title").text();
        const texts = $(this._query)
          .map((i, el) => $(el).text())
          .get();

        texts.push({
          title,
          texts,
        });
      }

      console.log(texts);

      await fileSavingStrategy.execute(bookContents, {
        bookTitle: bookTitle,
        cover: bookCover,
      });
    } catch (error) {
      console.error("ERROR getContent:", error);
      throw error;
    }
  }

  /**
   * Get novel meta data
   * @returns {Promise<{title: string, cover: string, chapterUrls: string[]}>}
   */
  async getMetaData(url) {
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
