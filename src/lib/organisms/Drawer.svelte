<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fly } from 'svelte/transition';
  import { focusTrap } from '../actions/focusTrap.js';
  import PaperTexture from '../atoms/PaperTexture.svelte';
  import Scrim from '../atoms/Scrim.svelte';

  interface Props {
    open: boolean;
    /** Which edge the drawer is anchored to. */
    side?: 'left' | 'right';
    /** Any CSS length. */
    width?: string;
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
    label = 'Drawer',
    class: className = '',
    onclose,
    children
  }: Props = $props();

  let flyX = $derived(side === 'left' ? -300 : 300);

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

{#if open}
  <Scrim level="drawer" onclick={onclose} />

  <!-- The seam is always on the inboard edge: a right drawer waves on its
       left, a left drawer waves on its right (the same geometry the desktop
       spine uses, so the two read as one family). -->
  <div
    class="drawer-panel side-{side} {className}"
    style="--drawer-w: {width};"
    use:focusTrap
    tabindex="-1"
    transition:fly={{ x: flyX, duration: 250 }}
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
{/if}

<style>
  .drawer-panel {
    position: fixed;
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

  .close-btn:hover {
    color: var(--text-1);
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
