/**
 * Heading level context — lets nested long-form sections produce a correct
 * document outline without every author threading `level` through by hand.
 *
 * A case study's body is authored in a consuming app, so Forest cannot know
 * whether a Section sits directly under the page <h1> or three modules deep.
 * Each container provides the level its children should use; children read it
 * and may still override explicitly.
 *
 * Deliberately plain (no runes): the level is fixed for a subtree's lifetime,
 * so making it reactive would buy nothing.
 */
import { getContext, setContext } from "svelte";

const HEADING_LEVEL_KEY = Symbol("forest.heading-level");

/** Clamp to the range that maps onto a real heading element. */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export function clampHeadingLevel(level: number): HeadingLevel {
  return Math.min(6, Math.max(2, Math.round(level))) as HeadingLevel;
}

/** Declare the heading level this subtree's children should render at. */
export function provideHeadingLevel(level: number): void {
  setContext(HEADING_LEVEL_KEY, clampHeadingLevel(level));
}

/**
 * The heading level for the current subtree. Defaults to <h2>: a case study
 * page owns its <h1>, so the outermost section is a level below it.
 */
export function useHeadingLevel(fallback: HeadingLevel = 2): HeadingLevel {
  return getContext<HeadingLevel | undefined>(HEADING_LEVEL_KEY) ?? fallback;
}
