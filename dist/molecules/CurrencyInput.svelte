<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import {
    type CurrencyDisplay,
    currencyAffix,
    formatMoney,
    getSeparators,
    parseMoney,
    roundToStep
  } from '../money.js';

  interface Props
    extends Omit<
      HTMLInputAttributes,
      'value' | 'onchange' | 'oninput' | 'type' | 'min' | 'max' | 'step'
    > {
    /** The amount in major units — francs, not rappen. `null` is an empty field. */
    value?: number | null;
    locale?: string;
    currency?: string;
    /** How the currency reads in the affix. `'none'` drops the affix. */
    currencyDisplay?: CurrencyDisplay;
    fractionDigits?: number;
    /**
     * Rounding applied when the field commits. Pass `CHF_CASH_STEP` (0.05) for
     * Swiss cash rounding; 0 rounds to `fractionDigits` alone. It also sets the
     * arrow-key increment.
     */
    roundingStep?: number;
    min?: number | null;
    max?: number | null;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    placeholder?: string;
    /** Name of the hidden field that carries the canonical number into a form post. */
    name?: string;
    /** Fires on commit (blur or Enter) with the parsed, clamped, rounded amount. */
    onchange?: (value: number | null) => void;
    class?: string;
  }

  let {
    value = $bindable(null),
    locale = 'de-CH',
    currency = 'CHF',
    currencyDisplay = 'code',
    fractionDigits = 2,
    roundingStep = 0,
    min = null,
    max = null,
    disabled = false,
    readonly = false,
    invalid = false,
    placeholder,
    name,
    onchange,
    class: className = '',
    ...restProps
  }: Props = $props();

  const affixId = $props.id();

  /**
   * At rest the field shows the grouped amount (`1'234.50`). On focus it swaps
   * to an ungrouped draft, because editing text with separators in it means
   * fighting the caret. The draft is only ever read on commit.
   */
  let editing = $state(false);
  let draft = $state('');

  let separators = $derived(getSeparators(locale));
  let affix = $derived(currencyAffix({ locale, currency, currencyDisplay }));
  let formatted = $derived(
    formatMoney(value, { locale, fractionDigits, currencyDisplay: 'none' })
  );
  let shown = $derived(editing ? draft : formatted);
  let negative = $derived(typeof value === 'number' && value < 0);
  let placeholderText = $derived(
    placeholder ?? formatMoney(0, { locale, fractionDigits, currencyDisplay: 'none' })
  );

  function toDraft(amount: number | null): string {
    if (amount === null || amount === undefined || !Number.isFinite(amount)) return '';
    return amount.toFixed(fractionDigits).replace('.', separators.decimal);
  }

  function clampAndRound(amount: number): number {
    let out = roundToStep(amount, roundingStep, fractionDigits);
    if (typeof min === 'number' && out < min) out = roundToStep(min, roundingStep, fractionDigits);
    if (typeof max === 'number' && out > max) out = roundToStep(max, roundingStep, fractionDigits);
    return out;
  }

  function commit() {
    const parsed = parseMoney(draft, { locale });
    const next = parsed === null ? null : clampAndRound(parsed);
    editing = false;
    draft = '';
    if (next !== value) {
      value = next;
      onchange?.(next);
    }
  }

  function nudge(direction: 1 | -1) {
    if (disabled || readonly) return;
    const increment = roundingStep > 0 ? roundingStep : 1;
    const base = editing ? (parseMoney(draft, { locale }) ?? 0) : (value ?? 0);
    draft = toDraft(clampAndRound(base + direction * increment));
    editing = true;
  }

  function handleFocus() {
    if (disabled || readonly) return;
    draft = toDraft(value);
    editing = true;
  }

  function handleInput(e: Event) {
    draft = (e.currentTarget as HTMLInputElement).value;
  }

  function handleBlur() {
    if (editing) commit();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      // Not preventDefault'd blindly: inside a form, Enter should still submit
      // once the amount has settled.
      if (editing) commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      editing = false;
      draft = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nudge(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nudge(-1);
    }
  }
</script>

<div
  class="currency-input {className}"
  class:disabled
  class:invalid
  class:readonly
  class:affix-after={affix.side === 'after'}
>
  {#if currencyDisplay !== 'none'}
    <span class="affix" id={affixId}>{affix.text}</span>
  {/if}

  <input
    class="amount"
    class:neg={negative}
    type="text"
    inputmode="decimal"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    value={shown}
    placeholder={placeholderText}
    {disabled}
    {readonly}
    aria-invalid={invalid ? 'true' : undefined}
    aria-describedby={currencyDisplay !== 'none' ? affixId : undefined}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
    {...restProps}
  />

  {#if name}
    <!-- The visible field is locale text; this is what a form post carries. -->
    <input type="hidden" {name} value={value ?? ''} />
  {/if}
</div>

<style>
  /* The border lives on the wrapper so the affix sits inside the control and
     the focus ring wraps both. Transparent-border box model still applies:
     the border is always 1.5px, only its colour changes. */
  .currency-input {
    display: inline-flex;
    align-items: stretch;
    width: 100%;
    font-family: var(--font-body);
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    transition:
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  .currency-input:focus-within {
    border-color: var(--accent);
  }

  .currency-input.invalid {
    border-color: var(--danger);
  }

  .currency-input.disabled {
    opacity: 0.45;
  }

  .currency-input.affix-after {
    flex-direction: row-reverse;
  }

  /* A label, not a control: the code is fixed for the field's lifetime. */
  .affix {
    display: flex;
    align-items: center;
    padding: var(--pad-control-y) 0 var(--pad-control-y) 12px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    white-space: nowrap;
    user-select: none;
  }

  .currency-input.affix-after .affix {
    padding: var(--pad-control-y) 12px var(--pad-control-y) 0;
  }

  .amount {
    flex: 1;
    min-width: 0;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 14px;
    text-align: right;
    color: var(--text-1);
    background: transparent;
    border: none;
    border-radius: var(--radius-s);
    padding: var(--pad-control-y) 12px;
  }

  .amount:focus {
    outline: none;
  }

  .amount::placeholder {
    color: var(--text-3);
  }

  /* A credit reads as a credit — the same ink TableCell gives a negative. */
  .amount.neg {
    color: var(--danger);
  }

  .amount:disabled {
    cursor: not-allowed;
  }

  /* Firefox/Chrome still paint spinners if a consumer overrides the type */
  .amount::-webkit-outer-spin-button,
  .amount::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }
</style>
