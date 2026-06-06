import "dotenv/config";
import logger from "./logger.js";

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const getBrowserlessBaseUrl = (method: string) =>
  `https://production-sfo.browserless.io/${method}?token=${BROWSERLESS_TOKEN}&timeout=60000`;

interface IExpandedBody {
  waitForSelector: {
    selector: string;
    timeout: number;
  };
}

export async function smartScapeFetching(url: string): Promise<string> {
  return await fetch(getBrowserlessBaseUrl("smart-scrape"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      formats: ["html"],
    }),
  })
    .then(async (res) => {
      if (res.status !== 200) {
        const text = await res.text();
        // logger.log("LoadSite text response: ", text);
        return text;
      }
      const json = await res.json();
      // logger.log("LoadSite json response: ", json);
      return json;
    })
    .then((res) => (typeof res === "string" ? res : res.content))
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}

export async function unblockFetching(
  url: string,
  expandedBody: IExpandedBody
): Promise<string> {
  return await fetch(getBrowserlessBaseUrl("unblock") + `&proxy=residential`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      content: true,
      ...expandedBody,
    }),
  })
    .then(async (res) => {
      if (res.status !== 200) {
        const text = await res.text();
        // logger.log("LoadSite text response: ", res);
        return text;
      }
      const json = await res.json();
      // logger.log("LoadSite json response: ", json);
      return json;
    })
    .then((res) => (typeof res === "string" ? res : res.content))
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}

export async function fetchingHTML(url: string): Promise<string> {
  return await fetch(url)
    .then(async (res) => {
      const json = await res.text();
      logger.log(json);
      return json;
    })
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}

export async function fetchingJson(
  url: string
): Promise<{ [key: string]: any }> {
  return await fetch(url)
    .then(async (res) => {
      const json = await res.json();
      return json;
    })
    .catch((error) => {
      logger.log("ERROR:", error);
      throw error;
    });
}
