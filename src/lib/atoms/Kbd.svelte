<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<kbd class="kbd {className}">
  {#if children}
    {@render children()}
  {/if}
</kbd>

<style>
  .kbd {
    font-family: var(--font-num);
    font-size: 11px;
    background: oklch(94.5% 0.012 95 / 8%);
    border: 1px solid oklch(94.5% 0.012 95 / 25%);
    border-radius: 4px;
    padding: 2px 5px;
    color: var(--text-3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-weight: 400;
  }
</style>
