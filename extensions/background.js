import { switchCrawler } from "./crawler";

const TARGET_URL = "http://localhost:3000";

chrome.action.onClicked.addListener(async () => {
  const host = document.location.host;
  const crawler = switchCrawler(host);

  chrome.tabs.create({ url: TARGET_URL }, () => {
    if (!crawler) {
      window.postMessage(
        {
          type: "FROM_EXTENSION",
          payload: {
            url: "https://example.com",
            query: "span.title",
          },
        },
        TARGET_URL
      );
    }
  });
});
