export type AnchoredPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "right";
export interface AnchoredOptions {
    /** The element the floating surface is positioned against. */
    anchor: HTMLElement | null | undefined;
    /** Default 'bottom-start'. */
    placement?: AnchoredPlacement;
    /** Gap between anchor and surface, px. Default 6. */
    offset?: number;
    /** Flip to the opposite side when there is not enough room. Default true. */
    flip?: boolean;
    /** Slide along the cross axis to stay on screen. Default true. */
    shift?: boolean;
    /** Skip all work while the surface is closed. Default true. */
    enabled?: boolean;
    /** Match the surface's min-width to the anchor's width (for select-likes). */
    matchWidth?: boolean;
}
/**
 * Positions a floating element relative to an anchor, flipping to the
 * opposite side and shifting along the cross axis to stay in the viewport.
 *
 * Uses `position: fixed` and coordinates from `getBoundingClientRect()`, so
 * the action does not care what offset parent (if any) sits between the
 * node and the document — no transformed or `position: relative` ancestor
 * can throw the math off the way it would with `position: absolute`.
 *
 * Usage: <div use:anchored={{ anchor: triggerEl, placement: 'bottom-start' }}>
 */
export declare function anchored(node: HTMLElement, options: AnchoredOptions): {
    update(next: AnchoredOptions): void;
    destroy(): void;
};
