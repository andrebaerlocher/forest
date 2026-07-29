import { MQ } from "./breakpoints.js";

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
export function mediaQuery(query: string) {
  let matches = $state(false);

  $effect(() => {
    const mq = window.matchMedia(query);
    const sync = () => {
      matches = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  });

  return {
    get current() {
      return matches;
    },
  };
}

/** True below the structural breakpoint. Desktop-first: false during SSR. */
export const isPhone = () => mediaQuery(MQ.shell);

/** True on finger/stylus input. */
export const isCoarsePointer = () => mediaQuery(MQ.coarse);
