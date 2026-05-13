import localStorageUtils, { ICrawlOptions } from "./utils/localStorageUtils.js";

//define global variables
const abortController = new AbortController();
const downloadBtn = document.getElementById(
  "btn-download",
) as HTMLButtonElement;
const cancelBtn = document.getElementById("btn-stop") as HTMLButtonElement;
const crawlForm = document.getElementById("crawl-form") as HTMLFormElement;
const btnLoadMetaData = document.getElementById(
  "btn-load-meta-data",
) as HTMLButtonElement;
const urlSelector = document.getElementById("url-selector") as HTMLInputElement;
const novelTitle = document.getElementById("novel-title") as HTMLInputElement;
const novelCover = document.getElementById("novel-cover") as HTMLInputElement;
const downloadFormat = document.getElementById(
  "crawl-form-fieldset",
) as HTMLFieldSetElement;
const chapterList = document.getElementById("chapter-list") as HTMLDivElement;
const chapterSection = document.getElementById(
  "chapters-section",
) as HTMLDivElement;
const totalChapters = document.getElementById(
  "total-chapters",
) as HTMLDivElement;
const totalChaptersNum = document.getElementById(
  "total-chapters-num",
) as HTMLDivElement;

let novelData: ICrawlOptions = {
  title: "",
  cover: "",
  chapterUrls: [],
  url: "",
  sourceType: "",
};

//define functions
function deleteChapter(url: string) {
  const index = novelData.chapterUrls.findIndex((value) => value === url);
  novelData.chapterUrls.splice(index, 1);
  localStorageUtils.setCrawlOptions(novelData);
}

function reloadChapterLists() {
  chapterList.replaceChildren();
  appendChapterLists();
}

function appendChapterLists() {
  const chapterUrls = novelData.chapterUrls;

  if (chapterUrls.length > 0) {
    chapterUrls.forEach((url, index) => {
      const container = document.createElement("div");
      container.classList.add("chapter-item");

      const a = document.createElement("a");
      a.href = url;
      a.textContent = url;
      a.target = "_blank";
      container.appendChild(a);

      const icon = document.createElement("i");
      icon.className = "fa-regular fa-trash-can";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-secondary chapter-item-icon";
      deleteBtn.appendChild(icon);
      deleteBtn.addEventListener("click", (e) => {
        deleteChapter(url);
        container.remove();
      });
      container.appendChild(deleteBtn);

      chapterList.appendChild(container);
    });

    chapterSection.classList.add("visible");
    totalChapters.classList.add("visible");
    totalChaptersNum.textContent = chapterUrls.length.toString();
  } else {
    chapterSection.classList.remove("visible");
    totalChapters.classList.remove("visible");
  }
}

function populatedData() {
  const { title, cover, chapterUrls, url } = novelData;
  if (title) {
    novelTitle.value = title;
  }

  if (cover) {
    novelCover.value = cover;

    const btn = document.getElementById(
      "novel-cover-open-btn",
    ) as HTMLButtonElement;

    btn.disabled = false;

    // avoid duplicate listeners
    btn.onclick = () => {
      window.open(cover, "_blank");
    };
  }
  reloadChapterLists();
}

async function retrieveContent(
  abortSignal: AbortSignal,
  startCallback: () => void,
  finallyCallback: () => void,
) {
  const { url, ...crawlOptions } = novelData;

  const outputType = Array.from(
    downloadFormat.querySelectorAll(
      'input[name="format"]',
    ) as NodeListOf<HTMLInputElement>,
  ).find((el) => el.checked)?.value;

  startCallback();
  //@ts-ignore
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
    .then((res: { data: any }) => {
      const data = res.data;

      if (data.success) {
        return data.data;
      } else {
        alert("Error: " + data.error);
      }
    })
    .catch((err: { message: string }) => {
      alert("Request failed: " + err.message);
    })
    .finally(() => {
      finallyCallback();
    });
}

async function retrieveSiteMetaData(
  abortSignal: AbortSignal,
  startCallback: () => void,
  finallyCallback: () => void,
) {
  const url = urlSelector.value;

  startCallback();
  //@ts-ignore
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
    .then((res: { data: any }) => {
      const data = res.data;

      if (data.success) {
        novelData = { ...data.data, url };
        localStorageUtils.setCrawlOptions(novelData);
        populatedData();
      } else {
        console.error("Error:", data.error);
        alert("Error: " + data.error);
      }
    })
    .catch((err: { message: string }) => {
      console.error("Request failed:", err);
      alert("Error: " + err.message);
    })
    .finally(() => {
      finallyCallback();
    });
}

function toggleDisabled(el: HTMLButtonElement, disabled: boolean) {
  if (!disabled) {
    el.classList.remove("disabled");
    el.disabled = false;
  } else {
    el.classList.add("disabled");
    el.disabled = true;
  }
}

function initiaion() {
  const dataFromLocalStorage = localStorageUtils.getCrawlOptions();

  if (dataFromLocalStorage) {
    novelData = dataFromLocalStorage;
    urlSelector.value = novelData.url;
    novelTitle.value = novelData.title;
    novelCover.value = novelData.cover;

    appendChapterLists();
  }
}

// DOM mutation
initiaion();

urlSelector.addEventListener("input", async (e) => {
  //@ts-ignore
  btnLoadMetaData.disabled = !e.target?.value.trim();
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
