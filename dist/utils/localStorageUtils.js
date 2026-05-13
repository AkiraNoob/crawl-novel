class LocalStorageUtils {
    CRAWL_OPTIONS_LOCAL_STORAGE_KEY = "crawl_options";
    setCrawlOptions(data) {
        localStorage.setItem(this.CRAWL_OPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    getCrawlOptions() {
        const data = localStorage.getItem(this.CRAWL_OPTIONS_LOCAL_STORAGE_KEY);
        return !!data ? JSON.parse(data) : undefined;
    }
}
const localStorageUtils = new LocalStorageUtils();
export default localStorageUtils;
