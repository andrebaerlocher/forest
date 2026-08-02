<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import Dialog from './Dialog.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    id: string;
    caption: string;
    /** Rendered as "Fig. N". */
    number?: string | number;
    /** Diagram is wider than the reading column — lets oversized content scroll rather than squash. */
    wide?: boolean;
    /** Defaults to `wide`. An explicit `zoomable={false}` still wins over `wide`. */
    zoomable?: boolean;
    class?: string;
    /** The diagram markup. Rendered once in the frame, and again (same snippet) inside the zoom dialog. */
    children?: Snippet;
  }

  let {
    id,
    caption,
    number,
    wide = false,
    zoomable,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  // Nullish coalescing, not `||` — an explicit `zoomable={false}` must win over `wide`.
  let resolvedZoomable = $derived(zoomable ?? wide);

  let dialogOpen = $state(false);
</script>

<figure {id} class="cs-figure {className}" {...restProps}>
  <div class="cs-figure-frame-wrap" class:wide>
    <!-- The scroll container itself, so the expand button (a sibling below,
         positioned against this wrapper) never scrolls away with the content. -->
    <!-- A region that scrolls must be reachable by keyboard, or a diagram
         wider than the column is simply unreadable without a mouse. The lint
         rule assumes tabindex here is an oversight; WCAG 2.1.1 requires it. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
      class="cs-figure-frame"
      tabindex="0"
      role="group"
      aria-label={number !== undefined ? `Figure ${number}: ${caption}` : caption}
    >
      <div class="cs-figure-inner">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>

    {#if resolvedZoomable}
      <button
        type="button"
        class="cs-figure-expand"
        aria-label={`Expand ${caption}`}
        onclick={() => (dialogOpen = true)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </button>
    {/if}
  </div>

  <figcaption class="cs-figure-caption">
    {#if number !== undefined}<span class="cs-figure-number">Fig. {number}</span>{/if}
    <span class="cs-figure-caption-text">{caption}</span>
  </figcaption>
</figure>

{#if resolvedZoomable}
  <!-- Dialog owns focus trapping, Escape and focus restoration on its own. The
       body scrolls (size="lg"); native scroll is also how touch panning works
       here — no custom pointer/gesture code. -->
  <Dialog open={dialogOpen} size="lg" title={caption} onclose={() => (dialogOpen = false)}>
    {#if children}
      {@render children()}
    {/if}
  </Dialog>
{/if}

<style>
  .cs-figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* Never let an oversized diagram push the page body sideways — the frame
       below is the only thing allowed to scroll horizontally. */
    max-width: 100%;
    min-width: 0;
  }

  .cs-figure-frame-wrap {
    position: relative;
    max-width: 100%;
    min-width: 0;
  }

  .cs-figure-frame {
    overflow-x: auto;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .cs-figure-frame::-webkit-scrollbar {
    height: 8px;
  }

  .cs-figure-frame::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  /* `wide` is the only thing that changes: a too-wide child scrolls inside
     the frame instead of being squashed down to the reading column's width. */
  .wide .cs-figure-inner {
    min-width: min-content;
  }

  .cs-figure-expand {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    background: var(--canvas);
    color: var(--text-2);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    cursor: pointer;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  @media (hover: hover) {
    .cs-figure-expand:hover {
      color: var(--text-1);
      border-color: var(--line-strong);
      background: var(--wash);
    }
  }

  .cs-figure-expand:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-figure-caption {
    display: flex;
    align-items: baseline;
    gap: 0.6em;
    margin: 0;
  }

  .cs-figure-number {
    flex-shrink: 0;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 12.5px;
    color: var(--accent-ink);
  }

  .cs-figure-caption-text {
    font-size: 12.5px;
    color: var(--text-2);
  }
</style>
