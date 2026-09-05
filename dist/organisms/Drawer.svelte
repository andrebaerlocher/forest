<script lang="ts">
  import { type Snippet, tick } from 'svelte';
  import { focusTrap } from '../actions/focusTrap.js';
  import { portal } from '../actions/portal.js';
  import PaperTexture from '../atoms/PaperTexture.svelte';
  import Scrim from '../atoms/Scrim.svelte';

  interface Props {
    open: boolean;
    /**
     * Which edge the drawer is anchored to. `bottom` is the thumb-reachable
     * sheet: on a phone the top of the screen is the farthest point from the
     * hand, so a tall list of destinations belongs at the bottom.
     */
    side?: 'left' | 'right' | 'bottom';
    /** Any CSS length. Side drawers only. */
    width?: string;
    /** Any CSS length. Bottom sheets only — capped so the page stays visible. */
    height?: string;
    /** Accessible name. role="dialog" + aria-modal requires one. */
    label?: string;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    open = false,
    side = 'right',
    width = '320px',
    height = 'min(70dvh, 560px)',
    label = 'Drawer',
    class: className = '',
    onclose,
    children
  }: Props = $props();

  /*
   * WHY THIS IS CSS AND NOT `transition:fly`.
   *
   * The panel is portalled to <body> (see below), and the action does that by
   * detaching and re-inserting the node while Svelte is still setting up the
   * intro. The scheduled transition is dropped on the way, so nothing ever
   * animated: measured with `getAnimations()`, the panel and the scrim both
   * reported zero while a Disclosure on the same page reported one.
   *
   * The outro had a second, independent problem: every call site gates the
   * component with `{#if}`, so it was destroyed before an outro could play.
   * Owning `mounted` here is what buys an exit animation at all.
   *
   * The CSS is also the more correct home for it. forest.css:337-342 collapses
   * `transition-duration` and `animation-duration` under
   * `prefers-reduced-motion: reduce` — a rule that governs CSS and cannot
   * reach a JavaScript transition. This drawer now honours it for free.
   */

  /** Keeps the node in the DOM long enough to animate out. */
  let mounted = $state(false);
  /** Drives the CSS end state. Separate from `mounted` so the closed transform
   *  is committed for one frame before we flip — set both together and the
   *  browser coalesces the styles and there is nothing to interpolate. */
  let shown = $state(false);

  const EXIT_MS = 320; // keep in step with --t-slow below

  let panelEl = $state<HTMLElement>();

  $effect(() => {
    if (open) {
      mounted = true;
      // tick(), not requestAnimationFrame: rAF does not fire in a hidden or
      // backgrounded tab, which would leave the drawer parked off-screen with
      // the scrim already up. A microtask plus one forced reflow commits the
      // closed transform just as reliably and does not depend on the page
      // being painted.
      tick().then(() => {
        if (!open || !panelEl) return;
        void panelEl.offsetHeight;
        shown = true;
      });
      return;
    }

    shown = false;
    const t = setTimeout(() => (mounted = false), EXIT_MS);
    return () => clearTimeout(t);
  });

  // A drawer covering a phone screen must not let the page behind it scroll.
  // Client-only: $effect never runs during SSR.
  $effect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

{#if mounted}
  <!-- Portalled to <body>, and it is not optional. A Drawer mounted inside
       Shell's .main sits in the stacking context that `container-type`
       establishes there, so --z-drawer (40) loses to the Spine bar's
       --z-sticky (10) — a bigger number cannot win across contexts. Moving
       the node out is the only fix. See actions/portal.ts. -->
  <div class="drawer-portal" use:portal>
    <Scrim level="drawer" onclick={onclose} />

    <!-- The seam is always on the inboard edge: a right drawer waves on its
         left, a left drawer waves on its right (the same geometry the desktop
         spine uses, so the two read as one family). -->
    <div
      class="drawer-panel side-{side} {className}"
      class:shown
      bind:this={panelEl}
      style="--drawer-w: {width}; --drawer-h: {height};"
      use:focusTrap
      tabindex="-1"
      onkeydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <PaperTexture class="drawer-paper">
        <div class="drawer-content">
          {#if onclose}
            <button type="button" class="close-btn hit-44" onclick={onclose} aria-label="Close drawer">
              <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          {/if}
          <div class="drawer-body">
            {#if children}
              {@render children()}
            {/if}
          </div>
        </div>
      </PaperTexture>
    </div>
  </div>
{/if}

<style>
  /* A move-only wrapper: it exists to be portalled, not to lay anything out. */
  .drawer-portal {
    display: contents;
  }

  /* The scrim is left to its own `transition:fade`. An opacity transition
     driven from here as well put two mechanisms on one property, and a
     running transition outranks a specified value in the cascade, so the two
     fought over it. One owner is enough. */

  /* Each side rests off its own edge and slides home. Written per side rather
     than with one shared `translate` so the sheet cannot be dragged sideways
     by a stray rule. */
  .drawer-panel.side-bottom {
    transform: translateY(100%);
  }

  .drawer-panel.side-left {
    transform: translateX(-100%);
  }

  .drawer-panel.side-right {
    transform: translateX(100%);
  }

  /* Two classes deep so it outranks the per-side rules above without !important. */
  .drawer-panel.side-bottom.shown,
  .drawer-panel.side-left.shown,
  .drawer-panel.side-right.shown {
    transform: none;
  }

  .drawer-panel {
    position: fixed;
    transition: transform var(--t-slow) var(--ease);
    top: 0;
    bottom: 0;
    width: var(--drawer-w, 320px);
    z-index: var(--z-drawer);
    display: flex;
    /* a transient surface while entering — the sanctioned second use of shadow */
    box-shadow: var(--shadow-drag);
    box-sizing: border-box;
  }

  .drawer-panel.side-right {
    right: 0;
    left: auto;

    -webkit-mask-image: linear-gradient(to left, black 0%, black 100%), var(--wave-mask-v-flipped);
    -webkit-mask-size: calc(100% - 22px) 100%, 22px 100%;
    -webkit-mask-position: right top, left top;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-image: linear-gradient(to left, black 0%, black 100%), var(--wave-mask-v-flipped);
    mask-size: calc(100% - 22px) 100%, 22px 100%;
    mask-position: right top, left top;
    mask-repeat: no-repeat, no-repeat;
  }

  /* The sheet spans the full width and rises from the floor. Its seam is on
     the top edge — the only inboard edge a bottom-anchored surface has — so
     the same one-wave-per-surface rule the spine follows still holds.

     It deliberately covers the phone bottom bar rather than clearing it: a
     modal sheet with a scrim owns the screen while it is open, and making it
     clear the bar would mean the sheet had to know a bar existed, which it
     cannot. That covering only works because the whole drawer is portalled
     out of .main's stacking context — --z-drawer beating --z-sticky is
     necessary but, on its own, was not sufficient. */
  .drawer-panel.side-bottom {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    height: var(--drawer-h, min(70dvh, 560px));

    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 100%),
      var(--wave-mask-h-flipped);
    -webkit-mask-size: 100% calc(100% - 22px), 100% 22px;
    -webkit-mask-position: left bottom, left top;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-image: linear-gradient(to bottom, black 0%, black 100%), var(--wave-mask-h-flipped);
    mask-size: 100% calc(100% - 22px), 100% 22px;
    mask-position: left bottom, left top;
    mask-repeat: no-repeat, no-repeat;
  }

  .drawer-panel.side-left {
    left: 0;
    right: auto;

    -webkit-mask-image: linear-gradient(to right, black 0%, black 100%), var(--wave-mask-v);
    -webkit-mask-size: calc(100% - 22px) 100%, 22px 100%;
    -webkit-mask-position: left top, right top;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-image: linear-gradient(to right, black 0%, black 100%), var(--wave-mask-v);
    mask-size: calc(100% - 22px) 100%, 22px 100%;
    mask-position: left top, right top;
    mask-repeat: no-repeat, no-repeat;
  }

  :global(.drawer-paper) {
    flex: 1;
    height: 100%;
    border-radius: 0;
  }

  /* the 22px the mask eats is compensated by padding on the seam side */
  .drawer-panel.side-right :global(.drawer-paper) {
    border-left: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    padding: 24px 24px 24px 34px !important;
  }

  .drawer-panel.side-left :global(.drawer-paper) {
    border-right: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    padding: 24px 34px 24px 24px !important;
  }

  /* Top padding clears the wave; bottom padding clears the home indicator,
     so the last item in a sheet is never under the gesture bar. */
  .drawer-panel.side-bottom :global(.drawer-paper) {
    border-top: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    padding: 34px 24px calc(24px + env(safe-area-inset-bottom, 0px)) !important;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* colour comes from .on-ink on PaperTexture — no hand-patch needed */
  }

  .close-btn {
    align-self: flex-end;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--t-fast) var(--ease);
    margin-bottom: 16px;
  }

  /* Gated: on touch the hover colour sticks after the tap and reads as a
     disabled or selected state on a control that is neither. */
  @media (hover: hover) {
    .close-btn:hover {
      color: var(--text-1);
    }
  }

  .close-btn svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .drawer-body {
    flex: 1;
    /* a column so content can push a footer down with margin-top: auto */
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .drawer-body::-webkit-scrollbar {
    width: 6px;
  }

  .drawer-body::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 3px;
  }
</style>
