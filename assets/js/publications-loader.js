/**
 * Publications loader (no changes required in main.js)
 * - Loads publications JSON from assets/data/publications.json
 * - Renders a category only when its <details> is opened
 *
 * Expected JSON format:
 * {
 *   "intl": [...],
 *   "dom": [...],
 *   "others": [...],
 *   "award": [...]
 * }
 *
 * Each item can be any shape your existing renderPubList understands.
 */

(() => {
  const DATA_URL = "assets/data/publications.json";
  const rendered = new Set();
  let cachedData = null;
  let loadingPromise = null;

  async function loadDataOnce() {
    if (cachedData) return cachedData;
    if (loadingPromise) return loadingPromise;

    loadingPromise = fetch(DATA_URL, { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load publications: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        cachedData = json || {};
        return cachedData;
      })
      .catch((err) => {
        console.error(err);
        cachedData = {};
        return cachedData;
      });

    return loadingPromise;
  }

  function fallbackRender(containerId, items) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!items || items.length === 0) {
      el.innerHTML = `<div class="p-4 text-gray-400">準備中</div>`;
      return;
    }

    el.innerHTML = items
      .map((it) => {
        const title = it.title ?? it.name ?? "Untitled";
        const authors = it.authors ?? "";
        const venue = it.venue ?? it.conference ?? "";
        const year = it.year ?? "";
        const links = Array.isArray(it.links) ? it.links : [];
        const linksHtml = links
          .map((l) => {
            const label = l.label ?? "Link";
            const url = l.url ?? l.href ?? "#";
            return `<a href="${url}" target="_blank" rel="noopener" class="text-sky-400 hover:underline mr-3">${label}</a>`;
          })
          .join("");

        return `
          <div class="p-4">
            <div class="font-semibold text-gray-100">${title}</div>
            <div class="text-sm text-gray-400 mt-1">${[authors, venue, year ? `(${year})` : ""].filter(Boolean).join(" / ")}</div>
            <div class="mt-2 text-sm">${linksHtml}</div>
          </div>
        `;
      })
      .join("");
  }

  function getTargetContainerId(detailsEl) {
    const target = detailsEl.querySelector("#pub-intl, #pub-dom, #pub-others, #pub-award");
    return target ? target.id : null;
  }

  async function renderIfNeeded(detailsEl) {
    if (!detailsEl.open) return;
    const containerId = getTargetContainerId(detailsEl);
    if (!containerId) return;
    if (rendered.has(containerId)) return;

    rendered.add(containerId);

    // show a tiny loading message
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = `<div class="p-4 text-gray-400">Loading...</div>`;

    const data = await loadDataOnce();

    const map = {
      "pub-intl": data.intl ?? [],
      "pub-dom": data.dom ?? [],
      "pub-others": data.others ?? [],
      "pub-award": data.award ?? [],
    };

    const items = map[containerId] ?? [];

    // Prefer existing renderPubList from main.js (if present)
    if (typeof window.renderPubList === "function") {
      try {
        window.renderPubList(containerId, items);
        return;
      } catch (e) {
        console.error("renderPubList failed; using fallback renderer.", e);
      }
    }
    fallbackRender(containerId, items);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pubSection = document.getElementById("publications");
    if (!pubSection) return;

    pubSection.querySelectorAll("details").forEach((dt) => {
      dt.addEventListener("toggle", () => renderIfNeeded(dt));
    });
  });
})();
