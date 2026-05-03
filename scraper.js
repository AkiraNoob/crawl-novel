const { Builder, Browser, By } = require("selenium-webdriver");

async function scrapeContent(url, query) {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    console.log(url, query);
    await driver.get(url);

    const spans = await driver.findElements(By.css(query));
    console.log(spans);

    const texts = [];

    for (const span of spans) {
      console.log(span.getText());
      texts.push(await span.getText());
    }

    return texts.join("\n");
  } catch (error) {
    alert("Error while doing the magic", error);
  } finally {
    await driver.quit();
  }
}

module.exports = {
  scrapeContent,
};
