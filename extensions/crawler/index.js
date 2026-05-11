import { REVERSERD_SOURCE_TYPE, SOURCE_TYPE } from "../../constants";
import atlantisVienDongCrawler from "./AtlantisVienDongCrawler";

/**
 *
 * @param {string} host
 * @returns {{title: string, cover: string, startChapter: number, endChapter: number, chapterUrls: string[]} | null}
 */
export const switchCrawler = (host) => {
  const sourceType = REVERSERD_SOURCE_TYPE[host];
  let data;

  switch (sourceType) {
    case SOURCE_TYPE.ATLANTIS_VIEN_DONG:
      data = atlantisVienDongCrawler.execute();
      break;

    default:
      data = null;
      break;
  }

  return data;
};
