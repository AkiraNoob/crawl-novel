import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import {
  DOMAIN_TO_SOURCE_TYPE,
  DOWNLOAD_TYPE,
  SOURCE_TYPE,
} from "./constants/index.js";
import { EpubStrategy, FileSavingStrategy } from "./file_strategy/index.js";
import PotatoParser from "./parser/PotatoParser.js";
import VuongTaiParser from "./parser/VuongTaiParser.js";
import { AtlantisVienDongParser } from "./parser/index.js";
import Parser from "./parser/parser.js";
import logger from "./utils/logger.js";

const htmlPath = path.join(process.cwd());

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(htmlPath));
app.use((req, res, next) => {
  req.setTimeout(60000);
  res.setTimeout(60000);
  next();
});

const setParser = (parser: Parser, sourceType: string) => {
  switch (sourceType) {
    case SOURCE_TYPE.ATLANTIS_VIEN_DONG:
      parser.setParser(new AtlantisVienDongParser());
      break;
    case SOURCE_TYPE.POTATO:
      parser.setParser(new PotatoParser());
    case SOURCE_TYPE.VUONG_TAI:
      parser.setParser(new VuongTaiParser());

    default:
      break;
  }
};

app.post("/crawl", async (req, res) => {
  const fileSavingStrategy = new FileSavingStrategy();
  const parser = new Parser();

  try {
    const { outputType, url, ...options } = req.body;
    const host = new URL(url).host;
    const sourceType =
      DOMAIN_TO_SOURCE_TYPE[host as keyof typeof DOMAIN_TO_SOURCE_TYPE];

    switch (outputType) {
      case DOWNLOAD_TYPE.EPUB:
        fileSavingStrategy.setStrategy(new EpubStrategy());
        break;

      default:
        break;
    }

    setParser(parser, sourceType);

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
    const sourceType =
      DOMAIN_TO_SOURCE_TYPE[host as keyof typeof DOMAIN_TO_SOURCE_TYPE];

    setParser(parser, sourceType);

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
