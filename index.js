import { SOURCE_TYPE } from "./constants/index.js";

(function intiation() {
  const urlInput = document.getElementById("url-selector");
  const queryInput = document.getElementById("quick-content-selector");

  const defaultUrl =
    localStorage.getItem("url-selector") ||
    "https://atlantisviendong.com/chuong-1-anh-da-dien-tu-lau-roi/";
  const defaultQuery =
    localStorage.getItem("quick-content-selector") ||
    'span[style="font-weight: 400"]';

  urlInput.value = defaultUrl;
  queryInput.value = defaultQuery;
})();

async function retrieveContent(abortSignal, startCallback, finallyCallback) {
  const url = document.getElementById("url-selector").value;
  const query = document.getElementById("quick-content-selector").value;

  localStorage.setItem("url-selector", url);
  localStorage.getItem("quick-content-selector", query);

  startCallback();
  fetch(`${window.location.origin}/crawl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, query }),
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

//

const abortController = new AbortController();
const startBtn = document.getElementById("btn-start");
const cancelBtn = document.getElementById("btn-stop");

cancelBtn.addEventListener("click", () =>
  abortController.abort("Fetch cancel: User cancel"),
);

startBtn.addEventListener("click", async (e) => {
  await retrieveContent(
    abortController.signal,
    () => {
      startBtn.classList.add("disabled");
      startBtn.disabled = true;
    },
    () => {
      startBtn.classList.remove("disabled");
      startBtn.disabled = false;
    },
  );
});
