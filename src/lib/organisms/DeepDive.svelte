<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { createTocRegistry, provideTocRegistry, useTocRegistry } from '../caseStudyToc.svelte.js';
  import type { TocEntry } from '../domain.js';
  import {
    clampHeadingLevel,
    type HeadingLevel,
    provideHeadingLevel,
    useHeadingLevel
  } from '../headingLevel.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Anchor target. This is the deep link readers will be sent. */
    id: string;
    title: string;
    /** One or two sentences on what this module does and why it is here. */
    summary?: string;
    /**
     * Anchors inside this module. Rendered as a jump list when 2 or more.
     * Omit it and the list is collected from the Section components mounted
     * inside this DeepDive — pass this only when the list must be
     * server-rendered, or to override what auto-collects.
     */
    subsections?: TocEntry[];
    /** Overrides the level inherited from the enclosing container. */
    level?: HeadingLevel;
    /** Label above the title. Set '' to drop it. */
    eyebrow?: string;
    /** Keep this module out of the enclosing shell's table of contents. */
    unlisted?: boolean;
    class?: string;
    showLinks?: boolean;
    children?: Snippet;
  }

  let {
    id,
    title,
    summary,
    subsections,
    level,
    eyebrow = 'Deep dive',
    unlisted = false,
    class: className = '',
    showLinks = false,
    children,
    ...restProps
  }: Props = $props();

  const inheritedLevel = useHeadingLevel();
  const toc = useTocRegistry();

  // Read once, on purpose: setContext may only run during initialisation, so
  // the level this module publishes to its children is fixed for its lifetime.
  // A component that needs a different level gets a different instance.
  // svelte-ignore state_referenced_locally
  const resolvedLevel: HeadingLevel = level ?? inheritedLevel;
  // Everything mounted inside this module is a part of it, not a peer of it.
  provideHeadingLevel(clampHeadingLevel(resolvedLevel + 1));

  // A DeepDive is its own outline scope: nested Sections report here instead
  // of to the enclosing shell, so they populate this module's jump list
  // rather than leaking into the page-level table of contents.
  const localToc = createTocRegistry();
  provideTocRegistry(localToc);

  let resolvedSubsections = $derived(subsections ?? localToc.entries);

  let node = $state<HTMLElement>();

  $effect(() => {
    if (unlisted || !toc || !node) return;
    return toc.register({ id, label: title, level: resolvedLevel }, node);
  });
</script>

<section
  bind:this={node}
  {id}
  class="cs-deepdive {className}"
  aria-labelledby="{id}-heading"
  {...restProps}
>
  <div class="cs-deepdive-head">
    {#if eyebrow}
      <p class="cs-deepdive-eyebrow">{eyebrow}</p>
    {/if}

    <svelte:element this={`h${resolvedLevel}`} id="{id}-heading" class="cs-deepdive-title">
      {title}
    </svelte:element>

    {#if summary}
      <p class="cs-deepdive-summary">{summary}</p>
    {/if}
  </div>

  <!-- A jump list, not a tab strip: these anchors scroll to content that stays
       on the page. Tab semantics would promise panels that hide each other,
       and long-form content must stay linkable and continuously readable. -->
  {#if resolvedSubsections.length > 1 && showLinks}
    <nav class="cs-deepdive-nav" aria-label="{title} contents">
      <ul>
        {#each resolvedSubsections as subsection (subsection.id)}
          <li><a href="#{subsection.id}">{subsection.label}</a></li>
        {/each}
      </ul>
    </nav>
  {/if}

  {#if children}
    <div class="cs-deepdive-body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  /* A rule and an eyebrow rather than a card: a deep dive is full of figures
     and tables that are themselves raised, and nesting raised on raised
     flattens both. */
  .cs-deepdive {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-top: 2px solid var(--line-strong);
    padding-top: 20px;
    scroll-margin-top: 64px;
  }

  .cs-deepdive-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cs-deepdive-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent-ink);
  }

  .cs-deepdive-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--text-1);
  }

  .cs-deepdive-summary {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-2);
    max-width: 66ch;
  }

  .cs-deepdive-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cs-deepdive-nav a {
    display: inline-block;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-round);
    padding: 4px 12px;
    font-size: 12px;
    color: var(--text-2);
    text-decoration: none;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  @media (hover: hover) {
    .cs-deepdive-nav a:hover {
      color: var(--text-1);
      border-color: var(--line-strong);
      background: var(--wash-hover);
    }
  }

  .cs-deepdive-nav a:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-deepdive-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--text-1);
  }

  .cs-deepdive-body > :global(p) {
    margin: 0;
    max-width: 68ch;
  }
</style>
