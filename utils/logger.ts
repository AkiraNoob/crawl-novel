import fs from "fs";
import path from "path";

export class Logger {
  private stream: fs.WriteStream;
  private timeStamp: string = new Date().toISOString().slice(0, 10);
  private _logFileDir = `files/logs/logger_${this.timeStamp}.txt`;

  constructor() {
    const dir = path.dirname(this._logFileDir);

    fs.mkdirSync(dir, { recursive: true });

    this.stream = fs.createWriteStream(this._logFileDir, {
      flags: "a",
    });
  }

  log(...args: unknown[]) {
    const timestamp = new Date().toISOString();

    const message = args
      .map((arg) =>
        typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
      )
      .join(" ");

    this.stream.write(`[${timestamp}] ${message}\n`);
  }

  close() {
    this.stream.end();
  }
}

const logger = new Logger();
export default logger;
