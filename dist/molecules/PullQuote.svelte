<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLQuoteElement> {
    attribution?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let { attribution, class: className = '', children, ...restProps }: Props = $props();
</script>

<blockquote class="pull-quote {className}" {...restProps}>
  <p class="quote">
    {#if children}
      {@render children()}
    {/if}
  </p>
  {#if attribution}
    <cite class="attribution">
      {@render attribution()}
    </cite>
  {/if}
</blockquote>

<style>
  .pull-quote {
    border-left: 3px solid var(--accent);
    background: var(--wash);
    padding: 20px;
    margin: 0;
    border-radius: 0 var(--radius-s) var(--radius-s) 0;
  }

  .quote {
    font-size: 15px;
    font-style: italic;
    line-height: 1.5;
    margin: 0 0 12px 0;
    color: var(--text-1);
  }

  .attribution {
    display: flex;
    flex-direction: column;
    font-style: normal;
    font-size: 13px;
    color: var(--text-2);
  }
</style>
