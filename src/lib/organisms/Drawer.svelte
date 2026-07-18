<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import PaperTexture from '../atoms/PaperTexture.svelte';

  interface Props {
    open: boolean;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
  }

  let { open = false, class: className = '', onclose, children }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

{#if open}
  <!-- Scrim overlay -->
  <div
    class="drawer-scrim"
    onclick={onclose}
    transition:fade={{ duration: 150 }}
    role="presentation"
  ></div>

  <!-- Drawer panel (slides from right, has left wave seam) -->
  <div
    class="drawer-panel {className}"
    transition:fly={{ x: 300, duration: 250 }}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
  >
    <PaperTexture class="drawer-paper">
      <div class="drawer-content">
        {#if onclose}
          <button type="button" class="close-btn" onclick={onclose} aria-label="Close drawer">
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
  .drawer-scrim {
    position: fixed;
    inset: 0;
    background: oklch(19% 0.05 var(--hue) / 40%);
    z-index: calc(var(--z-drawer) - 1);
  }

  .drawer-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 320px;
    z-index: var(--z-drawer);
    display: flex;
    box-shadow: var(--shadow-drag); /* Drawer gets shadow since it is transient entering */
    box-sizing: border-box;

    -webkit-mask-image: linear-gradient(to left, black 0%, black 100%), var(--wave-mask-v-flipped);
    -webkit-mask-size: calc(100% - 22px) 100%, 22px 100%;
    -webkit-mask-position: right top, left top;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-image: linear-gradient(to left, black 0%, black 100%), var(--wave-mask-v-flipped);
    mask-size: calc(100% - 22px) 100%, 22px 100%;
    mask-position: right top, left top;
    mask-repeat: no-repeat, no-repeat;
  }

  :global(.drawer-paper) {
    flex: 1;
    height: 100%;
    border-left: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    border-radius: 0;
    padding: 24px 24px 24px 34px !important; /* increased left padding by 22px for mask */
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #f4f0e6;
  }

  .close-btn {
    align-self: flex-end;
    background: transparent;
    border: none;
    cursor: pointer;
    color: oklch(94.5% 0.012 95 / 60%);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--t-fast) var(--ease);
    margin-bottom: 16px;
  }

  .close-btn:hover {
    color: #f4f0e6;
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
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: oklch(94.5% 0.012 95 / 25%) transparent;
  }

  .drawer-body::-webkit-scrollbar {
    width: 6px;
  }

  .drawer-body::-webkit-scrollbar-thumb {
    background: oklch(94.5% 0.012 95 / 25%);
    border-radius: 3px;
  }
</style>
