const TOKEN = "2UVZ9cRpTSYhgvH1a62966eb117fd3e098f693b7d89150d97";

interface IExpandedBody {
  waitForSelector: {
    selector: string;
    timeout: number;
  };
}

export async function loadSite(
  url: string,
  expandedBody?: IExpandedBody,
): Promise<string> {
  return await fetch(
    `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential&timeout=60000`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        content: true,
        cookies: false,
        screenshot: false,
        browserWSEndpoint: false,
        bestAttempt: true,
        ttl: 80000,
        ...expandedBody,
      }),
    },
  )
    .then(async (res) => {
      console.log("Response: ", res);
      if (res.status !== 200) {
        const text = await res.text();
        console.log("Text response: ", text);
        return text;
      }
      const json = await res.json();
        console.log("JSON response: ", json);
      return json;
    })
    .then((res) => (typeof res === "string" ? res : res.content))
    .catch((error) => {
      console.error("ERROR:", error);
      throw error;
    });
}
