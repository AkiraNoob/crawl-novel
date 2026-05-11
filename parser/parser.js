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
   * @param {{startChapter: number, endChapter: number, title: string, cover: string}} options
   */
  async execute(url, options) {
    this._parser.execute(url, options);
  }
}

export default Parser;
