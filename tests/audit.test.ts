import { describe, it, expect } from "vitest";
import { parseHtml } from "@/lib/audit";

describe("parseHtml", () => {
  it("extracts title, meta, h1 count, missing alt, and word count on a normal page", () => {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="A test description" />
        </head>
        <body>
          <h1>First heading</h1>
          <h1>Second heading</h1>
          <p>Hello world from Page Pulse.</p>
          <img src="/one.png" alt="First image" />
          <img src="/two.png" />
          <img src="/three.png" alt="" />
        </body>
      </html>
    `;

    const result = parseHtml(html);

    expect(result.title).toBe("Test Page");
    expect(result.metaDescription).toBe("A test description");
    expect(result.h1Count).toBe(2);
    expect(result.imagesMissingAlt).toBe(2);
    expect(result.wordCount).toBeGreaterThan(0);
  });

  it("returns safe defaults for empty HTML without crashing", () => {
    const html = "<html><head></head><body></body></html>";

    const result = parseHtml(html);

    expect(result.title).toBe("");
    expect(result.metaDescription).toBe("");
    expect(result.h1Count).toBe(0);
    expect(result.imagesMissingAlt).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  it("does not crash on broken or unclosed markup", () => {
    const html =
      "<html><head><title>Broken<body><h1>Oops<p>no closing tags<img src=x.png>";

    expect(() => parseHtml(html)).not.toThrow();

    const result = parseHtml(html);
    expect(typeof result.wordCount).toBe("number");
    expect(result.imagesMissingAlt).toBeGreaterThanOrEqual(0);
  });
});