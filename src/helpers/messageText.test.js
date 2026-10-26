import { textToMessageHtml, messageHtmlToText } from "./messageText";
import { isTrustedGifUrl, normalizeGif } from "./gifSearch";

describe("textToMessageHtml", () => {
  it("wraps text in the message markup and keeps line breaks", () => {
    expect(textToMessageHtml("hi\nthere")).toBe(
      '<div class="text-msg"><p>hi<br>there</p></div>'
    );
  });

  it("escapes HTML so typed markup is never executed", () => {
    const html = textToMessageHtml('<img src=x onerror="alert(1)">');
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});

describe("messageHtmlToText", () => {
  it("round-trips a message written by the composer", () => {
    const text = "a & b <c>\nsecond line";
    expect(messageHtmlToText(textToMessageHtml(text))).toBe(text);
  });

  it("flattens messages written by the old rich-text editor", () => {
    const old =
      '<div class="text-msg"><p><strong>Hello</strong></p><p>world</p></div>';
    expect(messageHtmlToText(old)).toBe("Hello\nworld");
  });
});

describe("isTrustedGifUrl", () => {
  it("accepts https KLIPY media hosts only", () => {
    expect(isTrustedGifUrl("https://static.klipy.com/ii/a/b/c.webp")).toBe(true);
    expect(isTrustedGifUrl("https://static2.klipy.com/x.gif")).toBe(true);
    expect(isTrustedGifUrl("http://static.klipy.com/x.gif")).toBe(false);
    expect(isTrustedGifUrl("https://evilklipy.com/x.gif")).toBe(false);
    expect(isTrustedGifUrl("https://klipy.com.evil.io/x.gif")).toBe(false);
    expect(isTrustedGifUrl("https://media.giphy.com/x.gif")).toBe(false);
    expect(isTrustedGifUrl("javascript:alert(1)")).toBe(false);
    expect(isTrustedGifUrl("not a url")).toBe(false);
  });
});

describe("normalizeGif", () => {
  const media = (url, size) => ({ url, width: size, height: size });
  const gif = {
    id: 8041071659142944,
    slug: "hello-hi-662",
    title: "Hello",
    file: {
      md: { gif: media("https://static.klipy.com/md.gif", 498), webp: media("https://static.klipy.com/md.webp", 498) },
      sm: { gif: media("https://static.klipy.com/sm.gif", 220), webp: media("https://static.klipy.com/sm.webp", 220) },
    },
  };

  it("picks a light webp preview and a bigger webp for the message", () => {
    expect(normalizeGif(gif)).toEqual({
      id: "8041071659142944",
      slug: "hello-hi-662",
      title: "Hello",
      url: "https://static.klipy.com/md.webp",
      preview: "https://static.klipy.com/sm.webp",
      width: 498,
      height: 498,
      previewWidth: 220,
      previewHeight: 220,
    });
  });

  it("falls back to gif when there is no webp, and skips empty items", () => {
    const onlyGif = {
      ...gif,
      file: { sm: { gif: media("https://static.klipy.com/sm.gif", 220) } },
    };
    expect(normalizeGif(onlyGif).url).toBe("https://static.klipy.com/sm.gif");
    expect(normalizeGif({ ...gif, file: {} })).toBeNull();
  });
});
