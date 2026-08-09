<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
    import { fly } from 'svelte/transition';
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
    startsClosed?: boolean;
    canCollapse?: boolean;
  }

  let {
    id,
    title,
    number,
    level,
    unlisted = false,
    class: className = '',
    children,
    startsClosed = false,
    canCollapse = false,
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

  let isOpen = $derived(!startsClosed);

</script>

<section
  bind:this={node}
  {id}
  class="cs-section {className}"
  aria-labelledby="{id}-heading"
  {...restProps}
>
  <svelte:element
    onclick={() => isOpen = canCollapse ? !isOpen : true}
    role="button"
    tabindex="0"
    this={`h${resolvedLevel}`}
    id="{id}-heading"
    class="cs-section-title level-{resolvedLevel}"
    style:cursor={canCollapse ? 'pointer' : 'default'}
  >
    {#if number !== undefined}<span class="cs-section-number">{number}</span>{/if}{title} {#if canCollapse && !isOpen}
      <span class="cs-section-trigger">anzeigen</span>
      {:else if canCollapse && isOpen}
      <span class="cs-section-trigger">verbergen</span>
    {/if}
  </svelte:element>

  {#if children && isOpen}
    <div class="cs-section-body" transition:fly={{duration: 300, y: -10}}>
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
    position: relative;
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

  /* Fixed size and a fixed-width, gutter-anchored box — independent of the
     heading's own font-size — so "01" beside an h2 and "01.01" beside an h3
     land in the same aligned column instead of drifting with heading level. */
  .cs-section-number {
    position: absolute;
    left: calc(-1 * var(--cs-gutter, 96px));
    width: calc(var(--cs-gutter, 96px) - 12px);
    top: 0.3em;
    line-height: inherit;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-align: right;
    color: var(--accent-ink);
    white-space: nowrap;
  }

  .cs-section-trigger {
    font-family: var(--font-num);
    font-weight: 100;
    letter-spacing: 0.06em;
    color: var(--accent-ink);
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .cs-section-number {
      position: static;
      display: block;
      width: auto;
      text-align: left;
      margin-bottom: 2px;
    }
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
