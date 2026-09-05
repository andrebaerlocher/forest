<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** The wordmark text. Ignored when `children` is given. */
    text?: string;
    class?: string;
    children?: Snippet;
  }

  let { text = '', class: className = '', children, ...restProps }: Props = $props();
</script>

<!--
  A wordmark runs UP a rail on desktop and ACROSS a bar on a phone.

  The orientation is pure CSS, never `isPhone()`. Per the rule in
  breakpoints.svelte.ts, JavaScript may decide which copy of some content
  exists but never how it looks — and orientation is appearance, so a
  JS-driven class here would flash on the first client frame.

  The class name `wordmark-vertical` is load-bearing: Spine.svelte re-homes
  this element into the phone drawer's footer and flattens it there with a
  `:global(.wordmark-vertical)` rule. Renaming it silently breaks that.
-->
<div class="wordmark-vertical {className}" {...restProps}>
  {#if children}
    {@render children()}
  {:else}
    {text}
  {/if}
</div>

<style>
  .wordmark-vertical {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: var(--text-3);
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
    user-select: none;
    margin: 32px 0;
    /* The letter-spacing hangs a trailing gap off the last glyph; in vertical
       writing that reads as the text sitting high in its column. */
    padding-block-end: 0.5em;
  }

  /* Below the structural line the rail is a ~56px bar, which has no vertical
     run to set type in. A rotated wordmark there costs ~150px of a 812px
     screen to say one word — so it lies down and costs ~16px instead. */
  @media (max-width: 760px) {
    .wordmark-vertical {
      writing-mode: horizontal-tb;
      text-orientation: mixed;
      transform: none;
      margin: 0;
      padding-block-end: 0;
    }
  }
</style>
