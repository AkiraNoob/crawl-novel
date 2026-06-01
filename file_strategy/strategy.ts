import type {Options, Chapter} from 'epub-gen-memory'
import logger from "../utils/logger.js";

export interface IFileSavingStrategy {
  execute(data: Chapter[], options: Options): Promise<void>
}

class FileSavingStrategy implements IFileSavingStrategy {
  _strategy: IFileSavingStrategy | undefined;

  setStrategy(strategy: IFileSavingStrategy) {
    this._strategy = strategy;
  }

  async execute(data: Chapter[], options: Options) {
    if (!this._strategy) {
      logger.log("Init strategy first");
      return;
    }

    return await this._strategy.execute(data, options);
  }
}

export default FileSavingStrategy;
