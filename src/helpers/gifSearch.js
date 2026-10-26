// GIF provider adapter. Tenor's API was shut down by Google (June 30, 2026),
// so this talks to KLIPY, the Tenor-style replacement (https://docs.klipy.com).
// To switch providers, only this file has to change: keep returning
// { id, slug, title, url, preview, width, height, previewWidth, previewHeight }.
//
// KLIPY rules this follows: requests are made from the browser, media is loaded
// straight from the URLs the API returns, and results are shown in API order.
const APP_KEY = process.env.REACT_APP_KLIPY_API_KEY;
const BASE_URL = "https://api.klipy.com/api/v1";
export const PAGE_SIZE = 24;
// off | low | medium | high
const CONTENT_FILTER = "medium";
// animated webp is far lighter than gif; gif is the fallback
const FORMATS = ["webp", "gif"];

export const gifSearchEnabled = Boolean(APP_KEY);

// first file found, trying each size in order, for the preferred formats
const pickFile = (file = {}, sizes) => {
  for (const size of sizes) {
    for (const format of FORMATS) {
      const media = file[size]?.[format];
      if (media?.url) return media;
    }
  }
  return null;
};

export const normalizeGif = (gif) => {
  const full = pickFile(gif.file, ["md", "sm", "hd", "xs"]);
  const preview = pickFile(gif.file, ["sm", "xs", "md", "hd"]);
  if (!full || !preview) return null;
  return {
    id: String(gif.id),
    slug: gif.slug,
    title: gif.title || "GIF",
    url: full.url,
    preview: preview.url,
    width: Number(full.width) || 200,
    height: Number(full.height) || 200,
    previewWidth: Number(preview.width) || 100,
    previewHeight: Number(preview.height) || 100,
  };
};

// Trending GIFs when `query` is empty, search results otherwise. `page` is 1-based.
export const fetchGifs = async ({ query = "", page = 1, signal }) => {
  if (!APP_KEY) throw new Error("GIF search is not configured");
  const term = query.trim();
  const params = new URLSearchParams({
    page,
    per_page: PAGE_SIZE,
    content_filter: CONTENT_FILTER,
    format_filter: FORMATS.join(","),
  });
  if (term) params.set("q", term);
  const res = await fetch(
    `${BASE_URL}/${APP_KEY}/gifs/${term ? "search" : "trending"}?${params}`,
    { signal }
  );
  if (!res.ok) throw new Error(`GIF search failed (${res.status})`);
  const json = await res.json();
  if (!json.result) throw new Error("GIF search failed");
  const { data = [], has_next = false } = json.data || {};
  return { gifs: data.map(normalizeGif).filter(Boolean), hasMore: has_next };
};

// Tell KLIPY a GIF was shared (it uses this to rank results). Best effort.
export const reportGifShared = ({ slug, query = "" }) => {
  if (!APP_KEY || !slug) return;
  fetch(`${BASE_URL}/${APP_KEY}/gifs/share/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: query.trim() }),
  }).catch(() => {});
};

// Only ever render GIFs hosted by KLIPY, whatever a message document says.
export const isTrustedGifUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && /(^|\.)klipy\.com$/.test(hostname);
  } catch {
    return false;
  }
};
