<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    count?: number;
    class?: string;
    children?: Snippet;
  }

  let { title, count = 0, class: className = '', children }: Props = $props();
</script>

<div class="kanban-column {className}">
  <div class="column-header">
    <div class="header-left">
      <h3 class="column-title">{title}</h3>
      <span class="badge">{count}</span>
    </div>
  </div>

  <div class="column-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .kanban-column {
    display: flex;
    flex-direction: column;
    width: 280px;
    background: var(--wash);
    border-radius: var(--radius-m);
    height: 100%;
    flex-shrink: 0;
  }

  /* A board of these needs a horizontal scroller, which is owned by
     whatever lays the columns out side by side — outside this file. What
     this component can do on its own: narrow the column so the next one
     visibly peeks past the viewport edge, making "swipe sideways" an
     obvious affordance instead of a wall of one full-width column. */
  @media (pointer: coarse) {
    .kanban-column {
      width: min(280px, 80vw);
      scroll-snap-align: start;
    }
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid var(--line-soft);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .column-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 0;
  }

  .badge {
    font-family: var(--font-num);
    font-size: 10.5px;
    color: var(--text-3);
    background: oklch(94.5% 0.012 95 / 8%);
    border: 1.5px solid var(--line-soft);
    border-radius: 99px;
    padding: 1px 6px;
  }

  .column-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .column-body::-webkit-scrollbar {
    width: 5px;
  }

  .column-body::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 3px;
  }
</style>
