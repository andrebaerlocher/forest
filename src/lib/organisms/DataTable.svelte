<script lang="ts" generics="Row extends object = Record<string, unknown>">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import Checkbox from '../atoms/Checkbox.svelte';
  import Select from '../atoms/Select.svelte';
  import TableCell from '../atoms/TableCell.svelte';
  import { isPhone } from '../breakpoints.svelte.js';
  import type { DataTableColumn as Column, DataTableSort as Sort } from '../domain.js';
  import EmptyState from '../molecules/EmptyState.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    columns?: Column<Row>[];
    rows?: Row[];
    /** Field used as the row identity. Must be unique. */
    rowKey?: string;
    sort?: Sort | null;
    selectable?: boolean;
    selectedIds?: Array<string | number>;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    stickyHeader?: boolean;
    /** Enable row virtualization / windowing for handling large datasets. */
    virtualize?: boolean;
    /** Minimum row count threshold to activate virtualization automatically. Defaults to 50. */
    threshold?: number;
    /** Estimated or fixed row height in pixels. Defaults to 44. */
    rowHeight?: number;
    /** Viewport height for scroll calculations. Defaults to 440. */
    viewportHeight?: number;
    onrowclick?: (row: Row) => void;
    /** Per-cell render override; falls back to the raw value */
    cell?: Snippet<[Row, Column<Row>]>;
    empty?: Snippet;
    class?: string;
  }

  let {
    columns = [],
    rows = [],
    rowKey = 'id',
    sort = $bindable(null),
    selectable = false,
    selectedIds = $bindable([]),
    loading = false,
    emptyTitle = 'Nothing here yet',
    emptyDescription = 'No records match this view.',
    stickyHeader = true,
    virtualize = false,
    threshold = 50,
    rowHeight = 44,
    viewportHeight = 440,
    onrowclick,
    cell,
    empty,
    class: className = '',
    ...restProps
  }: Props = $props();

  let scrollTop = $state(0);
  const overscan = 5;

  let isVirtual = $derived(virtualize || rows.length >= threshold);

  let startIndex = $derived(
    isVirtual
      ? Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
      : 0
  );
  let endIndex = $derived(
    isVirtual
      ? Math.min(rows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan)
      : rows.length
  );

  let visibleRows = $derived(
    isVirtual ? rows.slice(startIndex, endIndex) : rows
  );

  let paddingTop = $derived(isVirtual ? startIndex * rowHeight : 0);
  let paddingBottom = $derived(
    isVirtual ? Math.max(0, (rows.length - endIndex) * rowHeight) : 0
  );

  function handleScroll(e: Event) {
    if (!isVirtual) return;
    const target = e.currentTarget as HTMLElement;
    scrollTop = target.scrollTop;
  }

  const phone = isPhone();

  /**
   * Card mode is read-and-select only. It deliberately does not support
   * EditableTableCell: that renders a literal <td>, its roving tabindex is a
   * 2-D grid pattern, and its entry gestures (dblclick, Enter, F2,
   * type-to-seed) have no touch equivalent. A spreadsheet never becomes cards.
   */
  let cards = $derived(phone.current && rows.length > 0);

  let leadColumn = $derived(columns.find((c) => c.primary) ?? columns[0]);
  let restColumns = $derived(columns.filter((c) => c !== leadColumn));
  let sortableColumns = $derived(columns.filter((c) => c.sortable));

  let sortValue = $derived(sort ? `${sort.key}:${sort.dir}` : '');
  let sortLabel = $derived(
    sort
      ? `Sorted by ${columns.find((c) => c.key === sort?.key)?.label ?? sort.key}, ${
          sort.dir === 'asc' ? 'ascending' : 'descending'
        }`
      : 'Unsorted'
  );

  function getRawValue(row: Row, col: Column<Row>): unknown {
    return col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[col.key];
  }

  function getCellValue(row: Row, col: Column<Row>): unknown {
    const raw = getRawValue(row, col);
    return col.format ? col.format(raw, row) : raw;
  }

  function getRowId(row: Row, index: number = 0): string | number {
    const val = (row as Record<string, unknown>)[rowKey] ?? (row as Record<string, unknown>).id;
    return (val !== undefined && val !== null) ? (val as string | number) : index;
  }

  function onSortSelect(e: Event) {
    const v = (e.currentTarget as HTMLSelectElement).value;
    if (!v) {
      sort = null; // same terminal state the header's third click produces
      return;
    }
    const [key, dir] = v.split(':');
    sort = { key, dir: dir as 'asc' | 'desc' };
  }

  let allSelected = $derived(rows.length > 0 && selectedIds.length === rows.length);

  function toggleAll(checked: boolean) {
    selectedIds = checked ? rows.map((r, i) => getRowId(r, i)) : [];
  }

  function toggleRow(id: string | number, checked: boolean) {
    selectedIds = checked ? [...selectedIds, id] : selectedIds.filter((s) => s !== id);
  }

  function toggleSort(col: Column<Row>) {
    if (!col.sortable) return;
    if (sort?.key !== col.key) {
      sort = { key: col.key, dir: 'asc' };
    } else if (sort.dir === 'asc') {
      sort = { key: col.key, dir: 'desc' };
    } else {
      sort = null; // third click clears — sorting is a lens, not a mode
    }
  }

  function handleRowKeyDown(e: KeyboardEvent, row: Row) {
    if (!onrowclick) return;
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
      }
      onrowclick(row);
    }
  }

  function ariaSort(col: Column<Row>): 'ascending' | 'descending' | 'none' | undefined {
    if (!col.sortable) return undefined;
    if (sort?.key !== col.key) return 'none';
    return sort.dir === 'asc' ? 'ascending' : 'descending';
  }
</script>

<div class="data-table-wrapper {className}" onscroll={handleScroll} {...restProps}>
  {#if cards}
    <span class="sr-only" aria-live="polite">{sortLabel}</span>

    {#if selectable || sortableColumns.length > 0}
      <div class="card-controls">
        {#if selectable}
          <Checkbox
            checked={allSelected}
            onchange={(e: Event) => toggleAll((e.currentTarget as HTMLInputElement).checked)}
          >Select all</Checkbox>
        {/if}
        {#if sortableColumns.length > 0}
          <!-- No header to click in card mode, so aria-sort would be
               meaningless. The select's current value IS the announcement,
               and it preserves the header's tri-state exactly. -->
          <Select value={sortValue} onchange={onSortSelect} aria-label="Sort rows">
            <option value="">Unsorted</option>
            {#each sortableColumns as col (col.key)}
              <option value="{col.key}:asc">{col.label} ↑</option>
              <option value="{col.key}:desc">{col.label} ↓</option>
            {/each}
          </Select>
        {/if}
      </div>
    {/if}

    <!-- Safari drops list semantics when list-style is none, so the role is
         explicit. No role="table"/"row"/"cell" retrofit: a fake grid laid
         over cards reads worse than an honest list. -->
    <!-- biome-ignore lint/a11y/noRedundantRoles: redundant per spec, but Safari
    drops list semantics from a ul with list-style: none, so VoiceOver stops
    announcing the item count. The role restores it. -->
    <ul class="card-list" role="list">
      {#if paddingTop > 0}
        <li class="virtual-spacer" style="height: {paddingTop}px" aria-hidden="true"></li>
      {/if}
      {#each visibleRows as row, index (getRowId(row, startIndex + index))}
        <li class="row-card" class:selected-row={selectedIds.includes(getRowId(row, startIndex + index))}>
          <div class="card-head">
            {#if selectable}
              <Checkbox
                checked={selectedIds.includes(getRowId(row, startIndex + index))}
                onchange={(e: Event) =>
                  toggleRow(getRowId(row, startIndex + index), (e.currentTarget as HTMLInputElement).checked)}
                aria-label={`Select row ${getCellValue(row, leadColumn) ?? getRowId(row, startIndex + index) ?? ''}`.trim()}
              />
            {/if}
            {#if onrowclick}
              <button type="button" class="card-title" onclick={() => onrowclick(row)}>
                {#if cell}{@render cell(row, leadColumn)}{:else}{getCellValue(row, leadColumn)}{/if}
              </button>
            {:else}
              <span class="card-title-static">
                {#if cell}{@render cell(row, leadColumn)}{:else}{getCellValue(row, leadColumn)}{/if}
              </span>
            {/if}
          </div>

          <dl class="card-fields">
            {#each restColumns as col (col.key)}
              <dt class="card-label">{col.label}</dt>
              <dd
                class="card-value"
                class:num={col.type === 'numeric'}
                class:neg={col.type === 'numeric' && Number(getRawValue(row, col)) < 0}
              >
                {#if cell}{@render cell(row, col)}{:else}{getCellValue(row, col)}{/if}
              </dd>
            {/each}
          </dl>
        </li>
      {/each}
      {#if paddingBottom > 0}
        <li class="virtual-spacer" style="height: {paddingBottom}px" aria-hidden="true"></li>
      {/if}
    </ul>
  {/if}

  <table class="data-table">
    <thead class:sticky={stickyHeader}>
      <tr>
        {#if selectable}
          <th class="select-col">
            <Checkbox
              checked={allSelected}
              onchange={(e: Event) => toggleAll((e.currentTarget as HTMLInputElement).checked)}
              aria-label="Select all rows"
            />
          </th>
        {/if}
        {#each columns as col (col.key)}
          <th
            class:num={col.type === 'numeric'}
            class:col-active={col.active}
            class:sortable={col.sortable}
            style={col.width ? `width: ${col.width}` : undefined}
            aria-sort={ariaSort(col)}
          >
            {#if col.sortable}
              <button type="button" class="sort-btn" onclick={() => toggleSort(col)}>
                <span>{col.label}</span>
                <span class="sort-mark" aria-hidden="true">
                  {#if sort?.key === col.key}
                    {sort.dir === 'asc' ? '↑' : '↓'}
                  {/if}
                </span>
              </button>
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#if paddingTop > 0}
        <tr class="virtual-spacer" style="height: {paddingTop}px">
          <td colspan={columns.length + (selectable ? 1 : 0)}></td>
        </tr>
      {/if}
      {#each visibleRows as row, index (getRowId(row, startIndex + index))}
        <tr
          class:selected-row={selectedIds.includes(getRowId(row, startIndex + index))}
          class:clickable={!!onrowclick}
          tabindex={onrowclick ? 0 : undefined}
          onclick={() => onrowclick?.(row)}
          onkeydown={(e) => handleRowKeyDown(e, row)}
        >
          {#if selectable}
            <td class="select-col">
              <Checkbox
                checked={selectedIds.includes(getRowId(row, startIndex + index))}
                onchange={(e: Event) =>
                  toggleRow(getRowId(row, startIndex + index), (e.currentTarget as HTMLInputElement).checked)}
                aria-label={`Select row ${getCellValue(row, leadColumn) ?? getRowId(row, startIndex + index) ?? ''}`.trim()}
              />
            </td>
          {/if}
          {#each columns as col (col.key)}
            <TableCell
              type={col.type ?? 'text'}
              active={col.active}
              negative={col.type === 'numeric' && Number(getRawValue(row, col)) < 0}
            >
              {#if cell}
                {@render cell(row, col)}
              {:else}
                {getCellValue(row, col)}
              {/if}
            </TableCell>
          {/each}
        </tr>
      {/each}
      {#if paddingBottom > 0}
        <tr class="virtual-spacer" style="height: {paddingBottom}px">
          <td colspan={columns.length + (selectable ? 1 : 0)}></td>
        </tr>
      {/if}
    </tbody>
  </table>

  {#if loading}
    <div class="table-state" role="status">Loading…</div>
  {:else if rows.length === 0}
    <div class="table-state">
      {#if empty}
        {@render empty()}
      {:else}
        <EmptyState title={emptyTitle} description={emptyDescription} />
      {/if}
    </div>
  {/if}
</div>

<style>
  .data-table-wrapper {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .data-table-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .data-table-wrapper::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-family: var(--font-body);
  }

  th {
    padding: var(--pad-cell-y) 16.5px; /* matches TableCell's ring + cellbox inset */
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    text-align: left;
    color: var(--text-3);
    border-bottom: 1.5px solid var(--line-mid);
    white-space: nowrap;
  }

  th.num {
    text-align: right;
  }

  th.col-active {
    background: var(--wash);
    color: var(--text-1);
    border-radius: var(--radius-s) var(--radius-s) 0 0;
  }

  thead.sticky th {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    /* opaque, so rows scrolling underneath don't show through */
    background-color: var(--canvas);
  }

  /* --wash is translucent ink; layer it as an image over the opaque canvas
     so a sticky active column keeps both its wash and its opacity */
  thead.sticky th.col-active {
    background-image: linear-gradient(var(--wash), var(--wash));
  }

  .sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
    cursor: pointer;
    transition: color var(--t-fast) var(--ease);
  }

  .sort-btn:hover {
    color: var(--text-1);
  }

  .sort-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  /* reserve the glyph's width so toggling sort never reflows the header */
  .sort-mark {
    display: inline-block;
    min-width: 1ch;
    color: var(--accent-ink);
  }

  tbody tr {
    border-bottom: 1px solid var(--line-soft);
  }

  tbody tr.clickable {
    cursor: pointer;
  }

  tbody tr.clickable:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }

  /* Gated: a stuck hover reads as "selected" (.selected-row is the same
     treatment one notch louder). */
  @media (hover: hover) {
    tbody tr.clickable:hover {
      background: var(--wash-hover);
    }
  }

  tbody tr.selected-row {
    background: var(--wash);
  }

  .select-col {
    width: 44px;
    padding: var(--pad-cell-y) 12px;
    text-align: left;
  }

  /* Checkbox ships with label spacing meant for forms, not table gutters */
  .select-col :global(.opt) {
    margin-right: 0;
  }

  .table-state {
    padding: 32px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--text-3);
  }
  /* ── Card mode ──────────────────────────────────────────────────────
     Below the shell breakpoint each row becomes a label/value card.
     <dl> is literally "label/value", and <dd> is flow content so any
     `cell` snippet output is legal inside it — the snippet is reused
     verbatim, it takes no table context. */

  /* The table exists for one frame after hydration on a phone (mediaQuery
     is false during SSR and the first client render). Keep it from
     painting a 4-column grid at 390px. */
  @media (max-width: 760px) {
    .data-table-wrapper > .data-table {
      display: none;
    }
  }

  .card-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row-card {
    /* transparent-border box model: selecting a card shifts nothing */
    border: 1.5px solid transparent;
    border-bottom-color: var(--line-soft);
    border-radius: var(--radius-s);
    padding: 12px 14px;
    background: transparent;
    /* no shadow — a card is a persistent surface */
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .row-card.selected-row {
    background: var(--wash);
    border-color: var(--cell-sel-border);
  }

  .card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .card-title,
  .card-title-static {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
    text-align: left;
    min-width: 0;
  }

  .card-title {
    flex: 1;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    padding: 6px 4px;
    cursor: pointer;
    min-height: 44px;
  }

  .card-title:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .card-fields {
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
    gap: 4px 16px;
    margin: 0;
  }

  .card-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    align-self: baseline;
  }

  .card-value {
    margin: 0;
    font-size: var(--font-data);
    color: var(--text-2);
    min-width: 0;
  }

  /* a number is still a number out of the grid */
  .card-value.num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-1);
  }

  /* status is ink, not paint. No !important needed here — unlike
     TableCell, nothing is fighting .num for the colour. */
  .card-value.neg {
    color: var(--danger);
  }

  .card-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 0 12px;
    border-bottom: 1.5px solid var(--line-mid);
    margin-bottom: 12px;
  }
</style>
