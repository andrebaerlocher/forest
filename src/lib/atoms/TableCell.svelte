<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    type?: 'text' | 'numeric';
    active?: boolean;
    negative?: boolean;
    selected?: boolean;
    editing?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    type = 'text',
    active = false,
    negative = false,
    selected = false,
    editing = false,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<td
  class="table-cell {className}"
  class:num={type === 'numeric'}
  class:col-active={active}
  class:neg={negative}
  {...restProps}
>
  <span class="cellbox" class:selected class:editing>
    {#if children}
      {@render children()}
    {/if}
  </span>
</td>

<style>
  .table-cell {
    padding: var(--pad-cell-y) 10px;
    font-size: var(--font-data);
    text-align: left;
    transition: padding var(--t-fast) var(--ease);
    color: var(--text-2);
  }

  .table-cell.num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--text-1);
  }

  .table-cell.col-active {
    background: var(--wash);
  }

  .table-cell.neg {
    color: var(--danger) !important;
  }

  /* Cell states box model */
  .cellbox {
    display: inline-block;
    font-family: inherit;
    font-variant-numeric: tabular-nums;
    font-size: inherit;
    border: 1.5px solid transparent;
    border-radius: 3px;
    padding: 2px 5px;
    color: inherit;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .cellbox.selected {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
  }

  .cellbox.editing {
    background: var(--cell-edit-bg);
    border-color: var(--cell-edit-bg);
    color: var(--cell-edit-text);
  }
</style>
