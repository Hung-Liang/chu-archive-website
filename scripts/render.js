const params = new URLSearchParams(window.location.search);
const category = params.get("cat");
const subCategory = params.get("sub");
const year = params.get("y");
const month = String(params.get("m")).padStart(2, "0");

// Removed tag popup related elements and logic as it's now handled by redirection to search_results.html

const CATEGORY_NAMES = { life: "直播存檔", gaming: "遊戲存檔" };
const SUB_CATEGORY_NAMES = { normal: "一般直播", member: "會限" };

const monthLabel = `${year} 年 ${Number(month)} 月`;
const scopeLabel = [CATEGORY_NAMES[category], SUB_CATEGORY_NAMES[subCategory]]
    .filter(Boolean)
    .join(" · ");
document.getElementById("month-title").textContent = monthLabel;
document.getElementById("month-subtitle").textContent = scopeLabel;
document.title = `${monthLabel} ${scopeLabel} - 宅宅軍團長回顧`;

fetch(`../data/${category}/${subCategory}/${year}/${month}.json`)
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status} for ${res.url}`);
        }
        return res.json();
    })
    .then((videos) => {
        const container = document.getElementById("video-list");
        container.innerHTML = ""; // Clear skeleton loaders
        document.getElementById("month-subtitle").textContent =
            `${scopeLabel} · ${videos.length} 部影片`;
        if (videos.length === 0) {
            container.innerHTML = "<p class='list-message'>此月份沒有影片。</p>";
            return;
        }

        videos.forEach((video) => {
            container.appendChild(renderVideoItem(video, { subCategory }));
        });
    })
    .catch((error) => {
        console.error("Error fetching or parsing video data:", error);
        const container = document.getElementById("video-list");
        container.innerHTML = `<p class='list-message error'>無法載入此月的影片資料。<br>錯誤: ${escapeHtml(error.message)}</p>`;
    });

