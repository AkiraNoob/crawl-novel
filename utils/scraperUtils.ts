import logger from "./logger.js";

const TOKEN = "2UVZ9cRpTSYhgvH1a62966eb117fd3e098f693b7d89150d97";

interface IExpandedBody {
  waitForSelector: {
    selector: string;
    timeout: number;
  };
}

export async function loadSite(
  url: string,
): Promise<string> {
  return await fetch(
    `https://production-sfo.browserless.io/smart-scrape?token=${TOKEN}&timeout=60000`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formats: ['html'],
      }),
    },
  )
    .then(async (res) => {
      if (res.status !== 200) {
        const text = await res.text();
        logger.log("LoadSite text response: ", text);
        return text;
      }
      const json = await res.json();
      logger.log("LoadSite json response: ", json);
      return json;
    })
    .then((res) => (typeof res === "string" ? res : res.content))
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}

export async function loadSiteNormally(
  url: string,
): Promise<string> {
  return await fetch(url)
    .then(async (res) => {
      const json = await res.json();
      logger.log("LoadSite json response: ", json);
      return json;
    })
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}
