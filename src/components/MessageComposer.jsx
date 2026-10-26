import { useLayoutEffect, useState } from "react";
import GifPicker from "./GifPicker";

// Terminal-style message box: Enter sends, Shift+Enter adds a line,
// Esc cancels an edit, the GIF key opens the GIF picker.
const MessageComposer = ({
  value,
  onChange,
  onSend,
  onCancel,
  onPickGif,
  editing,
  username,
  textareaRef,
}) => {
  const [gifOpen, setGifOpen] = useState(false);

  // grow the textarea with its content (capped in CSS)
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, textareaRef]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    } else if (e.key === "Escape") {
      if (editing) onCancel();
      setGifOpen(false);
    }
  };

  const handlePick = (gif, query) => {
    setGifOpen(false);
    onPickGif(gif, query);
    textareaRef.current?.focus();
  };

  return (
    <div id="input-field">
      <div className={editing ? "composer editing" : "composer"}>
        {gifOpen && !editing && (
          <GifPicker onPick={handlePick} onClose={() => setGifOpen(false)} />
        )}
        <div className="composer-bar">
          <span>{editing ? "EDITING MESSAGE" : "TRANSMIT"}</span>
          <button
            type="button"
            className="gif-toggle"
            data-gif-toggle
            disabled={editing}
            aria-expanded={gifOpen}
            onClick={() => setGifOpen((open) => !open)}
          >
            GIF
          </button>
        </div>
        <label className="prompt">
          <span className="prompt-label">{username || "guest"}&gt;</span>
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="say something..."
            spellCheck="false"
            autoComplete="off"
            maxLength={2000}
          />
        </label>
        <div className="composer-keys">
          <span>[ENTER] SEND</span>
          <span>[SHIFT+ENTER] NEW LINE</span>
          {editing && <span>[ESC] CANCEL</span>}
        </div>
      </div>
      <button type="button" onClick={onSend} title="Send" id="send">
        SEND &gt;&gt;
      </button>
    </div>
  );
};

export default MessageComposer;
