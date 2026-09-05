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
  <!--
    A disclosure is a BUTTON INSIDE the heading, never `role="button"` ON it.
    An earlier version put the role on the h2/h3 itself, which replaced the
    implicit heading role and deleted the document outline — a screen-reader
    user lost heading navigation on a forty-screen case study, and the outline
    the TOC is built from stopped matching what was announced. It was also
    focusable with no key handler, so Tab reached it and nothing activated it.

    A real <button> keeps the heading a heading and gets Enter/Space, focus
    and the aria-expanded contract for free. The section number stays outside
    the control: it is a marginal label, not part of the thing you press.
  -->
  <svelte:element
    this={`h${resolvedLevel}`}
    id="{id}-heading"
    class="cs-section-title level-{resolvedLevel}"
    class:collapsible={canCollapse}
  >{#if number !== undefined}<span class="cs-section-number">{number}</span>{/if}{#if canCollapse}<button
        type="button"
        class="cs-section-toggle"
        aria-expanded={isOpen}
        onclick={() => (isOpen = !isOpen)}
      >{title}
      <span class="cs-section-trigger">{isOpen ? 'verbergen' : 'anzeigen'}</span></button
    >{:else}{title}{/if}</svelte:element>

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

  /* Only the disclosure is a control, so only it owes a 44px target. A
     plain heading is text and keeps its natural line box. */
  @media (pointer: coarse) {
    .cs-section-toggle {
      min-height: 44px;
      padding-block: 6px;
    }
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

  /* A control that must look exactly like the heading text it sits in.
     The transparent border is the house box model: the focus ring lands on
     an already-present border, so nothing shifts by a pixel when it appears. */
  .cs-section-toggle {
    /* inline-block, not inline: min-height has no effect on an inline box,
       and the coarse-pointer rule below depends on it. */
    display: inline-block;
    margin: 0;
    padding: 0;
    background: none;
    border: 1.5px solid transparent;
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    text-align: left;
    cursor: pointer;
  }

  .cs-section-toggle:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-section-trigger {
    font-family: var(--font-num);
    font-weight: 100;
    letter-spacing: 0.06em;
    color: var(--accent-ink);
    white-space: nowrap;
  }

  /* --cs-gutter collapses to 0 at this width (CaseStudyShell), so there is no
     margin left to hang a number in — 16px of page padding cannot hold "03.03"
     at 11px. Stacking it above the title instead, which is what this rule used
     to do, spends a whole line on an ornament and pushes the actual heading
     down. The numbering is wayfinding for a wide page with a gutter; it is not
     in the outline (Section registers `title` alone, not the number) and no
     anchor depends on it, so on a phone it simply goes. */
  @media (max-width: 600px) {
    .cs-section-number {
      display: none;
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
