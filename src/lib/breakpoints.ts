/**
 * The breakpoint scale, for JavaScript.
 *
 * This is a hand-kept copy of the values documented in
 * src/lib/styles/forest.css. That comment block is the source of truth;
 * CSS custom properties cannot drive media queries, so there is no way to
 * derive one from the other. Change both or neither.
 */
export const BP = {
  /** A field's label stops sitting beside its control. */
  field: 600,
  /** The structural line: nav restructures, nothing is side by side. */
  shell: 760,
  /** A secondary pane beside a primary one collapses. */
  split: 1100,
  /** Reserved. No consumer yet. */
  wide: 1440,
} as const;

/** Media query strings matching the CSS literals exactly. */
export const MQ = {
  /** Below the structural line: phone shell. */
  shell: `(max-width: ${BP.shell}px)`,
  /** At or above it: desktop shell. Exact complement of MQ.shell. */
  shellUp: `(min-width: ${BP.shell + 1}px)`,
  /** Below the split line: a secondary pane cannot sit beside a primary one. */
  split: `(max-width: ${BP.split}px)`,
  /** At or above it: two panes fit. Exact complement of MQ.split. */
  splitUp: `(min-width: ${BP.split + 1}px)`,
  /** Finger, stylus or other imprecise pointer. */
  coarse: "(pointer: coarse)",
} as const;
