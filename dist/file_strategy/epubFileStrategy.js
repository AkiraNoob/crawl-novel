import { EPub } from "epub-gen-memory";
import { DOWNLOAD_TYPE } from "../constants/index.js";
import { writeFile } from "fs/promises";
class EpubStrategy {
    async execute(data, options) {
        const content = await new EPub({ ...options }, data.map((item) => ({
            title: item.title,
            content: item.content,
        }))).genEpub();
        await writeFile(`../files/${options.title}.${DOWNLOAD_TYPE.EPUB}`, Buffer.from(content));
    }
}
export default EpubStrategy;
