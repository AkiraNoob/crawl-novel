import express from "express";
import cors from "cors";
import { FileSavingStrategy, EpubStrategy } from "./file_strategy/index.js";
import { AtlantisVienDongParser } from "./parser/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { DOWNLOAD_TYPE, SOURCE_TYPE } from "./constants/index.js";
import Parser from "./parser/parser.js";

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

const fileSavingStrategy = new FileSavingStrategy();
const parser = new Parser();

app.post("/crawl", async (req, res) => {
  try {
    const {
      outputType,
      sourceType,
      url,
      ...options
    } = req.body;

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

    await parser.execute(url, fileSavingStrategy, options);

    res.json({ success: true, data: result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const server = app.listen(3000, () => {
  console.log("Server running at port 3000");
});

server.timeout = 60000;
