export const DOWNLOAD_TYPE = {
  EPUB: "epub",
};

export const SOURCE_TYPE = {
  ATLANTIS_VIEN_DONG: "ATLANTIS_VIEN_DONG",
  POTATO: "POTATO",
  VUONG_TAI: "VUONG_TAI",
};

export const SOURCE_TYPE_TO_DOMAIN = {
  [SOURCE_TYPE.ATLANTIS_VIEN_DONG]: "atlantisviendong.com",
  [SOURCE_TYPE.POTATO]: "khoaitay.cc",
  [SOURCE_TYPE.VUONG_TAI]: "vuongtai.space",
};

export const DOMAIN_TO_SOURCE_TYPE = Object.fromEntries(
  Object.entries(SOURCE_TYPE_TO_DOMAIN).map(([sourceType, domain]) => [
    domain,
    sourceType,
  ])
);
