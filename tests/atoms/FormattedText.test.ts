import { describe, expect, it } from "vitest";
import { parseBlockMarkdown, parseInlineMarkdown } from "$lib/utils/markdown.js";

describe("parseInlineMarkdown", () => {
  it("parses plain text without tokens", () => {
    const tokens = parseInlineMarkdown("Plain text here");
    expect(tokens).toEqual([{ type: "text", content: "Plain text here" }]);
  });

  it("parses bold text correctly", () => {
    const tokens = parseInlineMarkdown("This is **bold** text");
    expect(tokens).toEqual([
      { type: "text", content: "This is " },
      { type: "strong", children: [{ type: "text", content: "bold" }] },
      { type: "text", content: " text" },
    ]);
  });

  it("parses italic text correctly", () => {
    const tokens = parseInlineMarkdown("This is *italic* text");
    expect(tokens).toEqual([
      { type: "text", content: "This is " },
      { type: "em", children: [{ type: "text", content: "italic" }] },
      { type: "text", content: " text" },
    ]);
  });

  it("parses code tokens correctly", () => {
    const tokens = parseInlineMarkdown("Run `bun test` now");
    expect(tokens).toEqual([
      { type: "text", content: "Run " },
      { type: "code", content: "bun test" },
      { type: "text", content: " now" },
    ]);
  });

  it("parses link tokens correctly", () => {
    const tokens = parseInlineMarkdown("Visit [Forest](https://forest.dev) today");
    expect(tokens).toEqual([
      { type: "text", content: "Visit " },
      {
        type: "link",
        href: "https://forest.dev",
        children: [{ type: "text", content: "Forest" }],
      },
      { type: "text", content: " today" },
    ]);
  });

  it("parses nested markdown tokens (bold link)", () => {
    const tokens = parseInlineMarkdown("Check **[Forest](https://forest.dev)**");
    expect(tokens).toEqual([
      { type: "text", content: "Check " },
      {
        type: "strong",
        children: [
          {
            type: "link",
            href: "https://forest.dev",
            children: [{ type: "text", content: "Forest" }],
          },
        ],
      },
    ]);
  });

  it("parses math tokens correctly", () => {
    const tokens = parseInlineMarkdown("Space $2^N$ and $\\le 1000$ with $T_{1/2}$");
    expect(tokens).toEqual([
      { type: "text", content: "Space " },
      { type: "math", content: "2^N" },
      { type: "text", content: " and " },
      { type: "math", content: "\\le 1000" },
      { type: "text", content: " with " },
      { type: "math", content: "T_{1/2}" },
    ]);
  });
});

describe("parseBlockMarkdown", () => {
  it("parses paragraph with inline code and bold", () => {
    const text =
      "Der `recommendation-service` nutzt **drei nach Schwierigkeit gestaffelte Optionen**.";
    const blocks = parseBlockMarkdown(text);
    expect(blocks).toEqual([
      {
        type: "paragraph",
        children: [
          { type: "text", content: "Der " },
          { type: "code", content: "recommendation-service" },
          { type: "text", content: " nutzt " },
          {
            type: "strong",
            children: [{ type: "text", content: "drei nach Schwierigkeit gestaffelte Optionen" }],
          },
          { type: "text", content: "." },
        ],
      },
    ]);
  });

  it("parses ordered lists with inline code and bold", () => {
    const text =
      "1. **`cbkst-fringe`**: Prioritäts-Boost (+100)\n2. **`format-proficiency`**: Anpassung";
    const blocks = parseBlockMarkdown(text);
    expect(blocks).toEqual([
      {
        type: "list",
        ordered: true,
        children: [
          {
            type: "list-item",
            children: [
              {
                type: "strong",
                children: [{ type: "code", content: "cbkst-fringe" }],
              },
              { type: "text", content: ": Prioritäts-Boost (+100)" },
            ],
          },
          {
            type: "list-item",
            children: [
              {
                type: "strong",
                children: [{ type: "code", content: "format-proficiency" }],
              },
              { type: "text", content: ": Anpassung" },
            ],
          },
        ],
      },
    ]);
  });
});
