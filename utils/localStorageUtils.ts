export interface ICrawlOptions {
  title: string;
  cover: string;
  chapterUrls: string[];
  url: string;
  sourceType: string;
}

class LocalStorageUtils {
  CRAWL_OPTIONS_LOCAL_STORAGE_KEY = "crawl_options";

  setCrawlOptions(data: ICrawlOptions) {
    localStorage.setItem(this.CRAWL_OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  getCrawlOptions(): ICrawlOptions | undefined {
    const data = localStorage.getItem(this.CRAWL_OPTIONS_LOCAL_STORAGE_KEY)
    return !!data ? JSON.parse(data) : undefined;
  }
}

const localStorageUtils = new LocalStorageUtils();
export default localStorageUtils
