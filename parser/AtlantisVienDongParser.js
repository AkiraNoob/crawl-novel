import { FileSavingStrategy } from "../file_strategy/index.js";
import { scrapeContent } from "../utils/scraperUtils.js";

class AtlantisVienDongParser {
  _query = span[(style = "font-weight: 400")];

  /**
   *
   * @param {string} url
   * @param {FileSavingStrategy} fileSavingStrategy
   * @param {{startChapter: number, endChapter: number, title: string, cover: string, chapterUrls: string[]}} options
   */
  async execute(url, fileSavingStrategy, options) {
    const { title: bookTitle, cover: bookCover, chapterUrls } = options;

    /**
     * @type {{title: string, texts: string}[]}
     */
    const bookContents = [];

    chapterUrls.forEach(async (url, index) => {
      const { texts, title: chapterTitle } = await scrapeContent(url, _query);
      texts.push({
        title: chapterTitle,
        texts,
      });
    });

    fileSavingStrategy.execute(bookContents, {
      bookTitle: bookTitle,
      cover: bookCover,
    });
  }
}

export default AtlantisVienDongParser
