<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    status?: 'neutral' | 'success' | 'warning' | 'danger';
    label?: string;
    /** Hide the dot and set the label in status ink alone */
    bare?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    status = 'neutral',
    label = '',
    bare = false,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<!-- Status as ink, never paint: a dot, a hairline and text — no filled tint. -->
<span class="status-pill status-{status} {className}" class:bare {...restProps}>
  {#if !bare}
    <i class="dot" aria-hidden="true"></i>
  {/if}
  <span class="label">
    {#if children}
      {@render children()}
    {:else}
      {label}
    {/if}
  </span>
</span>

<style>
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-body);
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.04em;
    padding: 3px 12px;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-round);
    background: transparent;
    color: var(--text-2);
  }

  .status-pill.bare {
    padding: 0;
    border-color: transparent;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
  }

  .status-success {
    color: var(--success);
    border-color: color-mix(in oklch, var(--success), transparent 65%);
  }

  .status-warning {
    color: var(--warning);
    border-color: color-mix(in oklch, var(--warning), transparent 65%);
  }

  .status-danger {
    color: var(--danger);
    border-color: color-mix(in oklch, var(--danger), transparent 65%);
  }

  .status-neutral .dot {
    background: var(--text-3);
  }

  .label {
    white-space: nowrap;
  }
</style>
