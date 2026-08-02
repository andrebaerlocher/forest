<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children, ...restProps }: Props = $props();
</script>

<p class="standfirst {className}" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</p>

<style>
  .standfirst {
    font-size: 17px;
    line-height: 1.6;
    color: var(--text-2);
    max-width: 62ch;
    margin: 0;
  }
</style>
