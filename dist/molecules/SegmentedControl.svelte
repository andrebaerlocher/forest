<script lang="ts">
  import type { SelectableItem as Option } from '../domain.js';

  interface Props {
    items: Option[];
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

  function selectOption(id: string) {
    activeId = id;
    if (onchange) {
      onchange(id);
    }
  }
</script>

<div class="segmented {className}">
  {#each items as item (item.id)}
    <button
      type="button"
      class="segment-btn"
      class:active={activeId === item.id}
      onclick={() => selectOption(item.id)}
    >
      {item.label}
    </button>
  {/each}
</div>

<style>
  .segmented {
    display: inline-flex;
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: 2px;
    gap: 2px;
  }

  .segment-btn {
    background: transparent;
    border: none;
    border-radius: calc(var(--radius-s) - 2px);
    padding: var(--pad-control-y) 14px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
    cursor: pointer;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover on touch would leave a segment looking
     permanently active. */
  @media (hover: hover) {
    .segment-btn:hover {
      color: var(--text-1);
      background: var(--wash);
    }
  }

  .segment-btn.active {
    background: var(--cell-edit-bg);
    color: var(--cell-edit-text);
  }

  .segment-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 1px;
  }
</style>
