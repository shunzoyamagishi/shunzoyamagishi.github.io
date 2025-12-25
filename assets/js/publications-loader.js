let PUB_DATA = null;
const rendered = new Set();

// === 自分の名前（自動下線対象） ===
const MY_NAMES = [
  "Shunzo Yamagishi",
  "山岸 峻造"
];

async function loadPubsOnce() {
  if (PUB_DATA) return PUB_DATA;

  const res = await fetch("data/publications.json", { cache: "no-store" });
  if (!res.ok) throw new Error("publications.json load failed: " + res.status);

  PUB_DATA = await res.json();
  return PUB_DATA;
}

document.addEventListener("DOMContentLoaded", () => {
  const pubSection = document.getElementById("publications");
  if (!pubSection) return;

  // デバッグ：main.js が読み込まれてるか
  console.log("[pub] renderPubList =", typeof window.renderPubList);

  pubSection.querySelectorAll("details").forEach((dt) => {
    dt.addEventListener("toggle", async () => {
      if (!dt.open) return; // 開いたときだけ

      // この details の中にある注入先IDを拾う（確実）
      const target = dt.querySelector("#pub-intl, #pub-dom, #pub-others, #pub-award");
      if (!target) return;

      const id = target.id;
      if (rendered.has(id)) return; // 既に描画済みならスキップ
      rendered.add(id);

      const data = await loadPubsOnce();

      if (typeof window.renderPubList !== "function") {
        throw new Error("renderPubList is not defined (main.js not loaded?)");
      }

      if (id === "pub-intl") window.renderPubList("pub-intl", data.intl || []);
      if (id === "pub-dom") window.renderPubList("pub-dom", data.dom || []);
      if (id === "pub-others") window.renderPubList("pub-others", data.others || []);
      if (id === "pub-award") window.renderPubList("pub-award", data.award || []);
    });
  });
});

function underlineMyName(authors) {
  if (!authors) return "";

  let result = authors;

  MY_NAMES.forEach(name => {
    // 正規表現エスケープ
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // 文字列に「ASCII文字（英数字・記号）以外」が含まれているかチェック
    const hasMultiByte = /[^\x00-\x7F]/.test(name);
    let re;

    if (hasMultiByte) {
      // 日本語が含まれる場合: 単語境界 \b を使わずに作成
      re = new RegExp(escaped, "g");
    } else {
      // 英語のみの場合: 単語境界 \b を使用して、部分一致を防ぐ
      re = new RegExp(`\\b${escaped}\\b`, "g");
    }

    result = result.replace(
      re,
      `<u>${name}</u>`
    );
  });

  return result;
}

