<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    dragging?: boolean;
    /** Drop the default 260px cap — for slips that fill a grid cell. */
    fluid?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    dragging = false,
    fluid = false,
    onclick,
    children,
    ...restProps
  }: Props = $props();
</script>

{#if onclick}
  <button
    type="button"
    class="slip"
    class:dragging
    class:fluid
    {onclick}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </button>
{:else}
  <div
    class="slip"
    class:dragging
    class:fluid
    {...restProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  .slip {
    background: var(--raised);
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    padding: 16px 18px;
    width: 100%;
    /* min() so a container narrower than 260px (e.g. a 360px viewport with
       its own padding) never forces this wider than it can hold. */
    max-width: min(260px, 100%);
    text-align: left;
    transition:
      box-shadow var(--t-base) var(--ease),
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .slip.fluid {
    max-width: none;
  }

  button.slip {
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    line-height: inherit;
    display: block;
  }

  button.slip:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .slip.dragging {
    box-shadow: var(--shadow-drag);
  }

  :global(.slip .stat-num) {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 26px;
    color: var(--text-1);
    line-height: 1.2;
  }

  :global(.slip .stat-label) {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: 4px;
  }
</style>
