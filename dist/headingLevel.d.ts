/** Clamp to the range that maps onto a real heading element. */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;
export declare function clampHeadingLevel(level: number): HeadingLevel;
/** Declare the heading level this subtree's children should render at. */
export declare function provideHeadingLevel(level: number): void;
/**
 * The heading level for the current subtree. Defaults to <h2>: a case study
 * page owns its <h1>, so the outermost section is a level below it.
 */
export declare function useHeadingLevel(fallback?: HeadingLevel): HeadingLevel;
