const TOKEN = "2URrCJdYkHC4KDM8b0bbf4ddfac0324d032a0c44e0e76ef4e";
export async function loadSite(url, expandedBody) {
    return await fetch(`https://production-sfo.browserless.io/unblock?token=${TOKEN}&proxy=residential&timeout=60000`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url,
            content: true,
            bestAttempt: true,
            ttl: 80000,
            ...expandedBody,
        }),
    })
        .then((res) => {
        console.log("Response:", res);
        return res.json();
    })
        .then((res) => res.content)
        .catch((error) => {
        console.error("ERROR:", error);
        throw error;
    });
}
