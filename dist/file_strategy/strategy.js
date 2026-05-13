class FileSavingStrategy {
    _strategy;
    setStrategy(strategy) {
        this._strategy = strategy;
    }
    async execute(data, options) {
        if (!this._strategy) {
            console.error("Init strategy first");
            return;
        }
        return await this._strategy.execute(data, options);
    }
}
export default FileSavingStrategy;
