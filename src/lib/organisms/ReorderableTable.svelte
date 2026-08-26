<script lang="ts" generics="Row extends object = Record<string, unknown>">
  import { type Snippet, tick } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import TableCell from '../atoms/TableCell.svelte';
  import type { DataTableColumn as Column, TableReorder } from '../domain.js';
  import EmptyState from '../molecules/EmptyState.svelte';
  import { cellValue, isNegative, rowId } from '../utils/tableValues.js';

  /**
   * A table whose row order is the data — invoice lines, offer positions, a
   * checklist. Deliberately not a DataTable variant: sorting and a hand-made
   * order are mutually exclusive, so a table that offers both invites the user
   * to sort away the arrangement they just built. Sorting is a lens; this
   * order is a value you persist.
   *
   * Dragging runs on pointer events rather than HTML5 drag-and-drop, which
   * never fires on touch and gives no control over the drag image. Every drag
   * has a keyboard equivalent on the same handle.
   */
  interface Props extends HTMLAttributes<HTMLDivElement> {
    columns?: Column<Row>[];
    /** Bindable — a completed reorder writes the new order straight back. */
    rows?: Row[];
    /** Field used as the row identity. Must be unique, or rows jump on reorder. */
    rowKey?: string;
    disabled?: boolean;
    /** Names the row in the handle's label and in the live announcements. */
    rowLabel?: (row: Row, index: number) => string;
    onreorder?: (event: TableReorder<Row>) => void;
    /** Per-cell render override; falls back to the column's formatted value. */
    cell?: Snippet<[Row, Column<Row>]>;
    /** Trailing per-row controls — a delete button, a row menu. */
    rowActions?: Snippet<[Row, number]>;
    /** A <tr> (or several) for the totals, rendered in the table's <tfoot>. */
    footer?: Snippet;
    empty?: Snippet;
    emptyTitle?: string;
    emptyDescription?: string;
    class?: string;
  }

  let {
    columns = [],
    rows = $bindable([]),
    rowKey = 'id',
    disabled = false,
    rowLabel,
    onreorder,
    cell,
    rowActions,
    footer,
    empty,
    emptyTitle = 'No rows yet',
    emptyDescription = 'Add a line to get started.',
    class: className = '',
    ...restProps
  }: Props = $props();

  const instructionsId = $props.id();

  // $state, not plain arrays: `bind:this` into a non-reactive array doesn't
  // write back, which would leave the drag with no geometry to measure.
  let rowEls = $state<Array<HTMLTableRowElement | null>>([]);
  let handleEls = $state<Array<HTMLButtonElement | null>>([]);

  /** Pointer drag. */
  let dragIndex = $state<number | null>(null);
  let overIndex = $state<number | null>(null);
  let dragOffset = $state(0);
  let dragHeight = $state(0);

  /** Keyboard grab — a separate state, since it moves rows live rather than
      previewing a landing slot. */
  let grabIndex = $state<number | null>(null);
  let grabOrigin = 0;
  let orderAtGrab: Row[] = [];

  let announcement = $state('');

  let pointerStartY = 0;
  /** Row centres captured once at drag start; rows don't resize mid-drag. */
  let centers: number[] = [];

  let dragging = $derived(dragIndex !== null);
  let reorderable = $derived(!disabled && rows.length > 1);

  function labelFor(row: Row, index: number): string {
    if (rowLabel) return rowLabel(row, index);
    const lead = columns.find((c) => c.primary) ?? columns[0];
    const value = lead ? cellValue(row, lead) : null;
    return value === null || value === undefined || value === ''
      ? `Row ${index + 1}`
      : String(value);
  }

  function move(from: number, to: number) {
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    rows = next;
    onreorder?.({ from, to, rows: next });
    announcement = `${labelFor(next[to], to)} moved to position ${to + 1} of ${next.length}.`;
  }

  /* ── Pointer ─────────────────────────────────────────────────────────── */

  function handlePointerDown(e: PointerEvent, index: number) {
    if (!reorderable) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // A keyboard grab and a drag would fight over the same row.
    if (grabIndex !== null) grabIndex = null;

    const handle = e.currentTarget as HTMLButtonElement;
    // Capture keeps the move/up events coming to the handle even when the
    // pointer outruns the row. Not worth failing the drag over if it's refused.
    try {
      handle.setPointerCapture(e.pointerId);
    } catch {
      /* no capture available — the drag still tracks, it just won't follow
         the pointer outside the element */
    }

    centers = rowEls.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0));
    dragHeight = rowEls[index]?.offsetHeight ?? 0;
    pointerStartY = e.clientY;
    dragOffset = 0;
    dragIndex = index;
    overIndex = index;

    // Stop the press from also selecting text or starting a native drag.
    e.preventDefault();
  }

  function handlePointerMove(e: PointerEvent) {
    if (dragIndex === null) return;
    dragOffset = e.clientY - pointerStartY;

    // Walk out from the origin, comparing the lifted row's centre against the
    // resting centres of its neighbours. Comparing against original positions
    // is what keeps the landing slot stable while rows slide out of the way.
    const center = centers[dragIndex] + dragOffset;
    let target = dragIndex;
    while (target > 0 && center < centers[target - 1]) target--;
    while (target < rows.length - 1 && center > centers[target + 1]) target++;
    overIndex = target;
  }

  function handlePointerUp(e: PointerEvent) {
    if (dragIndex === null) return;
    const handle = e.currentTarget as HTMLButtonElement;
    try {
      if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
    } catch {
      /* nothing to release */
    }

    const from = dragIndex;
    const to = overIndex;
    dragIndex = null;
    overIndex = null;
    dragOffset = 0;
    if (to !== null && from !== to) move(from, to);
  }

  function handlePointerCancel() {
    dragIndex = null;
    overIndex = null;
    dragOffset = 0;
  }

  /* ── Keyboard ────────────────────────────────────────────────────────── */

  /**
   * Moving a row relocates its DOM node, and the browser blurs the focused
   * handle on the way. This flag tells `handleBlur` that the blur is the
   * reorder's own doing and focus is about to come back — without it, one
   * arrow press silently drops the row.
   */
  let refocusing = false;

  async function refocus(index: number) {
    refocusing = true;
    await tick();
    handleEls[index]?.focus();
    refocusing = false;
  }

  function grab(index: number) {
    grabIndex = index;
    grabOrigin = index;
    orderAtGrab = [...rows];
    announcement =
      `${labelFor(rows[index], index)} grabbed, position ${index + 1} of ${rows.length}. ` +
      'Use the arrow keys to move it, Enter or Space to drop, Escape to cancel.';
  }

  function drop() {
    if (grabIndex === null) return;
    announcement = `Dropped at position ${grabIndex + 1} of ${rows.length}.`;
    grabIndex = null;
  }

  function cancelGrab() {
    if (grabIndex === null) return;
    const from = grabIndex;
    rows = orderAtGrab;
    onreorder?.({ from, to: grabOrigin, rows: orderAtGrab });
    announcement = `Move cancelled, back at position ${grabOrigin + 1}.`;
    grabIndex = null;
    refocus(grabOrigin);
  }

  function handleKeyDown(e: KeyboardEvent, index: number) {
    if (!reorderable) return;

    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (grabIndex === null) grab(index);
      else drop();
      return;
    }

    if (grabIndex === null) return;

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const to = e.key === 'ArrowUp' ? grabIndex - 1 : grabIndex + 1;
      if (to < 0 || to >= rows.length) return;
      move(grabIndex, to);
      grabIndex = to;
      refocus(to);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelGrab();
    }
  }

  /** Leaving the handle drops where the row currently is, rather than
      stranding an invisible grab on an unfocused control. */
  function handleBlur() {
    if (refocusing) return; // the reorder's own blur, not a departure
    if (grabIndex !== null) drop();
  }

  /* ── Rendering ───────────────────────────────────────────────────────── */

  /**
   * Rows between the origin and the landing slot slide one row-height out of
   * the way; the lifted row follows the pointer. Transforms only — nothing
   * reflows, so the geometry captured at drag start stays valid.
   */
  function rowTransform(index: number): string | undefined {
    if (dragIndex === null || overIndex === null) return undefined;
    if (index === dragIndex) return `transform: translateY(${dragOffset}px)`;
    if (overIndex > dragIndex && index > dragIndex && index <= overIndex) {
      return `transform: translateY(${-dragHeight}px)`;
    }
    if (overIndex < dragIndex && index >= overIndex && index < dragIndex) {
      return `transform: translateY(${dragHeight}px)`;
    }
    return undefined;
  }
</script>

<div class="reorderable-wrapper {className}" class:dragging {...restProps}>
  <span class="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
  <span class="sr-only" id={instructionsId}>
    Press Enter or Space to pick the row up, then the arrow keys to move it.
  </span>

  <table class="reorderable-table">
    <thead>
      <tr>
        <!-- No sortable headers here on purpose: see the note on Props. -->
        <th class="handle-col"><span class="sr-only">Reorder</span></th>
        {#each columns as col (col.key)}
          <th
            class:num={col.type === 'numeric'}
            class:col-active={col.active}
            style={col.width ? `width: ${col.width}` : undefined}
          >
            {col.label}
          </th>
        {/each}
        {#if rowActions}
          <th class="actions-col"><span class="sr-only">Actions</span></th>
        {/if}
      </tr>
    </thead>

    <tbody>
      {#each rows as row, index (rowId(row, rowKey, index))}
        <tr
          bind:this={rowEls[index]}
          class:lifted={dragIndex === index}
          class:grabbed={grabIndex === index}
          style={rowTransform(index)}
        >
          <td class="handle-col">
            <button
              type="button"
              class="handle"
              bind:this={handleEls[index]}
              disabled={!reorderable}
              aria-label={`Reorder ${labelFor(row, index)}`}
              aria-describedby={instructionsId}
              aria-pressed={grabIndex === index}
              onpointerdown={(e) => handlePointerDown(e, index)}
              onpointermove={handlePointerMove}
              onpointerup={handlePointerUp}
              onpointercancel={handlePointerCancel}
              onkeydown={(e) => handleKeyDown(e, index)}
              onblur={handleBlur}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="6" r="1.4" />
                <circle cx="15" cy="6" r="1.4" />
                <circle cx="9" cy="12" r="1.4" />
                <circle cx="15" cy="12" r="1.4" />
                <circle cx="9" cy="18" r="1.4" />
                <circle cx="15" cy="18" r="1.4" />
              </svg>
            </button>
          </td>

          {#each columns as col (col.key)}
            <TableCell
              type={col.type ?? 'text'}
              active={col.active}
              negative={isNegative(row, col)}
            >
              {#if cell}
                {@render cell(row, col)}
              {:else}
                {cellValue(row, col)}
              {/if}
            </TableCell>
          {/each}

          {#if rowActions}
            <td class="actions-col">{@render rowActions(row, index)}</td>
          {/if}
        </tr>
      {/each}
    </tbody>

    {#if footer && rows.length > 0}
      <tfoot>
        {@render footer()}
      </tfoot>
    {/if}
  </table>

  {#if rows.length === 0}
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
  .reorderable-wrapper {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .reorderable-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .reorderable-wrapper::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  /* Text selection during a drag turns the whole table blue. */
  .reorderable-wrapper.dragging {
    user-select: none;
    cursor: grabbing;
  }

  /* `separate`, not `collapse`: a collapsed table hands its row borders to the
     table itself, and a transformed <tr> then leaves its border behind. Cells
     carry the rule instead. */
  .reorderable-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
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

  /* Two table-row quirks, both found in the browser rather than in tests:
     a <tr> only honours `transform` once it has a positioning context, and
     Chrome refuses to *transition* transform on `display: table-row` at all —
     the value simply never leaves its start. So rows snap to their new slot
     instead of gliding, which the house style allows for persistent elements.
     The dragged row must not transition regardless: it tracks the pointer. */
  tbody tr {
    background: var(--canvas);
    position: relative;
  }

  tbody :global(td) {
    border-bottom: 1px solid var(--line-soft);
  }

  /* The one place a shadow is allowed: the row is genuinely off the paper. */
  tbody tr.lifted {
    z-index: var(--z-sticky);
    box-shadow: var(--shadow-drag);
  }

  tbody tr.lifted :global(td),
  tbody tr.grabbed :global(td) {
    background: var(--raised);
  }

  tbody tr.grabbed :global(td:first-child) {
    border-left: 1.5px solid var(--accent);
  }

  .handle-col {
    width: 36px;
    padding: 0;
    text-align: center;
  }

  .actions-col {
    width: 48px;
    padding: 0 8px;
    text-align: right;
  }

  .handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    /* transparent-border box model: the focus ring costs no pixels */
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    background: transparent;
    color: var(--text-3);
    cursor: grab;
    /* without this a touch-drag scrolls the page instead */
    touch-action: none;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  @media (hover: hover) {
    .handle:hover:not(:disabled) {
      background: var(--wash);
      color: var(--text-1);
    }
  }

  .handle:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .handle[aria-pressed='true'] {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
    color: var(--text-1);
  }

  .handle:disabled {
    opacity: 0.35;
    cursor: default;
  }

  tr.lifted .handle {
    cursor: grabbing;
  }

  .handle svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .table-state {
    padding: 32px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--text-3);
  }

  /* A drag handle is a hit target before it is a glyph. */
  @media (pointer: coarse) {
    .handle-col {
      width: 44px;
    }

    .handle {
      width: 44px;
      height: 44px;
    }
  }
</style>
