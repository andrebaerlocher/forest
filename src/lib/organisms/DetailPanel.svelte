<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    class?: string;
    children?: Snippet;
  }

  let { title = '', class: className = '', children }: Props = $props();
</script>

<aside class="detail-panel {className}">
  {#if title}
    <div class="panel-header">
      <h3 class="panel-title">{title}</h3>
    </div>
  {/if}
  <div class="panel-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
</aside>

<style>
  .detail-panel {
    width: 320px;
    height: 100%;
    border-left: 1px solid var(--line-soft);
    background: var(--raised);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .panel-header {
    padding: 18px 20px;
    border-bottom: 1px solid var(--line-soft);
  }

  .panel-title {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-1);
    margin: 0;
    text-transform: uppercase;
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .panel-body::-webkit-scrollbar {
    width: 6px;
  }

  .panel-body::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 3px;
  }
</style>
