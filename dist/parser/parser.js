class Parser {
    _parser;
    setParser(parser) {
        this._parser = parser;
    }
    async execute(url, fileSavingStrategy, options) {
        if (!this._parser) {
            console.error("Init parser first");
            return;
        }
        return await this._parser.execute(url, fileSavingStrategy, options);
    }
    async getMetaData(url) {
        if (!this._parser) {
            console.error("Init parser first");
            return;
        }
        return await this._parser.getMetaData(url);
    }
}
export default Parser;
