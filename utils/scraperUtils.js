import * as cheerio from "cheerio";

const TOKEN = "2URrCJdYkHC4KDM8b0bbf4ddfac0324d032a0c44e0e76ef4e";

// /**
//  *
//  * @param {string} url
//  * @param {string} query
//  * @returns {Promise<{texts: string, title: string}>}
//  */
// export async function scrapeContent(url, query) {
//   try {
//     const unblock = async (url) => {
//       const response = await fetch(
//         `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             url,
//             content: true,
//           }),
//         }
//       );
//       return await response.json();
//     };

//     const result = await unblock(url);
//     const $ = cheerio.load(result.content);

//     const title = $("title").text();
//     const texts = $(query)
//       .map((i, el) => $(el).text())
//       .get();

//     return {
//       texts: texts.join("\n"),
//       title,
//     };
//   } catch (error) {
//     console.error("ERROR scrapeContent:", error);
//   }
// }

/**
 *
 * @param {string} url
 * @returns {Promise<string>} HTMl content
 */
export async function loadSite(url) {
  try {
    const result = await fetch(
      `https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          content: true,
        }),
      }
    )
      .then((res) => res.json())
      .catch((error) => {
        throw error;
      });

    return result.content;
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
}
