export const DOWNLOAD_TYPE = {
  EPUB: "epub",
};

export const SOURCE_TYPE = {
  ATLANTIS_VIEN_DONG: "ATLANTIS_VIEN_DONG",
  POTATO: "POTATO",
};

export const DOMAIN_TO_SOURCE_TYPE = {
  "atlantisviendong.com": SOURCE_TYPE.ATLANTIS_VIEN_DONG,
  "khoaitay.cc": SOURCE_TYPE.POTATO,
};

export const SOURCE_TYPE_TO_DOMAIN = {
  [SOURCE_TYPE.ATLANTIS_VIEN_DONG]: "atlantisviendong.com",
  [SOURCE_TYPE.POTATO]: "khoaitay.cc",
};
