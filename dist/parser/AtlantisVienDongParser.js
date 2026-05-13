import { SOURCE_TYPE } from "../constants/index.js";
import { loadSite } from "../utils/scraperUtils.js";
import * as cheerio from "cheerio";
class AtlantisVienDongParser {
    _query = 'span[style="font-weight: 400"]';
    async execute(url, fileSavingStrategy, options) {
        try {
            const { title: bookTitle, cover: bookCover, chapterUrls } = options;
            const bookContents = [];
            for (const url of chapterUrls) {
                const html = await loadSite(url, {
                    waitForSelector: {
                        selector: this._query,
                        timeout: 80000,
                    },
                });
                const $ = cheerio.load(html);
                const title = $("title").text();
                const texts = $(this._query)
                    .map((i, el) => $(el).toString())
                    .get();
                bookContents.push({
                    title,
                    content: texts.join(""),
                });
            }
            await fileSavingStrategy.execute(bookContents, {
                title: bookTitle,
                cover: bookCover,
                lang: 'vi',
                publisher: SOURCE_TYPE.ATLANTIS_VIEN_DONG
            });
        }
        catch (error) {
            console.error("ERROR getContent:", error);
            throw error;
        }
    }
    async getMetaData(url) {
        try {
            const html = await loadSite(url);
            const $ = cheerio.load(html);
            const title = $("title").text();
            const cover = $("meta[property='og:image']").attr("content");
            const links = $(".uk-width-1-1.uk-width-4-5\\@m a");
            const chapterUrls = links
                .map((_, el) => {
                return $(el).attr("href");
            })
                .get();
            return {
                title,
                cover,
                chapterUrls,
            };
        }
        catch (error) {
            console.error("ERROR getMetaData:", error);
            throw error;
        }
    }
}
export default AtlantisVienDongParser;
