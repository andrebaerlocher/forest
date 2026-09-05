<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'standard' | 'accent';
    children?: Snippet;
  }

  let { variant = 'standard', children, ...restProps }: Props = $props();
</script>

<span class="tag" class:accent={variant === 'accent'} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</span>

<style>
  .tag {
    display: inline-block;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    background: var(--raised);
    border: 1px solid var(--line-mid);
    color: var(--text-2);
    border-radius: var(--radius-round);
    padding: 3px 12px;
    line-height: 1.5;
  }

  .tag.accent {
    border-color: var(--accent);
    color: var(--accent-ink);
    background: transparent;
  }
</style>
