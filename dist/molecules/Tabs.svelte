<script lang="ts">
  import type { SelectableItem as TabItem } from '../domain.js';

  interface Props {
    items: TabItem[];
    activeId: string;
    class?: string;
    onchange?: (id: string) => void;
  }

  let {
    items = [],
    activeId = $bindable(),
    class: className = '',
    onchange
  }: Props = $props();

  function selectTab(id: string) {
    activeId = id;
    if (onchange) {
      onchange(id);
    }
  }
</script>

<div class="tabs {className}" role="tablist">
  {#each items as item (item.id)}
    <button
      type="button"
      class="tab-btn"
      class:active={activeId === item.id}
      role="tab"
      aria-selected={activeId === item.id ? 'true' : 'false'}
      onclick={() => selectTab(item.id)}
    >
      {item.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid var(--line-soft);
    padding: 0 4px;
    width: 100%;
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 6px 4px 8px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-3);
    cursor: pointer;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
    margin-bottom: -1px;
  }

  /* Gated: this is exactly .active's colour minus the rule. */
  @media (hover: hover) {
    .tab-btn:hover {
      color: var(--text-1);
    }
  }

  .tab-btn.active {
    color: var(--text-1);
    border-bottom-color: var(--accent);
    font-weight: 400;
  }

  .tab-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }
  /* A tab bar is a bar; taller is the native idiom. StatusBar re-narrows
     these to fit its footer, so it grows in the same breath. */
  @media (pointer: coarse) {
    .tab-btn {
      padding: 12px 8px 14px;
    }
  }
</style>
