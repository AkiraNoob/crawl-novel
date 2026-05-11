import * as cheerio from 'cheerio'

const TOKEN = "2URrCJdYkHC4KDM8b0bbf4ddfac0324d032a0c44e0e76ef4e";

let browser;

/**
 * 
 * @param {string} url 
 * @param {string} query 
 * @returns {Promise<{texts: string, title: string}>}
 */
export async function scrapeContent(url, query) {
  try {
    const unblock = async (url) => {
      const response = await fetch(
        `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            content: true
          }),
        },
      );
      return await response.json();
    };

    const result = await unblock(url);
    const html = cheerio.load(result.content);

    const title = html('title').text()
    const texts = html(query)
      .map((i, el) => html(el).text())
      .get();

    return {
      texts: texts.join("\n"),
      title,
    }
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    if (browser) await browser?.close();
  }
}

