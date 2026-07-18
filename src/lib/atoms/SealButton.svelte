<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'active' | 'primary';
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    variant = 'default',
    disabled = false,
    onclick,
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  type="button"
  class="seal-btn variant-{variant}"
  {disabled}
  {onclick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .seal-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 1.5px solid transparent;
    color: inherit;
    opacity: 0.65;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease),
      opacity var(--t-fast) var(--ease);
    padding: 0;
  }

  /* Default variant: transparent background, soft background on hover */
  .seal-btn.variant-default {
    /* Inherits color, uses soft opacity */
  }
  .seal-btn.variant-default:hover:not(:disabled) {
    background: var(--wash);
    opacity: 1;
  }

  /* Active variant: representing active state (toggled on) - subtle wash-bg and mid border */
  .seal-btn.variant-active {
    background: var(--wash);
    border-color: var(--line-mid);
    opacity: 1;
  }
  .seal-btn.variant-active:hover:not(:disabled) {
    background: var(--wash-hover);
  }

  /* Primary variant: the linen tan accent color */
  .seal-btn.variant-primary {
    border-color: var(--accent);
    color: var(--accent);
    opacity: 1;
  }
  .seal-btn.variant-primary:hover:not(:disabled) {
    background: oklch(73.5% 0.058 70 / 12%);
  }

  .seal-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .seal-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  /* Target inside SVGs to follow the seal stroke aesthetics */
  :global(.seal-btn svg) {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
