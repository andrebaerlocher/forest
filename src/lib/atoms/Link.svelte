<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    class?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    href = '#',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<a href={href} class="link {className}" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</a>

<style>
  .link {
    color: var(--text-1);
    text-decoration: none;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 1px;
    font-family: var(--font-body);
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
    cursor: pointer;
  }

  .link:hover {
    color: var(--accent-ink);
    border-bottom-color: var(--accent-ink);
  }

  .link:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }
</style>
