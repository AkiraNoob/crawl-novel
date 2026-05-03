const express = require("express");
const cors = require("cors");
const { scrapeContent } = require("./scraper-puppeteer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use((req, res, next) => {
  req.setTimeout(60000);
  res.setTimeout(60000);
  next();
});

app.post("/crawl", async (req, res) => {
  try {
    const { url, query } = req.body;

    const result = await scrapeContent(url, query);
    console.log(result);

    res.json({ success: true, data: result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const server = app.listen(3000, () => {
  console.log("Server running at port 3000");
});

server.timeout = 60000;
