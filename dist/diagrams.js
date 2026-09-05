/**
 * Forest Diagram Theme Generators (Mermaid & D2)
 *
 * Converts Forest OKLCH color tokens into Hex colors and produces theme
 * configurations for Mermaid.js and D2 diagram engines.
 */
/**
 * Converts an OKLCH color (lightness 0..1 or 0..100%, chroma 0..0.4, hue 0..360) to a Hex string.
 */
export function oklchToHex(l, c, h) {
    // Normalize L if passed as percentage > 1
    const normL = l > 1 ? l / 100 : l;
    const hRad = (h * Math.PI) / 180;
    const aLab = c * Math.cos(hRad);
    const bLab = c * Math.sin(hRad);
    // OKLab to LMS linear
    const l_ = normL + 0.3963377774 * aLab + 0.2158037573 * bLab;
    const m_ = normL - 0.1055613458 * aLab - 0.0638541728 * bLab;
    const s_ = normL - 0.0894841775 * aLab - 1.291485548 * bLab;
    // Cubing
    const l3 = l_ ** 3;
    const m3 = m_ ** 3;
    const s3 = s_ ** 3;
    // LMS to linear RGB
    const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
    const toSrgb = (val) => {
        const clamped = Math.max(0, Math.min(1, val));
        return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    };
    const r = Math.round(toSrgb(rLin) * 255);
    const g = Math.round(toSrgb(gLin) * 255);
    const b = Math.round(toSrgb(bLin) * 255);
    const toHex = (n) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
/**
 * Calculates the full palette of Hex colors for Forest tokens given a hue and mode.
 */
export function getForestThemeColors(hue = 282, darkMode = false) {
    // Fixed paper and accent materials
    const paper = oklchToHex(0.965, 0.012, 95);
    const paperRaised = oklchToHex(0.935, 0.018, 95);
    const accent = oklchToHex(0.735, 0.058, 70);
    const accentInk = oklchToHex(0.58, 0.07, 70);
    const textInverse = oklchToHex(0.945, 0.012, 95);
    // Hue ink ladder
    const ink1 = oklchToHex(0.19, 0.045, hue);
    const ink2 = oklchToHex(0.24, 0.05, hue);
    const ink3 = oklchToHex(0.29, 0.055, hue);
    const ink4 = oklchToHex(0.33, 0.055, hue);
    const ink5 = oklchToHex(0.38, 0.05, hue);
    if (!darkMode) {
        return {
            paper,
            paperRaised,
            accent,
            accentInk,
            ink1,
            ink2,
            ink3,
            ink4,
            ink5,
            canvas: paper,
            panel: ink3,
            raised: paperRaised,
            spine: ink2,
            text1: ink3,
            text2: oklchToHex(0.38, 0.02, 100),
            text3: oklchToHex(0.6, 0.025, 100),
            textInverse,
            lineSoft: oklchToHex(0.915, 0.02, 95),
            lineMid: oklchToHex(0.895, 0.02, 95),
            lineStrong: ink3,
            danger: oklchToHex(0.52, 0.11, 35),
            success: oklchToHex(0.5, 0.085, 150),
            warning: oklchToHex(0.53, 0.095, 75),
        };
    }
    return {
        paper,
        paperRaised,
        accent,
        accentInk: accent,
        ink1,
        ink2,
        ink3,
        ink4,
        ink5,
        canvas: oklchToHex(0.24, 0.04, hue),
        panel: oklchToHex(0.195, 0.03, hue),
        raised: oklchToHex(0.28, 0.045, hue),
        spine: oklchToHex(0.15, 0.025, hue),
        text1: textInverse,
        text2: oklchToHex(0.87, 0.02, hue),
        text3: oklchToHex(0.6, 0.035, hue),
        textInverse,
        lineSoft: oklchToHex(0.29, 0.05, hue),
        lineMid: oklchToHex(0.31, 0.05, hue),
        lineStrong: oklchToHex(0.805, 0.02, 96),
        danger: oklchToHex(0.7, 0.11, 35),
        success: oklchToHex(0.72, 0.085, 150),
        warning: oklchToHex(0.74, 0.095, 75),
    };
}
/**
 * Generates Mermaid theme configuration for Forest.
 */
export function getForestMermaidTheme(options = {}) {
    const { hue = 282, darkMode = false, fontFamily = '"Illinois Mono", "Lexend", ui-monospace, monospace', fontSize = "13px", } = options;
    const colors = getForestThemeColors(hue, darkMode);
    const themeVariables = {
        fontFamily,
        fontSize,
        darkMode,
        background: colors.canvas,
        mainBkg: colors.raised,
        nodeBorder: colors.lineStrong,
        primaryColor: colors.raised,
        primaryTextColor: colors.text1,
        primaryBorderColor: colors.lineStrong,
        lineColor: colors.lineStrong,
        secondaryColor: colors.panel,
        secondaryTextColor: colors.textInverse,
        secondaryBorderColor: colors.accent,
        tertiaryColor: colors.accent,
        tertiaryTextColor: colors.ink1,
        tertiaryBorderColor: colors.accentInk,
        clusterBkg: colors.panel,
        clusterBorder: colors.lineMid,
        defaultLinkColor: colors.lineStrong,
        titleColor: colors.text1,
        edgeLabelBackground: colors.canvas,
        actorBkg: colors.panel,
        actorTextColor: colors.textInverse,
        actorLineColor: colors.lineStrong,
        signalColor: colors.lineStrong,
        labelBoxBkgColor: colors.raised,
        labelBoxBorderColor: colors.accent,
        labelTextColor: colors.text1,
    };
    const classDefs = `
classDef paper fill:${colors.paperRaised},stroke:${colors.lineStrong},stroke-width:1.5px,color:${colors.text1},rx:6px,ry:6px;
classDef ink fill:${colors.panel},stroke:${colors.accent},stroke-width:1.5px,color:${colors.textInverse},rx:6px,ry:6px;
classDef accent fill:${colors.accent},stroke:${colors.accentInk},stroke-width:1.5px,color:${colors.ink1},rx:6px,ry:6px;
classDef storage fill:${colors.paperRaised},stroke:${colors.lineStrong},stroke-width:2px,stroke-dasharray: 4 2,color:${colors.text1},rx:6px,ry:6px;
classDef statusOk fill:${colors.paperRaised},stroke:${colors.success},stroke-width:2px,color:${colors.success},rx:6px,ry:6px;
classDef statusWarn fill:${colors.paperRaised},stroke:${colors.warning},stroke-width:2px,color:${colors.warning},rx:6px,ry:6px;
classDef statusErr fill:${colors.paperRaised},stroke:${colors.danger},stroke-width:2px,color:${colors.danger},rx:6px,ry:6px;
`.trim();
    const getInitHeader = () => `%%{\n  init: {\n    'theme': 'base',\n    'themeVariables': ${JSON.stringify(themeVariables, null, 6).replace(/\n/g, "\n    ")}\n  }\n}%%`;
    return {
        themeVariables,
        classDefs,
        colors,
        getInitHeader,
    };
}
/**
 * Generates D2 theme configuration for Forest.
 */
export function getForestD2Theme(options = {}) {
    const { hue = 282, darkMode = false, fontFamily = '"Illinois Mono", monospace' } = options;
    const colors = getForestThemeColors(hue, darkMode);
    const d2Vars = `
vars: {
  d2-config: {
    pad: 20
  }
  forest-font: "${fontFamily}"
  forest-canvas: "${colors.canvas}"
  forest-panel: "${colors.panel}"
  forest-raised: "${colors.raised}"
  forest-accent: "${colors.accent}"
  forest-text-1: "${colors.text1}"
  forest-text-inverse: "${colors.textInverse}"
  forest-line-strong: "${colors.lineStrong}"
  forest-success: "${colors.success}"
  forest-warning: "${colors.warning}"
  forest-danger: "${colors.danger}"
}
`.trim();
    const d2Css = `
svg {
  background-color: ${colors.canvas};
  font-family: ${fontFamily};
}
.d2-node {
  stroke-width: 1.5px;
  rx: 6px;
  ry: 6px;
}
.d2-connection {
  stroke: ${colors.lineStrong};
  stroke-width: 1.5px;
}
.d2-text {
  fill: ${colors.text1};
  font-family: ${fontFamily};
}
`.trim();
    const d2Classes = `
classes: {
  paper: {
    style: {
      fill: "${colors.paperRaised}"
      stroke: "${colors.lineStrong}"
      stroke-width: 1.5
      font-color: "${colors.text1}"
      border-radius: 6
    }
  }
  ink: {
    style: {
      fill: "${colors.panel}"
      stroke: "${colors.accent}"
      stroke-width: 1.5
      font-color: "${colors.textInverse}"
      border-radius: 6
    }
  }
  accent: {
    style: {
      fill: "${colors.accent}"
      stroke: "${colors.accentInk}"
      stroke-width: 1.5
      font-color: "${colors.ink1}"
      border-radius: 6
    }
  }
  storage: {
    style: {
      fill: "${colors.paperRaised}"
      stroke: "${colors.lineStrong}"
      stroke-width: 2
      stroke-dash: 4
      font-color: "${colors.text1}"
      border-radius: 6
    }
  }
  status-ok: {
    style: {
      fill: "${colors.paperRaised}"
      stroke: "${colors.success}"
      stroke-width: 2
      font-color: "${colors.success}"
      border-radius: 6
    }
  }
}
`.trim();
    return {
        colors,
        d2Vars,
        d2Css,
        d2Classes,
    };
}
