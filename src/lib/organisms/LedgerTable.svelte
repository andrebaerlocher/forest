<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLTableElement> {
    activeCol?: string;
    headers?: Snippet;
    rows?: Snippet;
    summary?: Snippet;
  }

  let {
    activeCol = $bindable('Price'),
    headers,
    rows,
    summary,
    ...restProps
  }: Props = $props();
</script>

<table class="ledger" {...restProps}>
  {#if headers}
    <thead>
      {@render headers()}
    </thead>
  {/if}
  {#if rows}
    <tbody>
      {@render rows()}
    </tbody>
  {/if}
  {#if summary}
    <tfoot>
      {@render summary()}
    </tfoot>
  {/if}
</table>

<style>
  .ledger {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin: 18px 0 6px;
    max-width: 640px;
    font-family: var(--font-body);
  }

  :global(.ledger td),
  :global(.ledger th) {
    padding: var(--pad-cell-y) 10px;
    font-size: var(--font-data);
    text-align: left;
    font-weight: inherit;
    transition: padding var(--t-fast) var(--ease);
  }

  :global(.ledger th) {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  :global(.ledger .num) {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--text-1);
  }

  :global(.ledger th.num) {
    color: var(--text-3);
    font-family: var(--font-body);
  }

  :global(.ledger tr + tr) {
    border-top: 1px solid var(--line-soft);
  }

  :global(.ledger tr.sum) {
    border-top: 1.5px solid var(--line-strong);
  }

  :global(.ledger .col-active) {
    background: var(--wash);
  }

  :global(.ledger th.col-active) {
    color: var(--text-1);
    border-radius: var(--radius-s) var(--radius-s) 0 0;
  }

  :global(.ledger tr.sum .col-active) {
    border-radius: 0 0 var(--radius-s) var(--radius-s);
  }

  :global(.ledger td.text) {
    color: var(--text-2);
  }

  :global(.ledger .neg) {
    color: var(--danger);
  }

  /* Cell states live in atoms/TableCell.svelte — this component must not
     duplicate them globally. */
</style>
