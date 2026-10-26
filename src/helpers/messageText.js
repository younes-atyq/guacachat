const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Plain text from the composer -> the HTML stored on the message document.
export const textToMessageHtml = (text) =>
  `<div class="text-msg"><p>${escapeHtml(text.trim()).replace(
    /\n/g,
    "<br>"
  )}</p></div>`;

const BLOCK_TAGS = new Set(["P", "DIV", "H1", "H2", "H3", "LI", "UL", "OL"]);

// Stored message HTML -> plain text, to edit a message in the composer.
// DOMParser keeps the markup inert, so nothing in it can load or run.
export const messageHtmlToText = (html) => {
  const body = new DOMParser().parseFromString(html || "", "text/html").body;
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeName === "BR") return "\n";
    const inner = Array.from(node.childNodes).map(walk).join("");
    return BLOCK_TAGS.has(node.nodeName) ? `${inner}\n` : inner;
  };
  return walk(body).replace(/\n{3,}/g, "\n\n").trim();
};
