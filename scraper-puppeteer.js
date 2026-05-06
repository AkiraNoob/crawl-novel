const puppeteer = require("puppeteer-core");
const cheerio = require("cheerio");

const TOKEN = "2URrCJdYkHC4KDM8b0bbf4ddfac0324d032a0c44e0e76ef4e";

let browser;

async function scrapeContent(url, query) {
  try {
    const unblock = async (url) => {
      const response = await fetch(
        `https://production-sfo.browserless.io/smart-scrape?token=${TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            formats: ["html"],
          }),
        },
      );
      return await response.json();
    };

    const result = await unblock(url);
    const html = cheerio.load(result.content);

    const texts = html(query)
      .map((i, el) => html(el).text())
      .get();

    return texts.join("\n");
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    if (browser) await browser?.close();
  }
}

module.exports = {
  scrapeContent,
};