import { SOURCE_TYPE } from "./constants/index.js";

//define global variables
const abortController = new AbortController();
const startBtn = document.getElementById("btn-start");
const cancelBtn = document.getElementById("btn-stop");
const crawlForm = document.getElementById("crawl-form");
const btnLoadMetaData = document.getElementById("btn-load-meta-data");
const urlSelector = document.getElementById("url-selector");

//define functions

async function retrieveContent(abortSignal, startCallback, finallyCallback) {
  const url = urlSelector.value;

  startCallback();
  fetch(`${window.location.origin}/crawl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    signal: abortSignal,
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (data.success) {
        return data.data;
      } else {
        alert("Error: " + data.error);
      }
    })
    .finally(() => finallyCallback());
}

async function retrieveSiteMetaData(
  abortSignal,
  startCallback,
  finallyCallback
) {
  const url = urlSelector.value;

  startCallback();
  fetch(`${window.location.origin}/meta-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    signal: abortSignal,
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (data.success) {
        const { title, cover, ...options } = data.data;
        localStorage.setItem("crawl_options", JSON.stringify(options));
        if (title) document.getElementById("novel-title").value = title;

        if (cover) {
          document.getElementById("novel-cover").value = cover;
          const btn = document.getElementById("novel-cover-open-btn");

          btn.disabled = false;
          btn.addEventListener("click", () => {
            window.open(cover, "_blank");
          });
        }
      } else {
        alert("Error: " + data.error);
      }
    })
    .finally(() => finallyCallback());
}

// DOM mutation
urlSelector.addEventListener("change", async (e) => {
  btnLoadMetaData.disabled = !e.target.value.trim();
});

crawlForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await retrieveContent(
    abortController.signal,
    () => {
      startBtn.classList.add("disabled");
      startBtn.disabled = true;
    },
    () => {
      startBtn.classList.remove("disabled");
      startBtn.disabled = false;
    }
  );
});

cancelBtn.addEventListener("click", () =>
  abortController.abort("Fetch cancel: User cancel")
);

btnLoadMetaData.addEventListener("click", () => {
  retrieveSiteMetaData(
    abortController.signal,
    () => {
      btnLoadMetaData.disabled = true;
      btnLoadMetaData.setAttribute("data-state", "loading");
    },
    () => {
      btnLoadMetaData.disabled = false;
      btnLoadMetaData.setAttribute("data-state", "stale");
    }
  );
});
