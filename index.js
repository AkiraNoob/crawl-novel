import { SOURCE_TYPE } from "./constants/index.js";

//define global variables
const LOCAL_STORAGE_KEY = "crawl_options";
const abortController = new AbortController();
const downloadBtn = document.getElementById("btn-download");
const cancelBtn = document.getElementById("btn-stop");
const crawlForm = document.getElementById("crawl-form");
const btnLoadMetaData = document.getElementById("btn-load-meta-data");
const urlSelector = document.getElementById("url-selector");
const novelTitle = document.getElementById("novel-title");
const novelCover = document.getElementById("novel-cover");
const downloadFormat = document.getElementById("crawl-form-fieldset");
const chapterList = document.getElementById("chapter-list");
const chapterSection = document.getElementById("chapters-section");
const totalChapters = document.getElementById("total-chapters");
const totalChaptersNum = document.getElementById("total-chapters-num");

//define functions
function appendChapterLists(_chapterUrls) {
  const chapterUrls =
    _chapterUrls ||
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).chapterUrls ||
    [];
  if (chapterUrls.length > 0) {
    chapterUrls.forEach((url, index) => {
      const a = document.createElement("a");
      a.href = url;
      a.classList.add("chapter-item");
      a.textContent = url;
      a.target = "_blank";
      chapterList.appendChild(a);
    });

    chapterSection.classList.add("visible");
    totalChapters.classList.add("visible");
    totalChaptersNum.textContent = chapterUrls.length;
  } else {
    chapterSection.classList.remove("visible");
    totalChapters.classList.remove("visible");
  }
}

function populatedData(data) {
  const { title, cover, chapterUrls, url } = data;
  if (title) {
    novelTitle.value = title;
  }

  if (cover) {
    novelCover.value = cover;

    const btn = document.getElementById("novel-cover-open-btn");

    btn.disabled = false;

    // avoid duplicate listeners
    btn.onclick = () => {
      window.open(cover, "_blank");
    };
  }
  appendChapterLists(chapterUrls);
}

async function retrieveContent(abortSignal, startCallback, finallyCallback) {
  const { url, ...crawlOptions } = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY),
  );
  const outputType = Array.from(
    downloadFormat.querySelectorAll('input[name="format"]'),
  ).find((el) => el.checked).value;

  startCallback();
  axios
    .post(
      `${window.location.origin}/crawl`,
      { ...crawlOptions, outputType, url },
      {
        signal: abortSignal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((res) => {
      const data = res.data;

      if (data.success) {
        return data.data;
      } else {
        alert("Error: " + data.error);
      }
    })
    .catch((err) => {
      alert("Request failed: " + err.message);
    })
    .finally(() => {
      finallyCallback();
    });
}

async function retrieveSiteMetaData(
  abortSignal,
  startCallback,
  finallyCallback,
) {
  const url = urlSelector.value;

  startCallback();
  axios
    .post(
      `${window.location.origin}/meta-data`,
      { url },
      {
        signal: abortSignal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((res) => {
      const data = res.data;

      if (data.success) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ ...data.data, url }),
        );

        populatedData(data.data);
      } else {
        console.error("Error:", data.error);
        alert("Error: " + data.error);
      }
    })
    .catch((err) => {
      console.error("Request failed:", err);
      alert("Error: " + err.message);
    })
    .finally(() => {
      finallyCallback();
    });
}

function toggleDisabled(el, disabled) {
  if (!disabled) {
    el.classList.remove("disabled");
    el.disabled = false;
  } else {
    el.classList.add("disabled");
    el.disabled = true;
  }
}

function initiaion() {
  const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  urlSelector.value = savedData.url;
  novelTitle.value = savedData.title;
  novelCover.value = savedData.cover;

  appendChapterLists(savedData.chapterUrls);
}

// DOM mutation
initiaion();

urlSelector.addEventListener("input", async (e) => {
  btnLoadMetaData.disabled = !e.target.value.trim();
});

crawlForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await retrieveContent(
    abortController.signal,
    () => toggleDisabled(downloadBtn, true),
    () => toggleDisabled(downloadBtn, false),
  );
});

cancelBtn.addEventListener("click", () =>
  abortController.abort("Fetch cancel: User cancel"),
);

btnLoadMetaData.addEventListener("click", () => {
  retrieveSiteMetaData(
    abortController.signal,
    () => {
      toggleDisabled(btnLoadMetaData, true);
      btnLoadMetaData.setAttribute("data-state", "loading");
    },
    () => {
      toggleDisabled(btnLoadMetaData, false);
      btnLoadMetaData.setAttribute("data-state", "stale");
    },
  );
});
