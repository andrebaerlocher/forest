/**
 * Move a node to the end of <body> for as long as it lives.
 *
 * WHY THIS HAS TO EXIST — the failure it fixes is invisible in the CSS.
 *
 * Shell's `.main` carries `container-type: inline-size` so descendants like
 * CaseStudyShell can query their own available width. Establishing a query
 * container also establishes a STACKING CONTEXT. Once that happens, a
 * descendant's z-index is resolved *inside* `.main` and can never rise above
 * a sibling of `.main` — no matter how large the number is.
 *
 * That is precisely the case for an overlay: the Drawer asks for
 * `--z-drawer` (40) and the Spine bottom bar asks for `--z-sticky` (10), and
 * the Spine still paints on top, because the Drawer's 40 only ranks it among
 * `.main`'s children while the Spine ranks among `.shell`'s. Measured:
 * `elementFromPoint()` over an open sheet returned `.rail-column`, not the
 * sheet. Raising the z-index cannot fix this; leaving the stacking context
 * is the only fix.
 *
 * Svelte keeps its own reference to the node, so it still unmounts and still
 * runs transitions normally after the move.
 */
export declare function portal(node: HTMLElement, target?: HTMLElement | string): {
    destroy(): void;
};
