import { SOURCE_TYPE } from "../constants/index.js";
import { smartScapeFetching, unblockFetching } from "../utils/scraperUtils.js";
import * as cheerio from "cheerio";
import { IParser, IParserOptions } from "./parser.js";
import { IFileSavingStrategy } from "../file_strategy/strategy.js";
import type { Options, Chapter } from "epub-gen-memory";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";

class AtlantisVienDongParser implements IParser {
  private _metaDataQuery: string = ".uk-nav-sub li a";

  private getContent(html: string, contentQuery: string): string {
    const $ = cheerio.load(html);
    const texts = $(contentQuery)
      .map((i, el) => {
        return `<p>${$(el).text().toString()}</p>`;
      })
      .get();

    return texts.join("");
  }

  async execute(
    _url: string,
    fileSavingStrategy: IFileSavingStrategy,
    options: IParserOptions,
  ) {
    try {
      const {
        title: bookTitle,
        cover: bookCover,
        chapterUrls,
        contentQuery,
      } = options;

      const bookContents: Chapter[] = [];

      const dir = path.resolve(process.cwd(), `files/contents/${bookTitle}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      for (const chapter of chapterUrls) {
        const title = chapter.title;
        const filePath = path.join(dir, `${title}.txt`);
        logger.log(
          `[PROGRESS] Check if content of chap ${title} has been stored or not.`,
        );

        const isChapterExist = fs.existsSync(filePath);

        if (isChapterExist) {
          const content = await fs.promises.readFile(filePath, "utf8");
          bookContents.push({
            title,
            content,
          });
          logger.log(
            `[PROGRESS] Done get the cached content of chap ${title}.`,
          );
          continue;
        }

        logger.log(
          `[PROGRESS] Fetching content of chap ${title}. URL: ${chapter.url}`,
        );
        const html = (await smartScapeFetching(chapter.url)) ?? "";
        const content = this.getContent(html, contentQuery);

        if (title && (content ?? []).length > 0) {
          await fs.promises.writeFile(filePath, content);

          bookContents.push({
            title,
            content,
          });
          logger.log(`[PROGRESS] Done fetching content of chap ${title}.`);
          continue;
        }

        logger.log(`[PROGRESS] Cannot get content of chap ${title}.`);
      }

      logger.log(
        `[PROGRESS] Done fetching content of all chapters. Start saving file. Book contents: `,
        bookContents,
      );
      fileSavingStrategy.execute(bookContents, {
        title: bookTitle,
        cover: bookCover,
        lang: "vi",
        publisher: SOURCE_TYPE.ATLANTIS_VIEN_DONG,
      });
    } catch (error) {
      logger.log("ERROR getContent:", error);
      throw error;
    }
  }

  async getMetaData(url: string) {
    try {
      const html = await unblockFetching(url, {
        waitForSelector: {
          selector: this._metaDataQuery,
          timeout: 60000,
        },
      });
      const $ = cheerio.load(html);

      const title =
        $("title").text() ||
        ($("meta[property='og:title']").attr("content") as string);
      const cover = $("meta[property='og:image']").attr("content");

      const links = $(this._metaDataQuery);
      const chapterUrls = links
        .map((_, el) => {
          return {
            url: $(el).attr("href") || "",
            title: $(el).text(),
          };
        })
        .get();
      logger.log(`Get meta data:`, chapterUrls);

      return {
        title,
        cover,
        chapterUrls,
      };
    } catch (error) {
      logger.log("ERROR getMetaData:", error);
      throw error;
    }
  }
}

export default AtlantisVienDongParser;
