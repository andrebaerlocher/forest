<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import BarMeter from '../atoms/BarMeter.svelte';
  import { isPhone } from '../breakpoints.svelte.js';
  import type { BenchmarkRow } from '../domain.js';
  import LedgerTable from './LedgerTable.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    rows: BenchmarkRow[];
    unit?: string;
    showBars?: boolean;
    total?: BenchmarkRow;
    caption?: string;
    class?: string;
  }

  let {
    rows: dataRows,
    unit,
    showBars = false,
    total,
    caption,
    class: className = '',
    ...restProps
  }: Props = $props();

  let max = $derived.by(() => {
    const values = dataRows.map((r) => r.value);
    if (total) values.push(total.value);
    return Math.max(0, ...values);
  });

  function display(row: BenchmarkRow): string {
    return row.formatted ?? `${row.value}${row.unit ?? unit ?? ''}`;
  }

  const phone = isPhone();

  /**
   * Below the shell breakpoint each source row becomes its own stack —
   * label, optional scale, value — rather than a column to scan down. A
   * benchmark row is a self-contained comparison, so stacking keeps the
   * comparison that matters (within the row) and gives up the one that
   * doesn't survive a narrow screen anyway (scanning values across rows).
   * The ledger stays mounted underneath and is hidden by width alone (see
   * its own note), so exactly one copy of the data is ever announced.
   */
  let cards = $derived(phone.current && dataRows.length > 0);
</script>

{#snippet headersSnippet()}
  <tr>
    <th>Label</th>
    {#if showBars}
      <th>Scale</th>
    {/if}
    <th class="num">Value</th>
  </tr>
{/snippet}

{#snippet rowsSnippet()}
  {#each dataRows as row (row.label)}
    <tr>
      <td class="text">
        {row.label}
        {#if row.detail}
          <div class="detail">{row.detail}</div>
        {/if}
      </td>
      {#if showBars}
        <td class="bar-cell">
          <BarMeter
            label={row.label}
            value={row.value}
            {max}
            unit={row.unit ?? unit ?? ''}
            formatted={row.formatted}
            class="bar-only"
            aria-hidden="true"
          />
        </td>
      {/if}
      <td class="num">{display(row)}</td>
    </tr>
  {/each}
{/snippet}

{#snippet summarySnippet()}
  {#if total}
    <tr class="sum">
      <td class="text">{total.label}</td>
      {#if showBars}
        <td class="bar-cell">
          <BarMeter
            label={total.label}
            value={total.value}
            {max}
            unit={total.unit ?? unit ?? ''}
            formatted={total.formatted}
            tone="accent"
            class="bar-only"
            aria-hidden="true"
          />
        </td>
      {/if}
      <td class="num">{display(total)}</td>
    </tr>
  {/if}
{/snippet}

{#snippet cardSnippet(row: BenchmarkRow, isTotal: boolean)}
  <li class="benchmark-card" class:total-card={isTotal}>
    <div class="card-head">
      <p class="card-title">{row.label}</p>
      {#if row.detail}
        <p class="detail">{row.detail}</p>
      {/if}
    </div>
    {#if showBars}
      <BarMeter
        label={row.label}
        value={row.value}
        {max}
        unit={row.unit ?? unit ?? ''}
        formatted={row.formatted}
        tone={isTotal ? 'accent' : 'neutral'}
        class="bar-only"
        aria-hidden="true"
      />
    {/if}
    <div class="card-value-row">
      <span class="card-value-label">Value</span>
      <span class="card-value">{display(row)}</span>
    </div>
  </li>
{/snippet}

<div class="benchmark-table {className}" {...restProps}>
  {#if caption}
    <p class="caption">{caption}</p>
  {/if}

  {#if cards}
    <!-- Safari drops list semantics when list-style is none, so the role
         is explicit — same fix DataTable's card mode uses. -->
    <!-- biome-ignore lint/a11y/noRedundantRoles: redundant per spec, but
    Safari drops list semantics from a ul with list-style: none. -->
    <ul class="benchmark-cards" role="list">
      {#each dataRows as row (row.label)}
        {@render cardSnippet(row, false)}
      {/each}
      {#if total}
        {@render cardSnippet(total, true)}
      {/if}
    </ul>
  {/if}

  <LedgerTable
    headers={headersSnippet}
    rows={rowsSnippet}
    summary={total ? summarySnippet : undefined}
  />
</div>

<style>
  .benchmark-table {
    width: 100%;
  }

  .caption {
    margin: 0 0 6px;
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--text-3);
  }

  .detail {
    font-size: 11px;
    color: var(--text-3);
  }

  .bar-cell {
    min-width: 160px;
  }

  /* the label row inside BarMeter would duplicate the ledger's own label
     column, so it is visually hidden here — the bar geometry is what this
     column exists for, and BarMeter's aria-label still carries the sentence */
  :global(.benchmark-table .bar-only .row) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  /* ── Phone: rows stack instead of scrolling ───────────────────────────
     The ledger stays mounted — hiding it by width alone, rather than
     unmounting it, keeps a single source of column truth (widths, header
     order) instead of two markups that can drift apart. See cards'
     `$derived` above for why exactly one of the two is ever visible. */
  @media (max-width: 760px) {
    .benchmark-table :global(.ledger-scroll) {
      display: none;
    }
  }

  .benchmark-cards {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .benchmark-card {
    /* transparent-border box model: a state ring later costs no pixels */
    border: 1.5px solid transparent;
    border-bottom-color: var(--line-soft);
    border-radius: var(--radius-s);
    padding: 12px 14px;
    /* no shadow at rest — a card is a persistent surface, not a lifted one */
  }

  .benchmark-card.total-card {
    border-top: 1.5px solid var(--line-strong);
    margin-top: 4px;
    padding-top: 16px;
  }

  .benchmark-card :global(.bar-only) {
    margin: 8px 0;
  }

  .card-head {
    margin-bottom: 8px;
  }

  .card-title,
  .benchmark-card .detail {
    margin: 0;
  }

  .card-title {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
  }

  .total-card .card-title {
    font-weight: 500;
  }

  .card-value-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }

  .card-value-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .card-value {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: var(--font-data);
    text-align: right;
    color: var(--text-1);
  }

  .total-card .card-value {
    font-weight: 500;
  }
</style>
