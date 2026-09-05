<script lang="ts" generics="T = unknown">
  import type { Snippet } from 'svelte';
  import type { HTMLTdAttributes } from 'svelte/elements';
  import TableCell from '../atoms/TableCell.svelte';

  interface Props extends HTMLTdAttributes {
    value?: T; // Bindable!
    type?: 'text' | 'numeric';
    decimals?: number; // Decimals for numeric columns (e.g., 1 for kg, 2 for price)
    active?: boolean;
    negative?: boolean;
    selected?: boolean;
    readonly?: boolean;
    class?: string;
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    value = $bindable(),
    type = 'text',
    decimals = 2,
    active = false,
    negative = false,
    selected = false,
    readonly = false,
    class: className = '',
    children,
    onclick,
    ...restProps
  }: Props = $props();

  let editing = $state(false);
  let localValue = $state('');
  let integerPart = $state('');
  let decimalPart = $state('');
  let originalValue = $state<T | null>(null);
  let seeded = $state(false); // edit began by typing a character into the cell

  let tdEl: HTMLTableCellElement | null = $state(null);
  let editorEl: HTMLElement | null = $state(null);
  let inputEl: HTMLInputElement | null = $state(null);
  let integerInputEl: HTMLInputElement | null = $state(null);
  let decimalInputEl: HTMLInputElement | null = $state(null);

  // Helper to split a float into integer and decimal string parts
  function splitValue(val: number, decs: number): { integer: string; decimal: string } {
    if (val === undefined || val === null || Number.isNaN(val)) {
      return { integer: '0', decimal: '0'.repeat(decs) };
    }
    const fixedStr = val.toFixed(decs);
    const dotIdx = fixedStr.indexOf('.');
    if (dotIdx === -1) {
      return { integer: fixedStr, decimal: '' };
    }
    return {
      integer: fixedStr.substring(0, dotIdx),
      decimal: fixedStr.substring(dotIdx + 1)
    };
  }

  // Synchronize editing state: if the cell loses selection externally, exit editing mode
  $effect(() => {
    if (!selected) {
      editing = false;
    }
  });

  // Focus and place the caret when entering edit mode
  $effect(() => {
    if (!editing) return;
    const el = type === 'numeric' ? integerInputEl : inputEl;
    if (!el) return;
    el.focus();
    if (seeded) {
      // typed-to-edit: caret sits after the seed character
      const len = el.value.length;
      el.setSelectionRange(len, len);
    } else {
      try {
        el.select();
      } catch {
        // Ignore if select not supported
      }
    }
  });

  function startEditing(seed?: string) {
    if (readonly) return;
    originalValue = value ?? null;
    seeded = seed !== undefined;
    if (type === 'numeric') {
      const parts = splitValue(Number(value) || 0, decimals);
      const seedIsNumeric = seed !== undefined && /[0-9-]/.test(seed);
      integerPart = seedIsNumeric ? seed : parts.integer;
      decimalPart = seedIsNumeric ? '0'.repeat(decimals) : parts.decimal;
    } else {
      localValue =
        seed !== undefined ? seed : value === undefined || value === null ? '' : String(value);
    }
    editing = true;
  }

  // Spreadsheet idiom: a click selects, it does not open the editor
  function handleCellClick(e: MouseEvent) {
    onclick?.(e);
    if (!editing) {
      tdEl?.focus();
    }
  }

  function handleCellDblClick() {
    startEditing();
  }

  function handleCellKeydown(e: KeyboardEvent) {
    if (editing || readonly) return; // the inner inputs own their keys while editing
    if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      startEditing();
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      startEditing(e.key);
    }
  }

  function commit() {
    if (!editing) return;
    if (type === 'numeric') {
      let intStr = integerPart;
      if (intStr === '' || intStr === '-') {
        intStr = intStr === '-' ? '-0' : '0';
      }
      let decStr = decimalPart;
      if (decStr === '') {
        decStr = '0';
      }
      const combinedStr = `${intStr}.${decStr}`;
      const parsed = parseFloat(combinedStr);
      value = (Number.isNaN(parsed) ? 0 : parsed) as unknown as T;
    } else {
      value = localValue as unknown as T;
    }
    editing = false;
    tdEl?.focus();
  }

  function cancel() {
    if (originalValue !== null) {
      value = originalValue;
    }
    editing = false;
    tdEl?.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  function handleIntegerKeydown(e: KeyboardEvent) {
    if (e.key === '.') {
      e.preventDefault();
      decimalInputEl?.focus();
      try {
        decimalInputEl?.select();
      } catch {
        // Ignore if select not supported
      }
    } else if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  function handleDecimalKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
      const cursorPosition = decimalInputEl?.selectionStart;
      if (cursorPosition === 0 || (e.key === 'Backspace' && decimalPart === '')) {
        e.preventDefault();
        integerInputEl?.focus();
        if (integerInputEl) {
          const len = integerPart.length;
          integerInputEl.setSelectionRange(len, len);
        }
      }
    } else if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  // focusout bubbles, so one handler covers both split inputs. Focus moving
  // between them stays inside the wrapper; anything else is a true blur.
  function handleFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && editorEl?.contains(next)) return;
    commit();
  }

  // The editor owns its keys. Without this, the Enter that commits would bubble
  // to handleCellKeydown — which by then sees editing === false and reopens the
  // editor immediately.
  function stopKeys(e: KeyboardEvent) {
    e.stopPropagation();
  }
</script>

<TableCell
  bind:element={tdEl}
  {type}
  {active}
  {negative}
  {selected}
  {editing}
  class={className}
  tabindex={selected ? 0 : -1}
  onclick={handleCellClick}
  ondblclick={handleCellDblClick}
  onkeydown={handleCellKeydown}
  {...restProps}
>
  {#if editing}
    <!-- purely structural: the inputs inside carry the semantics -->
    <div
      class="cell-editor"
      role="presentation"
      bind:this={editorEl}
      onfocusout={handleFocusOut}
      onkeydown={stopKeys}
    >
      {#if type === 'numeric'}
        <div class="split-input-wrapper">
          <input
            bind:this={integerInputEl}
            type="text"
            bind:value={integerPart}
            class="part-integer"
            onkeydown={handleIntegerKeydown}
            aria-label="Integer part"
          />
          <span class="dot-separator">.</span>
          <input
            bind:this={decimalInputEl}
            type="text"
            bind:value={decimalPart}
            class="part-decimal"
            style="width: {decimals}ch;"
            onkeydown={handleDecimalKeydown}
            aria-label="Decimal part"
          />
        </div>
      {:else}
        <input
          bind:this={inputEl}
          type="text"
          bind:value={localValue}
          class="inline-input"
          onkeydown={handleKeydown}
          aria-label="Cell editor"
        />
      {/if}
    </div>
  {:else if children}
    {@render children()}
  {/if}
</TableCell>

<style>
  .cell-editor {
    display: block;
    width: 100%;
  }

  /* The editors must land on exactly the pixels the static text occupied */
  .inline-input,
  .part-integer,
  .part-decimal {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    font-variant-numeric: inherit;
    letter-spacing: inherit;
    text-align: inherit;
  }

  .inline-input {
    width: 100%;
  }

  /* Split layout for decimals styling */
  .split-input-wrapper {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    width: 100%;
    line-height: inherit;
  }

  .part-integer {
    flex: 1 1 0;
    min-width: 0;
    font-family: var(--font-num);
    text-align: right;
  }

  .part-decimal {
    flex: 0 0 auto;
    font-family: var(--font-num);
    text-align: left;
    /* width is set inline as {decimals}ch */
  }

  /* 1ch is exactly the glyph advance in a tabular font, so the decimal
     point does not move when the editor opens */
  .dot-separator {
    flex: 0 0 auto;
    width: 1ch;
    margin: 0;
    text-align: center;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: inherit;
    user-select: none;
  }
</style>
