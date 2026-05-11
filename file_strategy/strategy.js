class FileSavingStrategy {
  _strategy;

  setStrategy(strategy) {
    this._strategy = strategy;
  }

  /**
   *
   * @param {{title: string, texts: string}[]} data
   * @param {{bookTitle: string, author?: string, publisher?: string, cover?: string, output: string}} options
   */
  async execute(data, options) {
    if (!this._strategy) {
      console.error("Init strategy first");
      return;
    }

    this._strategy.execute(data, options);
  }
}

export default FileSavingStrategy;
