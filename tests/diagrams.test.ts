import { describe, expect, it } from "vitest";
import {
  getForestD2Theme,
  getForestMermaidTheme,
  getForestThemeColors,
  oklchToHex,
} from "$lib/diagrams.js";

describe("oklchToHex", () => {
  it("converts paper lightness OKLCH to expected hex", () => {
    const hex = oklchToHex(0.965, 0.012, 95);
    expect(hex).toBe("#f6f4eb");
  });

  it("converts accent OKLCH to expected hex", () => {
    const hex = oklchToHex(0.735, 0.058, 70);
    expect(hex).toBe("#c1a382");
  });

  it("converts ink-3 with hue 222 to expected hex", () => {
    const hex = oklchToHex(0.29, 0.055, 222);
    expect(hex).toBe("#00313f");
  });
});

describe("getForestThemeColors", () => {
  it("generates correct light mode colors for hue 222", () => {
    const colors = getForestThemeColors(222, false);
    expect(colors.canvas).toBe("#f6f4eb");
    expect(colors.panel).toBe("#00313f");
    expect(colors.accent).toBe("#c1a382");
    expect(colors.text1).toBe("#00313f");
  });

  it("generates correct dark mode colors for hue 222", () => {
    const colors = getForestThemeColors(222, true);
    expect(colors.canvas).toBe("#04232d");
    expect(colors.panel).toBe("#04181f");
    expect(colors.text1).toBe("#efede4");
  });
});

describe("getForestMermaidTheme", () => {
  it("produces valid theme variables and init header", () => {
    const theme = getForestMermaidTheme({ hue: 222, darkMode: false });
    expect(theme.themeVariables.background).toBe("#f6f4eb");
    expect(theme.themeVariables.primaryColor).toBe("#edeadc");
    expect(theme.classDefs).toContain("classDef paper");
    expect(theme.classDefs).toContain("classDef ink");

    const initHeader = theme.getInitHeader();
    expect(initHeader).toContain("%%{");
    expect(initHeader).toContain("'theme': 'base'");
    expect(initHeader).toContain("#f6f4eb");
  });
});

describe("getForestD2Theme", () => {
  it("produces valid D2 vars, css, and classes", () => {
    const d2Theme = getForestD2Theme({ hue: 222, darkMode: false });
    expect(d2Theme.d2Vars).toContain('forest-canvas: "#f6f4eb"');
    expect(d2Theme.d2Css).toContain("background-color: #f6f4eb;");
    expect(d2Theme.d2Classes).toContain("paper: {");
    expect(d2Theme.d2Classes).toContain('fill: "#edeadc"');
  });
});
