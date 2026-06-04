import express from "express";
import cors from "cors";
import { FileSavingStrategy, EpubStrategy } from "./file_strategy/index.js";
import { AtlantisVienDongParser } from "./parser/index.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  DOWNLOAD_TYPE,
  REVERSERD_SOURCE_TYPE,
  SOURCE_TYPE,
} from "./constants/index.js";
import Parser from "./parser/parser.js";
import logger from "./utils/logger.js";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use((req, res, next) => {
  req.setTimeout(60000);
  res.setTimeout(60000);
  next();
});

app.post("/crawl", async (req, res) => {
  const fileSavingStrategy = new FileSavingStrategy();
  const parser = new Parser();

  try {
    const { outputType, url, ...options } = req.body;
    const host = new URL(url).host;
    const sourceType = REVERSERD_SOURCE_TYPE[host as keyof typeof REVERSERD_SOURCE_TYPE];

    switch (outputType) {
      case DOWNLOAD_TYPE.EPUB:
        fileSavingStrategy.setStrategy(new EpubStrategy());
        break;

      default:
        break;
    }

    switch (sourceType) {
      case SOURCE_TYPE.ATLANTIS_VIEN_DONG:
        parser.setParser(new AtlantisVienDongParser());
        break;

      default:
        break;
    }

    if (!parser || !fileSavingStrategy) {
      throw new Error("Parser or File saving strategy not init");
    }

    parser.execute(url, fileSavingStrategy, options);

    res.json({ success: true, data: "Saved" });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/meta-data", async (req, res) => {
  const parser = new Parser();
  try {
    const { url } = req.body;
    const host = new URL(url).host;
    const sourceType = REVERSERD_SOURCE_TYPE[host as keyof typeof REVERSERD_SOURCE_TYPE];

    switch (sourceType) {
      case SOURCE_TYPE.ATLANTIS_VIEN_DONG:
        parser.setParser(new AtlantisVienDongParser());
        break;

      default:
        break;
    }

    if (!parser) {
      throw new Error("Parser not init");
    }

    const data = await parser.getMetaData(url);
    res.json({ success: true, data: { ...data, sourceType } });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

const server = app.listen(3000, () => {
  logger.log("Server running at port 3000");
});

server.timeout = 60000;
