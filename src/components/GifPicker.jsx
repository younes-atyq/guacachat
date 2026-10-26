import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGifs, gifSearchEnabled } from "../helpers/gifSearch";

const GifPicker = ({ onPick, onClose }) => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState(gifSearchEnabled ? "loading" : "off");
  const root = useRef();

  const load = useCallback(
    async (offset, signal) => {
      setStatus("loading");
      try {
        const result = await fetchGifs({ query, offset, signal });
        setGifs((prev) => (offset ? [...prev, ...result.gifs] : result.gifs));
        setHasMore(result.hasMore);
        setStatus(result.gifs.length || offset ? "ready" : "empty");
      } catch (error) {
        if (error.name !== "AbortError") setStatus("error");
      }
    },
    [query]
  );

  // Trending on open, then search as the user types (debounced)
  useEffect(() => {
    if (!gifSearchEnabled) return;
    const controller = new AbortController();
    const timer = setTimeout(
      () => load(0, controller.signal),
      query ? 350 : 0
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load, query]);

  // Close when clicking anywhere outside the picker (the GIF key toggles it)
  useEffect(() => {
    const handleClick = (e) => {
      if (root.current?.contains(e.target)) return;
      if (e.target.closest?.("[data-gif-toggle]")) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={root}
      className="gif-picker"
      role="dialog"
      aria-label="GIF picker"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="gif-bar">
        <span>GIF SEARCH</span>
        <button
          type="button"
          className="gif-close"
          onClick={onClose}
          aria-label="Close GIF picker"
        >
          X
        </button>
      </div>
      <label className="gif-search">
        <span>search&gt;</span>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type anything..."
          spellCheck="false"
          autoComplete="off"
        />
      </label>
      <div className="gif-results">
        {status === "off" && (
          <p className="gif-note">
            GIF search is offline.
            <br />
            Add REACT_APP_GIPHY_API_KEY and rebuild.
          </p>
        )}
        {status === "error" && (
          <p className="gif-note">Signal lost. Try again.</p>
        )}
        {status === "empty" && <p className="gif-note">No GIFs found.</p>}
        <div className="gif-grid">
          {gifs.map((gif, i) => (
            <button
              type="button"
              key={`${gif.id}-${i}`}
              className="gif-item"
              title={gif.title}
              onClick={() => onPick(gif)}
            >
              <img
                src={gif.preview}
                alt={gif.title}
                width={gif.previewWidth}
                height={gif.previewHeight}
                loading="lazy"
              />
            </button>
          ))}
        </div>
        {status === "loading" && <p className="gif-note">LOADING...</p>}
        {status === "ready" && hasMore && (
          <button
            type="button"
            className="gif-more"
            onClick={() => load(gifs.length)}
          >
            [ LOAD MORE ]
          </button>
        )}
      </div>
      <div className="gif-credit">POWERED BY GIPHY</div>
    </div>
  );
};

export default GifPicker;
