const puppeteer = require("puppeteer-core");

const TOKEN = "2URrCJdYkHC4KDM8b0bbf4ddfac0324d032a0c44e0e76ef4e";

let browser;

async function scrapeContent(url, query) {
  try {
    const unblock = async (url) => {
      const response = await fetch(
        `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: url,
            browserWSEndpoint: true,
            cookies: true,
            ttl: 30000,
          }),
        }
      );
      return await response.json();
    };

    // Get the WebSocket endpoint after bot detection bypass
    const { browserWSEndpoint } = await unblock(url);

    // Connect to the browser
    browser = await puppeteer.connect({
      browserWSEndpoint: `${browserWSEndpoint}?token=${TOKEN}`,
    });
    const page = (await browser.pages())[0];

    const texts = await page.$$eval(query, (els) =>
      els.map((el) => el.innerText.trim())
    );

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
