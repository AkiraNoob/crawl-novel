(function intiation() {
  const urlInput = document.getElementById("url");
  const queryInput = document.getElementById("query");

  const defaultUrl = localStorage.getItem("url") || "https://atlantisviendong.com/chuong-1-anh-da-dien-tu-lau-roi/";
  const defaultQuery =
    localStorage.getItem("query") || 'span[style="font-weight: 400"]';

  urlInput.value = defaultUrl;
  queryInput.value = defaultQuery;
})();

function retrieveContent() {
  const url = document.getElementById("url").value;
  const query = document.getElementById("query").value;

  fetch(`${window.location.origin}/crawl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, query }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (data.success) {
        alert("success");
        await navigator.clipboard.writeText(data.data);
      } else {
        alert("Error: " + data.error);
      }
    });
}
