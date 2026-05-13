import type {Options, Chapter} from 'epub-gen-memory'

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
      console.error("Init strategy first");
      return;
    }

    return await this._strategy.execute(data, options);
  }
}

export default FileSavingStrategy;
