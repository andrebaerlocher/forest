<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    mode?: 'light' | 'dark';
  }

  let { mode = $bindable('light'), ...restProps }: Props = $props();

  function toggleMode() {
    mode = mode === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mode', mode);
    }
  }

  $effect(() => {
    const current = document.documentElement.getAttribute('data-mode') || 'light';
    mode = current as 'light' | 'dark';
  });
</script>

<button
  class="mode-toggle"
  onclick={toggleMode}
  aria-pressed={mode === 'dark'}
  {...restProps}
>
  <span class="seal" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M3 17l5-8 4 6 3-4 6 6"/></svg>
  </span>
  <span>{mode === 'dark' ? 'Close the lid' : 'Open the box'}</span>
</button>

<style>
  .mode-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    background: oklch(94.5% 0.012 95 / 8%);
    border: 1px solid oklch(94.5% 0.012 95 / 25%);
    border-radius: var(--radius-round);
    padding: 8px 16px;
    cursor: pointer;
    color: var(--text-inverse);
    font-family: var(--font-body);
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .mode-toggle:hover {
    background: oklch(94.5% 0.012 95 / 14%);
  }

  .mode-toggle:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .seal {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .seal svg {
    width: 13px;
    height: 13px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
