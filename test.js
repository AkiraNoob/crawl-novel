import crypto from "crypto";
import fs from "fs";
import path from "path";

const fetchPHP = async () => {
  await fetch("https://atlantisviendong.com/wp-admin/admin-ajax.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      action: "load_full_chap",
      ID: 37815,
      nonce: "19499e0d3b",
    }),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      if (data.success && data.data) {
        console.log(data.data);
      } else {
        console.warn("Không tải được chương:", data);
      }
    })
    .catch((err) => console.error("Lỗi khi gọi Ajax:", err));
};

export function normalizeUrl(url) {
  const u = new URL(url);

  // Remove tracking params if desired
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ].forEach((param) => u.searchParams.delete(param));

  return u.toString();
}

function getCacheKey(url) {
  return crypto.createHash("sha256").update(normalizeUrl(url)).digest("hex");
}
async function saveCacheFiles() {
  const items = [
    {
      url: "https://atlantisviendong.com/chuong-1-anh-da-dien-tu-lau-roi/",
      title: "Chương 1: Anh đã điên từ lâu rồi",
      index: 1,
    },
    {
      url: "https://atlantisviendong.com/chuong-2-truc-ma-giau-to/",
      title: "Chương 2: Trúc mã giàu to!",
      index: 2,
    },
    {
      url: "https://atlantisviendong.com/chuong-3-may-dinh-vi-sieu-nho/",
      title: "Chương 3: Máy định vị siêu nhỏ",
      index: 3,
    },
    {
      url: "https://atlantisviendong.com/chuong-4-chong-tuong-lai/",
      title: "Chương 4: Chồng tương lai",
      index: 4,
    },
    {
      url: "https://atlantisviendong.com/chuong-5-the-gioi-khong-tuong/",
      title: "Chương 5: Thế giới không tưởng",
      index: 5,
    },
    {
      url: "https://atlantisviendong.com/chuong-6-anh-em-chi-cot/",
      title: "Chương 6: Anh em chí cốt!",
      index: 6,
    },
    {
      url: "https://atlantisviendong.com/chuong-7-duong-duong-chinh-chinh-buoc-vao-phong/",
      title: "Chương 7: Đường đường chính chính bước vào phòng",
      index: 7,
    },
    {
      url: "https://atlantisviendong.com/chuong-8-di-hoc/",
      title: "Chương 8: Đi học",
      index: 8,
    },
    {
      url: "https://atlantisviendong.com/chuong-9-tiec-chao-mung/",
      title: "Chương 9: Tiệc chào mừng",
      index: 9,
    },
    {
      url: "https://atlantisviendong.com/chuong-10-anh-em-tot/",
      title: "Chương 10: Anh em tốt!",
      index: 10,
    },
    {
      url: "https://atlantisviendong.com/chuong-11-ban-vong-nien/",
      title: "Chương 11: Bạn vong niên",
      index: 11,
    },
    {
      url: "https://atlantisviendong.com/chuong-12-cocktail-trung-sua/",
      title: "Chương 12: Cocktail trứng sữa",
      index: 12,
    },
    {
      url: "https://atlantisviendong.com/chuong-13-may-dinh-vi/",
      title: "Chương 13: Máy định vị",
      index: 13,
    },
    {
      url: "https://atlantisviendong.com/chuong-14-he-thong-giam-sat/",
      title: "Chương 14: Hệ thống giám sát",
      index: 14,
    },
    {
      url: "https://atlantisviendong.com/chuong-15-camera-bi-roi/",
      title: "Chương 15: Camera bị rơi",
      index: 15,
    },
    {
      url: "https://atlantisviendong.com/chuong-16-phong-cua-cau-bi-lap-thiet-bi-giam-sat/",
      title: "Chương 16: Phòng của cậu bị lắp thiết bị giám sát…",
      index: 16,
    },
    {
      url: "https://atlantisviendong.com/chuong-17-tong-giam-doc-hoac-xay-ra-chuyen-roi/",
      title: "Chương 17: “Tổng giám đốc Hoắc xảy ra chuyện rồi!”",
      index: 17,
    },
  ];

  for (const item of items) {
    const key = getCacheKey(item.url);
    console.log(key);
    const filePath = path.join(
      "data/cache/Sau Khi Tôi Chết, Trúc Mã Trở Thành Daddy - Atlantis Viễn Đông",
      `${key}.json`
    );
    const content = await fs.promises.readFile(
      `files/contents/Sau Khi Tôi Chết, Trúc Mã Trở Thành Daddy - Atlantis Viễn Đông/${item.index}.txt`,
      "utf8"
    );

    const data = {
      url: item.url,
      title: item.title,
      content,
      index: item.index,
      cachedAt: new Date().toISOString(),
    };

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );
  }
}

await saveCacheFiles();
// await getEntry();
// await getContent();
// await fetchPHP();
