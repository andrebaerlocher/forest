<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import BarMeter from '../atoms/BarMeter.svelte';
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

<div class="benchmark-table {className}" {...restProps}>
  {#if caption}
    <p class="caption">{caption}</p>
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
  :global(.benchmark-table .sr-only-label .row) {
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
</style>
