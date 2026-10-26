import { textToMessageHtml, messageHtmlToText } from "./messageText";
import { isTrustedGifUrl } from "./gifSearch";

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
  it("accepts https GIPHY media hosts only", () => {
    expect(isTrustedGifUrl("https://media2.giphy.com/media/x/giphy.gif")).toBe(
      true
    );
    expect(isTrustedGifUrl("https://i.giphy.com/x.gif")).toBe(true);
    expect(isTrustedGifUrl("http://media.giphy.com/x.gif")).toBe(false);
    expect(isTrustedGifUrl("https://evilgiphy.com/x.gif")).toBe(false);
    expect(isTrustedGifUrl("https://giphy.com.evil.io/x.gif")).toBe(false);
    expect(isTrustedGifUrl("javascript:alert(1)")).toBe(false);
    expect(isTrustedGifUrl("not a url")).toBe(false);
  });
});
