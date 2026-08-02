<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import Kbd from '../atoms/Kbd.svelte';

  interface Props extends HTMLButtonAttributes {
    onclick?: (event: MouseEvent) => void;
    class?: string;
  }

  let { onclick, class: className = '', ...restProps }: Props = $props();
</script>

<button
  type="button"
  class="palette-indicator {className}"
  {onclick}
  {...restProps}
>
  <div class="left-section">
    <svg viewBox="0 0 24 24" class="search-icon" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
    <span class="label">Command palette</span>
  </div>
  <Kbd>⌘K</Kbd>
</button>

<style>
  .palette-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: oklch(94.5% 0.012 95 / 8%);
    border: 1px solid oklch(94.5% 0.012 95 / 25%);
    border-radius: var(--radius-round);
    padding: 6px 14px;
    height: 32px;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
    min-width: 170px;
  }

  /* When inside dark mode, adjust borders */
  [data-mode="dark"] .palette-indicator {
    border-color: oklch(94.5% 0.012 95 / 15%);
  }

  .palette-indicator:hover {
    background: oklch(94.5% 0.012 95 / 14%);
    color: var(--text-1);
  }

  .palette-indicator:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-icon {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .label {
    letter-spacing: 0.02em;
  }
</style>
