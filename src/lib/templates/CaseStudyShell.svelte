<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { scrollspy } from '../actions/scrollspy.js';
  import Tag from '../atoms/Tag.svelte';
  import { createTocRegistry, provideTocRegistry } from '../caseStudyToc.svelte.js';
  import type { MetricItem, TocEntry } from '../domain.js';
  import { provideHeadingLevel } from '../headingLevel.js';
  import MetricGrid from '../molecules/MetricGrid.svelte';
  import Drawer from '../organisms/Drawer.svelte';
  import TableOfContents from '../organisms/TableOfContents.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    tags?: string[];
    metrics?: MetricItem[];
    /**
     * An explicit outline. Omit it and the shell collects one from the
     * Section / DeepDive / DecisionRecord components mounted inside it —
     * convenient, but client-only, since children render after their parent.
     * Pass this when the outline must be server-rendered.
     */
    toc?: TocEntry[];
    tocTitle?: string;
    heroVisualization?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    tags = [],
    metrics = [],
    toc,
    tocTitle = 'Contents',
    heroVisualization,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  const registry = createTocRegistry();
  provideTocRegistry(registry);
  // The page owns its <h1>; everything the body mounts starts one level down.
  provideHeadingLevel(2);

  let entries = $derived(toc ?? registry.entries);
  let ids = $derived(entries.map((entry) => entry.id));

  let activeId = $state<string | null>(null);
  let progress = $state(0);
  let drawerOpen = $state(false);
  let articleEl = $state<HTMLElement>();

  $effect(() => {
    const el = articleEl;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        progress = rect.bottom <= window.innerHeight ? 100 : 0;
        return;
      }
      progress = Math.min(100, Math.max(0, (-rect.top / scrollable) * 100));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  });

  function handleActive(id: string | null) {
    activeId = id;
  }
</script>

<div
  class="cs-shell {className}"
  use:scrollspy={{ ids, onchange: handleActive }}
  {...restProps}
>
  <header class="cs-header">
    {#if tags.length > 0}
      <div class="cs-tag-row">
        {#each tags as tag (tag)}
          <Tag variant="standard">{tag}</Tag>
        {/each}
      </div>
    {/if}

    <h1 class="cs-title">{title}</h1>

    {#if subtitle}
      <p class="cs-subtitle">{subtitle}</p>
    {/if}

    {#if heroVisualization}
      <div class="cs-hero-vis">
        {@render heroVisualization()}
      </div>
    {/if}

    {#if metrics.length > 0}
      <MetricGrid {metrics} />
    {/if}
  </header>

  <!-- Both the rail and the trigger are always in the DOM; CSS alone decides
       which one exists visually. Following the house rule, JavaScript never
       gets to make that call, so there is no hydration flash. A display:none
       nav is out of the accessibility tree, so the drawer's copy — which only
       mounts while open — never duplicates the landmark. -->
  {#if entries.length > 0}
    <button
      type="button"
      class="cs-toc-trigger"
      aria-expanded={drawerOpen}
      onclick={() => (drawerOpen = true)}
    >
      <span class="cs-toc-trigger-label">{tocTitle}</span>
      <span class="cs-toc-trigger-count">{entries.length}</span>
    </button>

    <div class="cs-toc-rail">
      <TableOfContents {entries} {activeId} {progress} title={tocTitle} />
    </div>
  {/if}

  <article class="cs-article" bind:this={articleEl}>
    {#if children}
      {@render children()}
    {/if}
  </article>
</div>

{#if drawerOpen}
  <Drawer open side="right" label={tocTitle} onclose={() => (drawerOpen = false)}>
    <TableOfContents
      {entries}
      {activeId}
      {progress}
      title={tocTitle}
      onnavigate={() => (drawerOpen = false)}
    />
  </Drawer>
{/if}

<style>
  .cs-shell {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    font-family: var(--font-body);
    color: var(--text-1);
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .cs-header {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cs-tag-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .cs-title {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .cs-subtitle {
    margin: 0;
    font-size: 15px;
    line-height: 1.55;
    color: var(--text-2);
    max-width: 62ch;
  }

  .cs-hero-vis {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 24px;
    overflow: hidden;
  }

  .cs-article {
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
  }

  /* Sticky so a reader forty screens deep can still jump. */
  .cs-toc-trigger {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-round);
    color: var(--text-2);
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .cs-toc-trigger:hover {
    color: var(--text-1);
    border-color: var(--line-strong);
  }

  .cs-toc-trigger:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-toc-trigger-count {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-3);
  }

  .cs-toc-rail {
    display: none;
  }

  /* At the split line a secondary pane fits beside the primary one, so the
     outline graduates from a modal drawer to a permanent rail. */
  @media (min-width: 1101px) {
    .cs-shell {
      max-width: 1160px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 232px;
      column-gap: 48px;
      row-gap: 28px;
      align-items: start;
    }

    .cs-header {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    .cs-article {
      grid-column: 1;
      grid-row: 2;
    }

    .cs-toc-rail {
      display: block;
      grid-column: 2;
      grid-row: 2;
      position: sticky;
      top: 24px;
      max-height: calc(100vh - 48px);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--scroll-thumb) transparent;
    }

    .cs-toc-rail::-webkit-scrollbar {
      width: 6px;
    }

    .cs-toc-rail::-webkit-scrollbar-thumb {
      background: var(--scroll-thumb);
      border-radius: 3px;
    }

    .cs-toc-trigger {
      display: none;
    }
  }

  /* The reserved wide breakpoint's first consumer: past 1440px the reading
     column stops growing and the extra room goes to the rail. */
  @media (min-width: 1441px) {
    .cs-shell {
      max-width: 1340px;
      grid-template-columns: minmax(0, 1fr) 280px;
      column-gap: 64px;
    }
  }

  @media (max-width: 600px) {
    .cs-shell {
      padding: 16px;
      gap: 22px;
    }

    .cs-title {
      font-size: 24px;
    }
  }
</style>
