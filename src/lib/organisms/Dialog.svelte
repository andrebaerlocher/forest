<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import Slip from '../molecules/Slip.svelte';

  interface Props {
    open: boolean;
    title?: string;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    title = '',
    class: className = '',
    onclose,
    children,
    footer
  }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

{#if open}
  <!-- Scrim overlay -->
  <div
    class="dialog-scrim"
    onclick={onclose}
    transition:fade={{ duration: 150 }}
    role="presentation"
  ></div>

  <!-- Dialog box -->
  <div
    class="dialog-wrapper"
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label={title || 'Confirm dialog'}
  >
    <div transition:scale={{ start: 0.96, duration: 180 }} class="dialog-scale-container">
      <Slip class="dialog-slip {className}">
        {#if title}
          <h3 class="dialog-title">{title}</h3>
        {/if}
        <div class="dialog-body">
          {#if children}
            {@render children()}
          {/if}
        </div>
        {#if footer}
          <div class="dialog-footer">
            {@render footer()}
          </div>
        {/if}
      </Slip>
    </div>
  </div>
{/if}

<style>
  .dialog-scrim {
    position: fixed;
    inset: 0;
    background: oklch(19% 0.05 var(--hue) / 40%);
    z-index: calc(var(--z-drawer) - 1);
  }

  .dialog-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-drawer);
    padding: 24px;
    pointer-events: none;
  }

  .dialog-scale-container {
    pointer-events: auto;
    width: 100%;
    max-width: 400px;
  }

  :global(.dialog-slip) {
    background: var(--canvas) !important;
    box-shadow: var(--shadow-drag) !important; /* Dialog gets shadow since it is transient entering */
    display: flex;
    flex-direction: column;
    padding: 24px !important;
    max-width: 100% !important;
    width: 100%;
  }

  .dialog-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-1);
    margin: 0 0 12px;
    letter-spacing: 0.02em;
  }

  .dialog-body {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
