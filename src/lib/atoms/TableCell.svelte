<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    type?: 'text' | 'numeric';
    active?: boolean;
    negative?: boolean;
    selected?: boolean;
    editing?: boolean;
    /** Forced hover state — for static specimens that can't demonstrate :hover */
    hover?: boolean;
    /** The <td> itself, so wrappers can focus the cell */
    element?: HTMLTableCellElement | null;
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
    hover = false,
    element = $bindable(null),
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<td
  bind:this={element}
  class="table-cell {className}"
  class:num={type === 'numeric'}
  class:col-active={active}
  class:neg={negative}
  {...restProps}
>
  <span class="cellbox" class:selected class:editing class:hover>
    {#if children}
      {@render children()}
    {/if}
  </span>
</td>

<style>
  .table-cell {
    /* padding lives on .cellbox so state rings fill the whole cell */
    padding: 0;
    font-size: var(--font-data);
    text-align: left;
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

  /* Cell states box model — the box is the cell */
  .cellbox {
    display: block;
    min-width: 0;
    font-family: inherit;
    font-variant-numeric: tabular-nums;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    border: 1.5px solid transparent;
    border-radius: 3px;
    /* the +2px / +5px re-absorb what the old inline-block cellbox contributed,
       so total cell density is unchanged */
    padding: calc(var(--pad-cell-y) + 2px) 15px;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      box-shadow var(--t-fast) var(--ease),
      padding var(--t-fast) var(--ease);
  }

  .cellbox.hover {
    background: var(--wash-hover);
  }

  .cellbox.selected {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
  }

  /* Editing is the selected skin read one notch louder.
     An inset ring, not a shadow: no elevation, no pixel shift. */
  .cellbox.editing {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
    box-shadow: inset 0 0 0 1px var(--cell-sel-border);
  }

  /* Selection follows focus, so the selected ring is the focus indicator */
  .table-cell:focus {
    outline: none;
  }

  .table-cell:focus-visible .cellbox {
    border-color: var(--cell-sel-border);
  }
</style>
