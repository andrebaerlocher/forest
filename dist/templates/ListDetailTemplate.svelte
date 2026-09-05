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

  /* OPEN QUESTION, deliberately deferred.
     What follows is a fallback, not a design: a 240px-tall list sitting above
     a detail pane means a phone reader gives up a third of the screen to a
     list they have already chosen from. It works, nothing overflows, and it
     is honest about being a compromise.

     The alternative is master→detail navigation — the list is the page, a tap
     routes to the detail, and a back affordance returns. That is a routing
     decision, not a CSS one: it needs a URL per item, which means it belongs
     to the app consuming this template rather than to the template. Until an
     app needs it, this stays. Revisit when one does. */
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
