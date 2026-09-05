<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  type DateField = 'day' | 'month' | 'year';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /**
     * ISO date string, YYYY-MM-DD, or '' for empty.
     *
     * Always ISO, whatever the locale — the field *displays* `14.08.2026` in
     * `de-CH` but the bound value stays sortable and storable.
     */
    value?: string;
    /** Defaults to the locale's own pattern — `DD.MM.YYYY` for Switzerland. */
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** Drives the display format, month names and weekday names. */
    locale?: string;
    /**
     * Weekday heading width. `narrow` is one letter, which is ambiguous in
     * German — Montag and Mittwoch are both "M". `short` gives Mo/Di/Mi.
     */
    weekdayFormat?: 'narrow' | 'short';
    onchange?: (value: string) => void;
    class?: string;
  }

  let {
    value = $bindable(''),
    placeholder,
    disabled = false,
    invalid = false,
    locale = 'de-CH',
    weekdayFormat = 'short',
    onchange,
    class: className = '',
    ...restProps
  }: Props = $props();

  let isOpen = $state(false);
  let rootEl: HTMLElement | null = $state(null);

  function parseISO(s: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function toISO(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  let selected = $derived(parseISO(value));

  // The month the grid is showing. Follows the selection, else today.
  let cursor = $state(parseISO(value) ?? new Date());

  $effect(() => {
    const parsed = parseISO(value);
    if (parsed) cursor = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
  });

  /* ── Locale ──────────────────────────────────────────────────────────────
     Field order and separator are read out of Intl rather than kept in a
     table of locales, so `de-CH` gives 14.08.2026, `fr-CH` 14/08/2026 and
     `en-CA` 2026-08-14 without this component knowing any of them by name.
     The same pattern drives formatting, parsing and the placeholder, so the
     three can't drift apart. */
  let pattern = $derived.by(() => {
    const fallback = { order: ['day', 'month', 'year'] as DateField[], separator: '.' };
    try {
      const parts = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(new Date(2026, 7, 14));
      const order = parts
        .filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year')
        .map((p) => p.type as DateField);
      if (order.length !== 3) return fallback;
      const literal = parts.find((p) => p.type === 'literal')?.value.trim();
      return { order, separator: literal || '.' };
    } catch {
      return fallback;
    }
  });

  let patternHint = $derived(
    pattern.order
      .map((f) => (f === 'year' ? 'YYYY' : f === 'month' ? 'MM' : 'DD'))
      .join(pattern.separator)
  );

  function formatDisplay(iso: string): string {
    const d = parseISO(iso);
    if (!d) return iso; // not a date yet — show whatever is there
    const p = (n: number) => String(n).padStart(2, '0');
    const fields: Record<DateField, string> = {
      day: p(d.getDate()),
      month: p(d.getMonth() + 1),
      year: String(d.getFullYear())
    };
    return pattern.order.map((f) => fields[f]).join(pattern.separator);
  }

  /** Two-digit years: 70–99 are last century, everything else this one. */
  function expandYear(year: number): number {
    if (year >= 100) return year;
    return year >= 70 ? 1900 + year : 2000 + year;
  }

  function buildISO(year: number, month: number, day: number): string | null {
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    const d = new Date(year, month - 1, day);
    // Round-trip check: Date silently rolls 31.02 over into March.
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
      return null;
    }
    return toISO(d);
  }

  /** `14082026` / `140826` — entering a date without reaching for separators. */
  function splitCompact(digits: string): string[] | null {
    const yearWidth = digits.length - 4;
    if (yearWidth !== 2 && yearWidth !== 4) return null;
    const out: string[] = [];
    let offset = 0;
    for (const field of pattern.order) {
      const width = field === 'year' ? yearWidth : 2;
      out.push(digits.slice(offset, offset + width));
      offset += width;
    }
    return out;
  }

  /** ISO string, '' for an empty field, or null when it isn't a date at all. */
  function parseDisplay(text: string): string | null {
    const trimmed = text.trim();
    if (!trimmed) return '';

    // ISO parses in every locale — it's the format `value` itself holds.
    const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed);
    if (iso) return buildISO(Number(iso[1]), Number(iso[2]), Number(iso[3]));

    const groups = /^\d{6}$|^\d{8}$/.test(trimmed)
      ? splitCompact(trimmed)
      : trimmed.split(/\D+/).filter(Boolean);
    if (groups?.length !== 3) return null;

    const at = (f: DateField) => Number(groups[pattern.order.indexOf(f)]);
    return buildISO(expandYear(at('year')), at('month'), at('day'));
  }

  /* ── Typed entry ─────────────────────────────────────────────────────────
     While the field holds a draft it shows the raw text; otherwise it shows
     the formatted value. A draft that doesn't parse is *kept* and flagged
     rather than discarded, so a typo can be corrected instead of retyped. */
  let hasDraft = $state(false);
  let draft = $state('');
  let parseFailed = $state(false);

  let display = $derived(hasDraft ? draft : formatDisplay(value));
  let showsInvalid = $derived(invalid || parseFailed);

  function clearDraft() {
    hasDraft = false;
    draft = '';
    parseFailed = false;
  }

  function commitText() {
    if (!hasDraft) return;
    const parsed = parseDisplay(draft);
    if (parsed === null) {
      parseFailed = true;
      return;
    }
    clearDraft();
    if (parsed !== value) {
      value = parsed;
      onchange?.(parsed);
    }
  }

  let monthLabel = $derived(
    cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  );

  // Monday-first weekday initials, derived from the locale rather than
  // hardcoded. Monday is correct for Switzerland and the rest of the
  // de/fr/it-CH world; Intl exposes no portable first-day-of-week.
  let weekdays = $derived.by(() => {
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: weekdayFormat });
    });
  });

  let days = $derived.by(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    // Monday = 0
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ key: string; date: Date | null }> = [];
    for (let i = 0; i < lead; i++) cells.push({ key: `pad-${i}`, date: null });
    for (let d = 1; d <= count; d++) {
      const date = new Date(year, month, d);
      cells.push({ key: toISO(date), date });
    }
    return cells;
  });

  let todayISO = toISO(new Date());

  function pick(date: Date) {
    clearDraft();
    value = toISO(date);
    onchange?.(value);
    isOpen = false;
  }

  function shiftMonth(delta: number) {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
  }

  function handleInput(e: Event) {
    draft = (e.currentTarget as HTMLInputElement).value;
    hasDraft = true;
    parseFailed = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      clearDraft();
      isOpen = false;
    } else if (e.key === 'Enter') {
      commitText();
      if (!parseFailed) isOpen = false;
    }
  }

  function handleFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && rootEl?.contains(next)) return;
    isOpen = false;
  }
</script>

<div
  class="datepicker {className}"
  bind:this={rootEl}
  onfocusout={handleFocusOut}
  {...restProps}
>
  <input
    class="date-input"
    class:invalid={showsInvalid}
    type="text"
    inputmode="numeric"
    autocomplete="off"
    spellcheck="false"
    placeholder={placeholder ?? patternHint}
    {disabled}
    aria-invalid={showsInvalid ? 'true' : undefined}
    value={display}
    oninput={handleInput}
    onfocus={() => (isOpen = true)}
    onblur={commitText}
    onkeydown={handleKeyDown}
  />

  {#if isOpen && !disabled}
    <div class="calendar" role="dialog" aria-label="Choose date">
      <div class="cal-head">
        <button type="button" class="nav" onclick={() => shiftMonth(-1)} aria-label="Previous month">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
        </button>
        <span class="month-label">{monthLabel}</span>
        <button type="button" class="nav" onclick={() => shiftMonth(1)} aria-label="Next month">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>

      <div class="cal-grid" role="grid">
        {#each weekdays as wd, i (i)}
          <span class="weekday">{wd}</span>
        {/each}
        {#each days as cell (cell.key)}
          {#if cell.date}
            <button
              type="button"
              class="day"
              class:selected={selected && toISO(cell.date) === toISO(selected)}
              class:today={toISO(cell.date) === todayISO}
              onclick={() => cell.date && pick(cell.date)}
            >
              {cell.date.getDate()}
            </button>
          {:else}
            <span class="day-pad"></span>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .datepicker {
    position: relative;
    display: inline-flex;
    font-family: var(--font-body);
  }

  .date-input {
    width: 100%;
    min-width: 150px;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 14px;
    color: var(--text-1);
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: var(--pad-control-y) 12px;
    transition: border-color var(--t-fast) var(--ease);
  }

  .date-input::placeholder {
    color: var(--text-3);
    font-family: var(--font-body);
  }

  .date-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .date-input.invalid {
    border-color: var(--danger);
  }

  .date-input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .calendar {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: var(--z-drawer);
    padding: 12px;
    background: var(--raised);
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
  }

  .cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }

  .month-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-1);
  }

  .nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1.5px solid transparent;
    border-radius: 50%;
    background: transparent;
    color: var(--text-2);
    cursor: pointer;
    transition: background var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover on touch would leave the nav chevron looking
     permanently pressed. */
  @media (hover: hover) {
    .nav:hover {
      background: var(--wash);
    }
  }

  .nav:focus-visible,
  .day:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .nav svg {
    width: 12px;
    height: 12px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 30px);
    gap: 2px;
  }

  .weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    /* `short` weekdays run to three characters in some locales */
    overflow: hidden;
  }

  .day,
  .day-pad {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    border-radius: var(--radius-s);
  }

  .day {
    border: 1.5px solid transparent;
    background: transparent;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 12.5px;
    color: var(--text-1);
    cursor: pointer;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover on touch would leave a day looking selected. */
  @media (hover: hover) {
    .day:hover {
      background: var(--wash);
    }
  }

  .day.today {
    border-color: var(--line-mid);
  }

  .day.selected {
    background: var(--cell-sel-bg);
    border-color: var(--cell-sel-border);
  }
  /* A calendar IS a grid of hit targets, so here the visual grows — 44px
     squares are what a calendar looks like on a phone.
     7 x 44 + 6 x 2 gap = 320px; fits 390px minus the popover's padding. */
  @media (pointer: coarse) {
    .nav {
      width: 44px;
      height: 44px;
    }

    .cal-grid {
      grid-template-columns: repeat(7, 44px);
    }

    .day,
    .day-pad {
      height: 44px;
    }
  }
</style>
