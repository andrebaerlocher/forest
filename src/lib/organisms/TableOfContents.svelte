<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TocEntry } from '../domain.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    entries: TocEntry[];
    /** Section currently being read. Drives aria-current. */
    activeId?: string | null;
    /** Progress through the article, 0–100. Omit to hide the rail. */
    progress?: number;
    /** Accessible name for the nav landmark. */
    label?: string;
    /** Visible heading above the list. Set '' to hide it. */
    title?: string;
    /** Fires after a link is followed — lets a drawer close itself. */
    onnavigate?: (id: string) => void;
    class?: string;
  }

  let {
    entries,
    activeId = null,
    progress,
    label = 'Table of contents',
    title = 'Contents',
    onnavigate,
    class: className = '',
    ...restProps
  }: Props = $props();

  // Indent is relative to the shallowest entry present, so an outline that
  // starts at h3 does not render with a permanent orphan indent.
  let baseLevel = $derived(
    entries.length > 0 ? Math.min(...entries.map((e) => e.level)) : 2
  );
</script>

<nav class="cs-toc {className}" aria-label={label} {...restProps}>
  {#if progress !== undefined}
    <!-- Decorative: the reader's position is already conveyed by aria-current
         on the active entry, so announcing a percentage too is just noise. -->
    <div class="cs-toc-progress" aria-hidden="true">
      <div class="cs-toc-progress-fill" style="width: {Math.min(100, Math.max(0, progress))}%"></div>
    </div>
  {/if}

  {#if title}
    <p class="cs-toc-title">{title}</p>
  {/if}

  <ol class="cs-toc-list">
    {#each entries as entry (entry.id)}
      <li style="--toc-depth: {entry.level - baseLevel}">
        <a
          href="#{entry.id}"
          class="cs-toc-link"
          class:active={entry.id === activeId}
          aria-current={entry.id === activeId ? 'location' : undefined}
          onclick={() => onnavigate?.(entry.id)}
        >
          {entry.label}
        </a>
      </li>
    {/each}
  </ol>
</nav>

<style>
  .cs-toc {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: var(--font-body);
  }

  .cs-toc-progress {
    height: 2px;
    border-radius: var(--radius-round);
    background: var(--line-soft);
    overflow: hidden;
  }

  .cs-toc-progress-fill {
    height: 100%;
    background: var(--accent);
    transition: width var(--t-fast) var(--ease);
  }

  .cs-toc-title {
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .cs-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .cs-toc-link {
    display: block;
    /* The indicator border is always present so becoming active never nudges
       the label sideways. */
    border-left: 1.5px solid var(--line-soft);
    padding: 5px 10px 5px calc(10px + var(--toc-depth, 0) * 12px);
    font-size: 12.5px;
    line-height: 1.4;
    color: var(--text-3);
    text-decoration: none;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  .cs-toc-link:hover {
    color: var(--text-1);
    background: var(--wash-hover);
  }

  .cs-toc-link.active {
    color: var(--text-1);
    border-left-color: var(--accent);
    background: var(--wash);
  }

  .cs-toc-link:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -1px;
  }
</style>
