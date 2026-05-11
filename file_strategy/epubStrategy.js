import Epub from "epub-gen";
import { DOWNLOAD_TYPE } from "../constants/index.js";
class EpubStrategy {
  /**
   *
   * @param {{title: string, texts: string}[]} data
   * @param {{bookTitle: string, author?: string, publisher?: string, cover?: string, output: string}} options
   */
  async execute(data, options) {
    new Epub({
      ...options,
      output: `../files/${options.bookTitle}.${DOWNLOAD_TYPE.EPUB}`,
      content: data.map((item) => ({
        title: item.title,
        data: item.texts,
      })),
    }).promise.then(
      () => console.log("Ebook Generated Successfully!"),
      (err) => console.error("Failed to generate Ebook because of ", err)
    );
  }
}

export default EpubStrategy;
