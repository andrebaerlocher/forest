<script lang="ts" generics="Row extends object = Record<string, unknown>">
  import { type Snippet, tick } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import TableCell from '../atoms/TableCell.svelte';
  import { isPhone } from '../breakpoints.svelte.js';
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
    /**
     * A <tr> (or several) for the totals, rendered in the table's <tfoot>.
     * Table-shaped: `footer`'s whole contract is producing <tr>/<td>, and
     * those elements only have a layout to sit in inside a table's row
     * groups. Below the shell breakpoint the table itself is `display: none`
     * (see `cards` and the card media query below) and the phone card list is
     * a <ul>, not a table — so `footer` never appears there. One snippet
     * can't cover both: a <tr> rendered into a <li> or after </ul> still
     * lands in the DOM (Svelte builds elements directly, it doesn't parse
     * HTML text, so nothing gets silently dropped the way it would via
     * `innerHTML`), but it arrives as an orphan table-row with no table to
     * size its columns against and none of the card styling below — a
     * broken-looking row, not a real totals line. See `cardFooter`.
     */
    footer?: Snippet;
    /**
     * Free-form block content for the totals line at the end of the phone
     * card list — `footer`'s card-shaped counterpart, needed for exactly the
     * reason described on `footer`: table markup has nowhere valid to lay
     * out once the table is hidden. Renders inside `.card-footer`, which
     * already carries the border-top separator and `--font-data` size the
     * cards use; give a numeric figure `class="num"` for the same
     * `--font-num` / tabular-nums / right-aligned treatment `.card-value.num`
     * gives the fields above it, so the digits line up.
     * A consumer who passes only `footer` still gets no totals on a phone —
     * the same silence as before this prop existed, not a new regression —
     * so pass both when the totals need to survive the breakpoint.
     */
    cardFooter?: Snippet;
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
    cardFooter,
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

  /* ── Phone: buttons instead of a handle ─────────────────────────────
   * Drag already works on touch, but a thumb has no good way to see or
   * reach a destination off the bottom of the screen. Below the shell
   * breakpoint the handle gives way to a card with explicit move-up/
   * move-down buttons that call the same `move()` above — the mutation
   * and the announcement are identical to the keyboard path, only the
   * trigger differs.
   */
  const phone = isPhone();
  let cards = $derived(phone.current && rows.length > 0);

  let leadColumn = $derived(columns.find((c) => c.primary) ?? columns[0]);
  let restColumns = $derived(columns.filter((c) => c !== leadColumn));

  let moveUpEls = $state<Array<HTMLButtonElement | null>>([]);
  let moveDownEls = $state<Array<HTMLButtonElement | null>>([]);

  /**
   * Moving a row relocates its keyed DOM node, and the browser drops focus
   * on the way — the same quirk `refocus` works around for the keyboard
   * grab above. Refocusing the button in the same direction keeps repeated
   * taps landing on a live control; at an edge, where that button is now
   * disabled, the row's other button is still reachable.
   */
  async function moveRow(index: number, direction: -1 | 1) {
    const to = index + direction;
    if (to < 0 || to >= rows.length) return;
    move(index, to);
    await tick();
    const primary = direction === -1 ? moveUpEls : moveDownEls;
    const secondary = direction === -1 ? moveDownEls : moveUpEls;
    const target = primary[to] && !primary[to]?.disabled ? primary[to] : secondary[to];
    target?.focus();
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

  {#if cards}
    <!-- Safari drops list semantics when list-style is none, so the role
         is explicit — the same fix DataTable's card mode uses. -->
    <!-- biome-ignore lint/a11y/noRedundantRoles: redundant per spec, but
    Safari drops list semantics from a ul with list-style: none. -->
    <ul class="card-list" role="list">
      {#each rows as row, index (rowId(row, rowKey, index))}
        <li class="row-card">
          <div class="card-head">
            <span class="card-title">{labelFor(row, index)}</span>
          </div>

          <dl class="card-fields">
            {#each restColumns as col (col.key)}
              <dt class="card-label">{col.label}</dt>
              <dd class="card-value" class:num={col.type === 'numeric'} class:neg={isNegative(row, col)}>
                {#if cell}
                  {@render cell(row, col)}
                {:else}
                  {cellValue(row, col)}
                {/if}
              </dd>
            {/each}
          </dl>

          <div class="card-actions">
            <button
              type="button"
              class="move-btn"
              bind:this={moveUpEls[index]}
              disabled={!reorderable || index === 0}
              aria-label={`Move ${labelFor(row, index)} up`}
              onclick={() => moveRow(index, -1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6 5 15h14z" /></svg>
            </button>
            <button
              type="button"
              class="move-btn"
              bind:this={moveDownEls[index]}
              disabled={!reorderable || index === rows.length - 1}
              aria-label={`Move ${labelFor(row, index)} down`}
              onclick={() => moveRow(index, 1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18 5 9h14z" /></svg>
            </button>
            {#if rowActions}
              {@render rowActions(row, index)}
            {/if}
          </div>
        </li>
      {/each}
    </ul>

    <!-- Deliberately a sibling of <ul>, not a final <li> inside it: every
         <li> above carries move buttons and is counted in the list's
         announced size ("list, N items"), so a totals row appended the same
         way would read as just another — unreorderable, button-less — item
         of N. Keeping it outside the list mirrors the table's own tbody/
         tfoot split: the totals sit next to the rows, not among them. -->
    {#if cardFooter && rows.length > 0}
      <!-- rows.length > 0 is already implied by `cards` above; kept anyway
           to mirror the desktop gate on `footer` below. -->
      <div class="card-footer">
        {@render cardFooter()}
      </div>
    {/if}
  {/if}

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

  /* Base isolated-control box, shared with .move-btn below: same
     transparent-border model, same colour and hover/focus behaviour — only
     the size and the drag-specific bits differ. */
  .handle,
  .move-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    background: transparent;
    color: var(--text-3);
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  .handle {
    width: 28px;
    height: 28px;
    cursor: grab;
    /* without this a touch-drag scrolls the page instead */
    touch-action: none;
  }

  /* Shared with .move-btn below: same isolated-control treatment, whether
     the control drags or just relocates the row by one. */
  @media (hover: hover) {
    .handle:hover:not(:disabled),
    .move-btn:hover:not(:disabled) {
      background: var(--wash);
      color: var(--text-1);
    }
  }

  .handle:focus-visible,
  .move-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .handle[aria-pressed='true'] {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
    color: var(--text-1);
  }

  .handle:disabled,
  .move-btn:disabled {
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

  /* ── Card mode ──────────────────────────────────────────────────────
     Below the shell breakpoint the row order is still the data, but a
     drag handle gives way to move-up/move-down buttons — see the note
     by `cards` above. Field layout mirrors DataTable's own card mode:
     the lead column becomes the title, everything else is a label/value
     pair, because both tables are answering the same question ("what is
     this row, off its column headers"). */

  /* The table exists for one frame after hydration on a phone (mediaQuery
     is false during SSR and the first client render) — same reasoning as
     DataTable's identical note. Keep it from painting a fixed-layout
     table at 390px. */
  @media (max-width: 760px) {
    .reorderable-wrapper > .reorderable-table {
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
    /* transparent-border box model: nothing shifts when a state ring arrives */
    border: 1.5px solid transparent;
    border-bottom-color: var(--line-soft);
    border-radius: var(--radius-s);
    padding: 12px 14px;
    background: transparent;
    /* no shadow — a card is a persistent surface */
  }

  .card-head {
    margin-bottom: 8px;
  }

  .card-title {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
  }

  .card-fields {
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
    gap: 4px 16px;
    margin: 0 0 12px;
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

  .card-value.num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-1);
  }

  .card-value.neg {
    color: var(--danger);
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--line-soft);
  }

  /* Totals line, sibling of .card-list — see the comment at the markup.
     Sized and coloured like the fields above it (.card-value's own
     --font-data/--text-2), right-aligned by default since a totals line
     conventionally reads as "label ... value" flush to the card's edge. */
  .card-footer {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--line-soft);
    font-size: var(--font-data);
    color: var(--text-2);
    text-align: right;
  }

  /* `:global` because this content is authored in the consumer's own snippet,
     not in this file — Svelte scopes selectors to the component that wrote
     the markup, so a plain `.num` here would never match. Same convention as
     `.card-value.num` above: give the figure this class to get the tabular,
     right-aligned treatment its digits need to line up with the fields. */
  .card-footer :global(.num) {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-1);
  }

  .move-btn {
    width: 32px;
    height: 32px;
  }

  /* The base box, plus :hover, :focus-visible and :disabled, are shared
     with .handle above. */

  .move-btn svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  /* A button is a hit target before it is a glyph — same contract the
     drag handle follows above. */
  @media (pointer: coarse) {
    .move-btn {
      width: 44px;
      height: 44px;
    }
  }
</style>
