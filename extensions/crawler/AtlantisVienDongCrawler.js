class AtlantisVienDongCrawler {
  /**
   *
   * @returns {{title: string, cover: string, startChapter: number, endChapter: number, chapterUrls: string[]}}
   */
  execute() {
    const title = document.title;
    const cover = document.querySelector("meta[property='og:image']");
    const container = document.querySelector(
      ".uk-width-1-1 uk-width-4-5\\@m uk-first-column"
    );

    const links = container.querySelectorAll("a");

    const startChapter = 1;
    const endChapter = links.length;
    const chapterUrls = Array.from(container.querySelectorAll("a")).map(
      (a) => a.href
    );

    return {
      title,
      cover,
      startChapter,
      endChapter,
      chapterUrls,
    };
  }
}

const atlantisVienDongCrawler = new AtlantisVienDongCrawler();
export default atlantisVienDongCrawler;
