class DownloadStrategy {
  _strategy;

	setStrategy(strategy) {
		this._strategy = strategy
	}

	execute(texts, fileName) {
		this._strategy.execute(texts, fileName)
	}
}