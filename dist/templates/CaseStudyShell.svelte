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
    /**
     * Masthead facts — roles, timeline, team. Belongs in the header rather
     * than at the top of the article: the header is full-bleed while the
     * article is indented into the numbering gutter, so meta rendered as
     * children lands on the body's left edge and reads as a stray indent
     * rather than as part of the masthead.
     */
    meta?: Snippet;
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
    meta,
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
  // What the phone control says instead of a generic title. A bottom bar that
  // spends a thumb's worth of screen should report where you are, not just
  // offer to tell you. Falls back to the title before scrollspy first fires.
  let activeLabel = $derived(entries.find((entry) => entry.id === activeId)?.label ?? tocTitle);

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
  <!-- Both the rail and the trigger are always in the DOM; CSS alone decides
       which one exists visually. Following the house rule, JavaScript never
       gets to make that call, so there is no hydration flash. A display:none
       nav is out of the accessibility tree, so the drawer's copy — which only
       mounts while open — never duplicates the landmark. Kept ahead of the
       reading column in DOM/tab order (it's the first thing a keyboard user
       hits, matching its pinned-at-top visual position) rather than after a
       potentially very long article. -->
  {#if entries.length > 0}
    <!-- Two labels, both always in the DOM; CSS decides which is visible, per
         the same rule as the trigger/rail pair above. The accessible name is
         pinned to `tocTitle` so it does not churn on every scroll tick — a
         control whose name changes as you read is hostile to a screen reader,
         and the reader's position is already announced inside the sheet. -->
    <button
      type="button"
      class="cs-toc-trigger"
      aria-expanded={drawerOpen}
      aria-label={tocTitle}
      onclick={() => (drawerOpen = true)}
    >
      <span class="cs-toc-trigger-label">{tocTitle}</span>
      <span class="cs-toc-trigger-here">{activeLabel}</span>
      <span class="cs-toc-trigger-count">{entries.length}</span>
    </button>

    <div class="cs-toc-rail">
      <TableOfContents {entries} {activeId} {progress} title={tocTitle} />
    </div>
  {/if}

  <!-- Grouped so the wide-tier grid can place the rail as a single sibling
       column spanning one row alongside header+article together — a sticky
       item spanning multiple explicit grid rows fails to stick in some
       engines, so header and article share one row instead. -->
  <div class="cs-main-col">
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

      {#if meta}
        <div class="cs-meta">
          {@render meta()}
        </div>
      {/if}
    </header>

    <article class="cs-article" bind:this={articleEl}>
      {#if children}
        {@render children()}
      {/if}
    </article>
  </div>
</div>

<!-- Not wrapped in {#if}: Drawer keeps itself mounted while it animates out,
     so gating it here would destroy it mid-exit.
     A sheet, not a side drawer: the outline is a long list of destinations
       and the thumb starts at the bottom of the screen. Capped so the article
       stays visible behind it — the reader should see what they are leaving. -->
<Drawer
  open={drawerOpen}
  side="bottom"
  height="min(70dvh, 560px)"
  label={tocTitle}
  onclose={() => (drawerOpen = false)}
>
  <TableOfContents
    {entries}
    {activeId}
    {progress}
    title={tocTitle}
    stickyHead
    onnavigate={() => (drawerOpen = false)}
  />
</Drawer>

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
    /* Shared left margin used as an orientation gutter — Section numbers,
       StackManifest's category labels and the masthead's meta labels all
       anchor to this so they read as one page-wide wayfinding column instead
       of unrelated local details. Declared here, on the common ancestor, so
       the header's meta block and the article resolve the same value. */
    --cs-gutter: 96px;
  }

  /* The masthead deliberately ignores the article's numbering gutter and runs
     full-bleed. Without a boundary that intent is unreadable — two left edges
     on identical paper look like a mistake, not a zone — so the rule is what
     turns the offset into a masthead. */
  .cs-header {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 24px;
    /*border-bottom: 1px solid var(--rule-soft);*/
  }

  /* Padded into the same gutter the article uses, so meta labels hang in the
     wayfinding column and their values land on the body's left edge — the
     masthead reads as full-bleed while still resolving to the page grid. */
  .cs-meta {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 6px;
    padding-left: var(--cs-gutter);
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
    /*max-width: 62ch;*/
  }

  .cs-hero-vis {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 24px;
    overflow: hidden;
  }

  /* Reserved via padding so descendants can position into the gutter without
     overflowing the grid track. */
  /* German compounds ("Datenschutzvorgaben", "Nachteilsausgleich") are longer
     than a 375px measure and would otherwise push the column wide. The pages
     that need it declare lang="de", which is what tells the engine where the
     legal break points are — hyphens: auto without a language is inert. */
  .cs-article {
    hyphens: auto;
    overflow-wrap: break-word;
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
    padding-left: var(--cs-gutter);
  }

  /* A pass-through wrapper below the split — header and article stay direct
     flex children of .cs-shell so the narrow-width stacked layout is
     untouched. Only becomes a real box at the grid breakpoint, below. */
  .cs-main-col {
    display: contents;
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

  /* Gated: a hover that sticks after a tap reads as a state this control
     is not in. */
  @media (hover: hover) {
    .cs-toc-trigger:hover {
      color: var(--text-1);
      border-color: var(--line-strong);
    }
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

  /* The "you are here" label only exists on the phone bar. */
  .cs-toc-trigger-here {
    display: none;
  }

  .cs-toc-rail {
    display: none;
  }

  /* At the split line a secondary pane fits beside the primary one, so the
     outline graduates from a modal drawer to a permanent rail. Queried
     against the shell's own available width (via the container context
     established on Shell's .main), not the viewport — the Spine rail's
     collapsed/expanded state shifts available width by ~146px, which a
     viewport media query can't account for. */
  @container (min-width: 860px) {
    .cs-shell {
      max-width: 1160px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 232px;
      column-gap: 48px;
      align-items: start;
      --cs-gutter: 140px;
    }

    /* Header and article become one grid item sharing a single row with the
       rail (rather than the rail spanning two rows) — a sticky item spanning
       multiple explicit grid rows doesn't stick reliably in some engines. */
    .cs-main-col {
      display: flex;
      flex-direction: column;
      gap: 28px;
      grid-column: 1;
      grid-row: 1;
      min-width: 0;
    }

    /* Starts level with the title (same row as .cs-main-col) instead of only
       appearing once a reader scrolls past the header. */
    .cs-toc-rail {
      display: block;
      grid-column: 2;
      grid-row: 1;
      position: sticky;
      top: 24px;
      max-height: calc(100dvh - 48px);
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

  /* Past this width the reading column stops growing and the extra room goes
     to the rail.

     NOT the reserved --bp-wide tier, despite what an earlier version of this
     comment claimed: 1040 here is a CONTAINER width, measured against the
     query context Shell establishes on .main, and --bp-wide is a 1440px
     VIEWPORT literal. They are different axes and different numbers, so this
     is not a consumer of that tier — --bp-wide remains unclaimed, exactly as
     forest.css and breakpoints.ts both say. */
  @container (min-width: 1040px) {
    .cs-shell {
      max-width: 1340px;
      grid-template-columns: minmax(0, 1fr) 280px;
      column-gap: 64px;
    }
  }

  /* ── The outline control moves to the thumb ──────────────────────────
     Below the structural line the top of the screen is the farthest point
     from the hand, so the control leaves the masthead and becomes a bar at
     the foot of the page, opening a sheet rather than a side drawer.

     FIXED, NOT STICKY. `position: sticky` with a `bottom` offset only ever
     shifts an element UP into view — it never pushes one down — so a control
     sitting near the top of a forty-screen article would simply scroll away.
     Sticky-bottom is for a footer you have not reached yet, not for a bar
     that must be present from the first screen.

     That leaves `fixed`, which is worth a note because Shell's .main carries
     `container-type: inline-size`, and layout containment can make an element
     a containing block for fixed descendants — which would anchor this bar to
     the bottom of the ARTICLE instead of the viewport. Measured in Chromium:
     it resolves against the viewport, and the TOC Drawer below has always
     depended on the same thing from the same place. If a future engine
     tightens that, this bar and that drawer break together and the fix is one
     fix. Worth re-checking on WebKit when the page is next opened on a phone.

     It is a viewport query, not a container query, because a thumb and a
     phone bar are facts about the device, not about available width. ── */
  @media (max-width: 760px) {
    .cs-toc-trigger {
      position: fixed;
      top: auto;
      left: 16px;
      right: 16px;
      width: auto;
      /* Clears the Spine bottom bar when there is one; --bar-phone is 0
         otherwise, so the bar sits 12px off the floor on a plain page. */
      bottom: calc(var(--bar-phone) + env(safe-area-inset-bottom, 0px) + 12px);
      align-self: stretch;
      justify-content: space-between;
      gap: 12px;
      /* A thumb target, and taller than the 44px floor because this one is
         the primary means of moving around a forty-screen document. */
      min-height: 48px;
      padding: 10px 18px;
    }

    .cs-toc-trigger-label {
      display: none;
    }

    .cs-toc-trigger-here {
      display: block;
      /* Reads as a place, not as a label: the uppercase tracking that suits a
         one-word chip makes a section title unreadable at a glance. */
      text-transform: none;
      letter-spacing: 0.01em;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-1);
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .cs-toc-trigger-count {
      flex-shrink: 0;
    }
  }

  @media (max-width: 600px) {
    /* No room to spare for marginalia at this width — Section and
       StackManifest both fall back to static/stacked layouts here too. */
    .cs-shell {
      padding: 16px;
      gap: 22px;
      --cs-gutter: 0px;
    }

    .cs-title {
      font-size: 24px;
    }

    .cs-header {
      padding-bottom: 18px;
    }
  }
</style>
