// GIF provider adapter. Tenor's API was shut down by Google (June 30, 2026),
// so this talks to GIPHY. To switch providers, only this file has to change:
// keep returning { id, title, url, preview, width, height, previewWidth,
// previewHeight } objects.
const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const BASE_URL = "https://api.giphy.com/v1/gifs";
export const PAGE_SIZE = 24;

export const gifSearchEnabled = Boolean(API_KEY);

const normalize = (gif) => {
  const images = gif.images || {};
  const full = images.downsized_medium || images.fixed_width || images.original;
  const preview = images.fixed_width_small || images.fixed_width || full;
  if (!full?.url || !preview?.url) return null;
  return {
    id: gif.id,
    title: gif.title || "GIF",
    url: full.url,
    preview: preview.url,
    previewWidth: Number(preview.width) || 100,
    previewHeight: Number(preview.height) || 100,
    width: Number(full.width) || 200,
    height: Number(full.height) || 200,
  };
};

// Trending GIFs when `query` is empty, search results otherwise.
export const fetchGifs = async ({ query = "", offset = 0, signal }) => {
  if (!API_KEY) throw new Error("GIF search is not configured");
  const term = query.trim();
  const params = new URLSearchParams({
    api_key: API_KEY,
    limit: PAGE_SIZE,
    offset,
    rating: "pg-13",
  });
  if (term) params.set("q", term);
  const res = await fetch(
    `${BASE_URL}/${term ? "search" : "trending"}?${params}`,
    { signal }
  );
  if (!res.ok) throw new Error(`GIF search failed (${res.status})`);
  const json = await res.json();
  const gifs = (json.data || []).map(normalize).filter(Boolean);
  const { total_count = 0, count = 0 } = json.pagination || {};
  return { gifs, hasMore: offset + count < total_count };
};

// Only ever render GIFs hosted by GIPHY, whatever a message document says.
export const isTrustedGifUrl = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && /(^|\.)giphy\.com$/.test(hostname);
  } catch {
    return false;
  }
};
