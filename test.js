import * as cheerio from "cheerio";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
const TOKEN = "2UVZ9cRpTSYhgvH1a62966eb117fd3e098f693b7d89150d97";

const getContent = async () => {
  const contentQuery = 'span[style="font-weight: 400"]';

  const chapter1 = await fsPromise.readFile(
    "./public/docs/atlantis-chapter-1.txt",
    "utf8",
  );

  const $ = cheerio.load(chapter1);

  const title =
    $("title").text() || $("meta[property='og:title']").attr("content");

  const texts = $(contentQuery)
    .map((i, el) => {
      return `<p>${$(el).text().toString()}</p>`;
    })
    .get();

  const dir = path.resolve(
    process.cwd(),
    `files/test/contents/AtlantisVienDong`,
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${title}.txt`);

  await fs.promises.writeFile(filePath, texts.join(""));
};

const getEntry = async () => {
  // const entry = await fetch(
  //   `https://production-sfo.browserless.io/chrome/unblock?blockAds=false&timeout=60000&token=${TOKEN}`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       url: "https://atlantisviendong.com/truyen/sau-khi-toi-chet-truc-ma-tro-thanh-daddy/",
  //       content: true,
  //       waitForSelector: {
  //         selector: ".uk-nav-sub li a",
  //       },
  //     }),
  //   },
  // )
  //   .then(async (res) => {
  //     if (res.status !== 200) {
  //       const text = await res.text();
  //       console.log("LoadSite text response: ", res);
  //       return text;
  //     }
  //     const json = await res.json();
  //     console.log("LoadSite json response: ", json);
  //     return json;
  //   })
  //   .then((res) => (typeof res === "string" ? res : res.content))
  //   .catch((error) => {
  //     console.log("ERROR:", error);
  //     throw error;
  //   });

  const entry = await fsPromise.readFile(
    "./public/docs/atlantis-entry.txt",
    "utf8",
  );
  const $ = cheerio.load(entry);

  const title =
    $("title").text() || $("meta[property='og:title']").attr("content");
  const cover = $("meta[property='og:image']").attr("content");

  const links = $(".uk-nav-sub li a");
  const chapterUrls = links
    .map((_, el) => {
      return $(el).attr("href");
    })
    .get();

  const dir = path.resolve(
    process.cwd(),
    `files/test/contents/AtlantisVienDong`,
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${title}-meta-data.txt`);
  // const htmlPath = path.join(dir, `${title}-html.txt`);

  await fs.promises.writeFile(
    filePath,
    JSON.stringify({
      title,
      chapterUrls,
    }),
  );

  // await fs.promises.writeFile(htmlPath, entry);
};

const fetchPHP = async () => {
  await fetch("https://atlantisviendong.com/wp-admin/admin-ajax.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      action: "load_full_chap",
      ID: 37815,
      nonce: "19499e0d3b",
    }),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        console.log(data.data);
      } else {
        console.warn("Không tải được chương:", data);
      }
    })
    .catch((err) => console.error("Lỗi khi gọi Ajax:", err));
};

await getEntry();
// await getContent();
// await fetchPHP();
