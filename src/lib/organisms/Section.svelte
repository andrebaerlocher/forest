<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useTocRegistry } from '../caseStudyToc.svelte.js';
  import { type HeadingLevel, useHeadingLevel } from '../headingLevel.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Anchor target. Must be unique in the document — it is the deep link. */
    id: string;
    title: string;
    /** A section marker, e.g. "01". Rendered in the numeric face. */
    number?: string | number;
    /** Overrides the level inherited from the enclosing container. */
    level?: HeadingLevel;
    /** Keep this section out of the enclosing shell's table of contents. */
    unlisted?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    id,
    title,
    number,
    level,
    unlisted = false,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  // Both must be read during init — they are context lookups, not state.
  const inheritedLevel = useHeadingLevel();
  const toc = useTocRegistry();

  let resolvedLevel = $derived(level ?? inheritedLevel);
  let node = $state<HTMLElement>();

  // Registration is an effect, not init work: the shell renders before its
  // children, so it can never have the outline in hand for SSR anyway. A
  // consumer who needs a server-rendered outline passes `toc` to the shell.
  $effect(() => {
    if (unlisted || !toc || !node) return;
    return toc.register({ id, label: title, level: resolvedLevel }, node);
  });
</script>

<section
  bind:this={node}
  {id}
  class="cs-section {className}"
  aria-labelledby="{id}-heading"
  {...restProps}
>
  <svelte:element
    this={`h${resolvedLevel}`}
    id="{id}-heading"
    class="cs-section-title level-{resolvedLevel}"
  >
    {#if number !== undefined}<span class="cs-section-number">{number}</span>{/if}{title}
  </svelte:element>

  {#if children}
    <div class="cs-section-body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .cs-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
    /* Clear the sticky contents trigger when an anchor link jumps here. */
    scroll-margin-top: 64px;
  }

  .cs-section-title {
    margin: 0;
    color: var(--text-1);
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .cs-section-title.level-2 {
    font-size: 22px;
    font-weight: 600;
  }

  .cs-section-title.level-3 {
    font-size: 17px;
    font-weight: 600;
  }

  /* Below h3 a section is a labelled sub-part rather than a chapter, so it
     drops to the small-caps register the tables and badges already use. */
  .cs-section-title.level-4,
  .cs-section-title.level-5,
  .cs-section-title.level-6 {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-2);
  }

  .cs-section-number {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 0.72em;
    letter-spacing: 0.08em;
    color: var(--accent-ink);
    margin-right: 0.7em;
  }

  .cs-section-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--text-1);
  }

  /* Direct children only — nested components own their own measure. */
  .cs-section-body > :global(p) {
    margin: 0;
    max-width: 68ch;
  }
</style>
