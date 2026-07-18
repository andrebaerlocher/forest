<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
    left?: Snippet;
    right?: Snippet;
  }

  let { class: className = '', children, left, right }: Props = $props();
</script>

<footer class="status-bar {className}">
  <div class="left-section">
    {#if left}
      {@render left()}
    {/if}
  </div>

  <div class="center-section">
    {#if children}
      {@render children()}
    {/if}
  </div>

  <div class="right-section">
    {#if right}
      {@render right()}
    {/if}
  </div>
</footer>

<style>
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    padding: 0 16px;
    border-top: 1px solid var(--line-soft);
    background: transparent;
    font-family: var(--font-body);
    font-size: 11.5px;
    color: var(--text-3);
    width: 100%;
    user-select: none;
    flex-shrink: 0;
  }

  .left-section,
  .center-section,
  .right-section {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 100%;
  }

  .center-section {
    justify-content: center;
    flex: 1;
  }

  /* Support metric strings inside status bar */
  :global(.status-bar span.metric) {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-2);
  }

  :global(.status-bar .tabs) {
    border-bottom: none;
    height: 100%;
  }

  :global(.status-bar .tab-btn) {
    padding: 8px 4px 6px;
    margin-bottom: 0;
    border-top: 2px solid transparent;
    border-bottom: none;
  }

  :global(.status-bar .tab-btn.active) {
    border-top-color: var(--accent);
    border-bottom-color: transparent;
  }
</style>
