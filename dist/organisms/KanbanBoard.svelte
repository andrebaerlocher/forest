<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** The columns, typically a run of <KanbanColumn>. */
    children?: Snippet;
    /** Accessible name for the board region. */
    label?: string;
    class?: string;
  }

  let { children, label = 'Board', class: className = '', ...restProps }: Props = $props();
</script>

<!--
  KanbanColumn already opts into `scroll-snap-align: start` and narrows itself
  under `(pointer: coarse)` — see the note at KanbanColumn.svelte:40-49. Both
  are inert without a scrolling ancestor that declares `scroll-snap-type`,
  which is this element. `proximity`, not `mandatory`: mandatory snap fights a
  finger trying to drag past a column toward the middle of the next one.

  KanbanColumn carries no role of its own (its heading is a plain <h3>), so
  there is nothing here to double up against — the board itself is the one
  labelled region, on the same scrolling element, following CodeBlock's
  `.cs-codeblock-pre` (role="region" on the scroll container itself, not a
  wrapper around it).
-->
<div class="kanban-board {className}" role="region" aria-label={label} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .kanban-board {
    display: flex;
    align-items: stretch;
    gap: 16px;
    height: 100%;
    /* The x-only pan plus containment mirrors SpreadsheetView's
       `.spreadsheet-container` exactly: a horizontal drag must not also
       trigger the browser's edge-of-scroll back/forward gesture, and a
       vertical drag inside a column (its own `.column-body` scrolls, see
       KanbanColumn.svelte:85-94) must not fight this element for the
       gesture. */
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    touch-action: pan-x pan-y;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .kanban-board::-webkit-scrollbar {
    height: 8px;
  }

  .kanban-board::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }
</style>
