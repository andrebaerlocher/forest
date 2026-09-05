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

<div class="ledger-scroll">
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
</div>

<style>
  /* ── Phone overflow: the interim answer ──────────────────────────────
     table-layout: fixed has no overflow behaviour of its own — below
     ~640px it was crushing these columns instead of growing past them.
     This wrapper gives the table a scroll region instead: the ledger
     stays a ledger, columns keep their widths, and a wide figure pans
     into view rather than breaking.

     Two other options were on the table and both are set aside, not
     ruled out: dropping table-layout: fixed below 600px would let
     columns size to content, but risks wrapping a number mid-digit,
     which reads worse than having to scroll for it; a key/value card
     fallback like DataTable's would throw away the column comparison a
     ledger exists to make (DataTable.svelte:98 — "a spreadsheet never
     becomes cards" applies here too). Scrolling was the smallest change
     and the one that damages nothing, but it is not a considered
     redesign — see RESPONSIVE.md, "Decisions I cannot make for you",
     LedgerTable / BenchmarkTable. The choice between (a), (b) and (c)
     is still open. */
  .ledger-scroll {
    width: 100%;
    overflow-x: auto;
    touch-action: pan-x pan-y;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .ledger-scroll::-webkit-scrollbar {
    height: 8px;
  }

  .ledger-scroll::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

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
