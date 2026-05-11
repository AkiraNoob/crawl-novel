import { FileSavingStrategy } from "../file_strategy/index.js";

class Parser {
  _parser;

  setParser(parser) {
    this._parser = parser;
  }

  /**
   *
   * @param {string} url
   * @param {FileSavingStrategy} downloadStrategy
   * @param {{title: string, cover: string, [key: string]: any}} options
   */
  async execute(url, options) {
    return await this._parser.execute(url, options);
  }

  /**
   * Get novel meta data
   * @returns {Promise<{title: string, cover: string, chapterUrls: string[]}>}
   */
  async getMetaData(url) {
    return await this._parser.getMetaData(url);
  }
}

export default Parser;
