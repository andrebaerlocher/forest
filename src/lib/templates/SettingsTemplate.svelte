<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    navigation?: Snippet;
    content?: Snippet;
  }

  let { class: className = '', navigation, content }: Props = $props();
</script>

<div class="settings-layout {className}">
  {#if navigation}
    <aside class="settings-nav">
      {@render navigation()}
    </aside>
  {/if}

  <div class="settings-content">
    {#if content}
      {@render content()}
    {/if}
  </div>
</div>

<style>
  .settings-layout {
    display: flex;
    gap: 32px;
    padding: 24px;
    width: 100%;
    max-width: 900px;
  }

  .settings-nav {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }

  :global(.settings-nav a),
  :global(.settings-nav button) {
    background: transparent;
    border: none;
    border-radius: var(--radius-s);
    padding: 8px 12px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  :global(.settings-nav a:hover),
  :global(.settings-nav button:hover) {
    background: var(--wash);
    color: var(--text-1);
  }

  :global(.settings-nav a.active),
  :global(.settings-nav button.active) {
    background: var(--wash);
    color: var(--text-1);
    font-weight: 400;
  }

  .settings-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 768px) {
    .settings-layout {
      flex-direction: column;
      gap: 16px;
    }
    .settings-nav {
      width: 100%;
      flex-direction: row;
      overflow-x: auto;
      border-bottom: 1px solid var(--line-soft);
      padding-bottom: 8px;
    }
  }
</style>
