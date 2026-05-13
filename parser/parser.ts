import { IFileSavingStrategy } from "../file_strategy/strategy.js";

export interface IParserOptions {
  title: string;
  cover: string;
  chapterUrls: string[];
}

export interface IMetaDataReturns {
  title: string;
  cover?: string;
  chapterUrls: string[];
}
export interface IParser {
  execute(
    url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions,
  ): Promise<void>;
  getMetaData(url: string): Promise<IMetaDataReturns | undefined>;
}

class Parser implements IParser {
  _parser: IParser | undefined;

  setParser(parser: IParser) {
    this._parser = parser;
  }

  async execute(
    url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions,
  ) {
    if (!this._parser) {
      console.error("Init parser first");
      return;
    }
    return await this._parser.execute(url, fileSavingStrategy, options);
  }

  async getMetaData(url: string) {
    if (!this._parser) {
      console.error("Init parser first");
      return;
    }
    return await this._parser.getMetaData(url);
  }
}

export default Parser;
