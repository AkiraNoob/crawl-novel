import Epub from "epub-gen";
import { DOWNLOAD_TYPE } from "../constants/index.js";
class EpubStrategy {
  /**
   *
   * @param {{title: string, texts: string}[]} data
   * @param {{bookTitle: string, author?: string, publisher?: string, cover?: string, output: string}} options
   */
  execute(data, options) {
    new Epub({
      ...options,
      output: `../files/${options.bookTitle}.${DOWNLOAD_TYPE.EPUB}`,
      content: data.map((item) => ({
        title: item.title,
        data: item.texts,
      })),
    });
  }
}

export default EpubStrategy;
