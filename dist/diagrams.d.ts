/**
 * Forest Diagram Theme Generators (Mermaid & D2)
 *
 * Converts Forest OKLCH color tokens into Hex colors and produces theme
 * configurations for Mermaid.js and D2 diagram engines.
 */
export interface ForestThemeColors {
    paper: string;
    paperRaised: string;
    accent: string;
    accentInk: string;
    ink1: string;
    ink2: string;
    ink3: string;
    ink4: string;
    ink5: string;
    canvas: string;
    panel: string;
    raised: string;
    spine: string;
    text1: string;
    text2: string;
    text3: string;
    textInverse: string;
    lineSoft: string;
    lineMid: string;
    lineStrong: string;
    danger: string;
    success: string;
    warning: string;
}
export interface MermaidThemeOptions {
    hue?: number;
    darkMode?: boolean;
    fontFamily?: string;
    fontSize?: string;
}
export interface D2ThemeOptions {
    hue?: number;
    darkMode?: boolean;
    fontFamily?: string;
}
/**
 * Converts an OKLCH color (lightness 0..1 or 0..100%, chroma 0..0.4, hue 0..360) to a Hex string.
 */
export declare function oklchToHex(l: number, c: number, h: number): string;
/**
 * Calculates the full palette of Hex colors for Forest tokens given a hue and mode.
 */
export declare function getForestThemeColors(hue?: number, darkMode?: boolean): ForestThemeColors;
/**
 * Generates Mermaid theme configuration for Forest.
 */
export declare function getForestMermaidTheme(options?: MermaidThemeOptions): {
    themeVariables: Record<string, string | boolean>;
    classDefs: string;
    colors: ForestThemeColors;
    getInitHeader: () => string;
};
/**
 * Generates D2 theme configuration for Forest.
 */
export declare function getForestD2Theme(options?: D2ThemeOptions): {
    colors: ForestThemeColors;
    d2Vars: string;
    d2Css: string;
    d2Classes: string;
};
