/**
 * Reactive media query, hydration-safe.
 *
 * Returns `false` on the server AND on the first client render, so the
 * hydrated tree matches the SSR'd tree exactly. It flips on the first effect
 * tick.
 *
 * THE RULE THIS IMPLIES: CSS must already handle anything that would be
 * visibly wrong during that one frame. JavaScript is only allowed to decide
 * DOM *identity* — which copy of some content exists — never appearance.
 * If you add a JS-driven `class:` that CSS doesn't already cover, the
 * hydration flash comes back.
 *
 * Must be called during component initialisation.
 */
export declare function mediaQuery(query: string): {
    readonly current: boolean;
};
/** True below the structural breakpoint. Desktop-first: false during SSR. */
export declare const isPhone: () => {
    readonly current: boolean;
};
/** True on finger/stylus input. */
export declare const isCoarsePointer: () => {
    readonly current: boolean;
};
