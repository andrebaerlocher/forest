/**
 * The breakpoint scale, for JavaScript.
 *
 * This is a hand-kept copy of the values documented in
 * src/lib/styles/forest.css. That comment block is the source of truth;
 * CSS custom properties cannot drive media queries, so there is no way to
 * derive one from the other. Change both or neither.
 */
export declare const BP: {
    /** A field's label stops sitting beside its control. */
    readonly field: 600;
    /** The structural line: nav restructures, nothing is side by side. */
    readonly shell: 760;
    /** A secondary pane beside a primary one collapses. */
    readonly split: 1100;
    /** Reserved. No consumer yet. */
    readonly wide: 1440;
};
/** Media query strings matching the CSS literals exactly. */
export declare const MQ: {
    /** Below the structural line: phone shell. */
    readonly shell: "(max-width: 760px)";
    /** At or above it: desktop shell. Exact complement of MQ.shell. */
    readonly shellUp: `(min-width: ${number}px)`;
    /** Below the split line: a secondary pane cannot sit beside a primary one. */
    readonly split: "(max-width: 1100px)";
    /** At or above it: two panes fit. Exact complement of MQ.split. */
    readonly splitUp: `(min-width: ${number}px)`;
    /** Finger, stylus or other imprecise pointer. */
    readonly coarse: "(pointer: coarse)";
};
