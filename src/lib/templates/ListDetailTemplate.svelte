<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    list?: Snippet;
    detail?: Snippet;
  }

  let { class: className = '', list, detail }: Props = $props();
</script>

<div class="list-detail-layout {className}">
  <div class="list-pane">
    {#if list}
      {@render list()}
    {/if}
  </div>

  <div class="detail-pane">
    {#if detail}
      {@render detail()}
    {/if}
  </div>
</div>

<style>
  .list-detail-layout {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .list-pane {
    width: 300px;
    height: 100%;
    border-right: 1px solid var(--line-soft);
    background: transparent;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .list-pane::-webkit-scrollbar {
    width: 6px;
  }

  .list-pane::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 3px;
  }

  .detail-pane {
    flex: 1;
    min-width: 0;
    height: 100%;
    background: transparent;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .detail-pane::-webkit-scrollbar {
    width: 8px;
  }

  .detail-pane::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  @media (max-width: 760px) {
    .list-detail-layout {
      flex-direction: column;
    }
    .list-pane {
      width: 100%;
      height: 240px;
      border-right: none;
      border-bottom: 1px solid var(--line-soft);
    }
    .detail-pane {
      height: auto;
    }
  }
</style>
