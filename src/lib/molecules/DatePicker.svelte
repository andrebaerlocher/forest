<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /** ISO date string, YYYY-MM-DD, or '' for empty */
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** Locale used for month and weekday names */
    locale?: string;
    onchange?: (value: string) => void;
    class?: string;
  }

  let {
    value = $bindable(''),
    placeholder = 'YYYY-MM-DD',
    disabled = false,
    invalid = false,
    locale = 'en-GB',
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

  let monthLabel = $derived(
    cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  );

  // Monday-first weekday initials, derived from the locale rather than hardcoded
  let weekdays = $derived.by(() => {
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'narrow' });
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
    value = toISO(date);
    onchange?.(value);
    isOpen = false;
  }

  function shiftMonth(delta: number) {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
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
    class:invalid
    type="text"
    inputmode="numeric"
    {placeholder}
    {disabled}
    aria-invalid={invalid}
    bind:value
    onfocus={() => (isOpen = true)}
    onkeydown={(e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        isOpen = false;
      }
    }}
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

  .nav:hover {
    background: var(--wash);
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

  .day:hover {
    background: var(--wash);
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
