<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ComboItem } from '../domain.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    items?: ComboItem[];
    /** id of the selected item */
    value?: string | null;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** Text shown when the filter matches nothing */
    emptyText?: string;
    onchange?: (id: string | null, item: ComboItem | null) => void;
    class?: string;
  }

  let {
    items = [],
    value = $bindable(null),
    placeholder = 'Search…',
    disabled = false,
    invalid = false,
    emptyText = 'No matches',
    onchange,
    class: className = '',
    ...restProps
  }: Props = $props();

  let isOpen = $state(false);
  let query = $state('');
  let highlighted = $state(0);
  let rootEl: HTMLElement | null = $state(null);
  let inputEl: HTMLInputElement | null = $state(null);

  const listId = `combobox-list-${Math.random().toString(36).slice(2, 9)}`;

  let selectedItem = $derived(items.find((i) => i.id === value) ?? null);

  let filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || (i.meta ?? '').toLowerCase().includes(q)
    );
  });

  // The input mirrors the selection while closed, and the query while open
  let displayValue = $derived(isOpen ? query : (selectedItem?.label ?? ''));

  let activeOptionId = $derived(
    isOpen && filtered[highlighted] ? `${listId}-${filtered[highlighted].id}` : undefined
  );

  function openList() {
    if (disabled) return;
    isOpen = true;
    query = '';
    highlighted = Math.max(
      0,
      filtered.findIndex((i) => i.id === value)
    );
  }

  function closeList() {
    isOpen = false;
    query = '';
  }

  function select(item: ComboItem) {
    value = item.id;
    onchange?.(item.id, item);
    closeList();
    inputEl?.focus();
  }

  function clear() {
    value = null;
    onchange?.(null, null);
    closeList();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        openList();
        return;
      }
      highlighted = Math.min(highlighted + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) return;
      highlighted = Math.max(highlighted - 1, 0);
    } else if (e.key === 'Enter') {
      if (!isOpen) return;
      e.preventDefault();
      const item = filtered[highlighted];
      if (item) select(item);
    } else if (e.key === 'Escape') {
      if (!isOpen) return;
      e.preventDefault();
      closeList();
    }
  }

  function handleFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && rootEl?.contains(next)) return;
    closeList();
  }
</script>

<div
  class="combobox {className}"
  bind:this={rootEl}
  onfocusout={handleFocusOut}
  {...restProps}
>
  <input
    bind:this={inputEl}
    class="combobox-input"
    class:invalid
    type="text"
    role="combobox"
    autocomplete="off"
    aria-expanded={isOpen}
    aria-controls={listId}
    aria-activedescendant={activeOptionId}
    aria-invalid={invalid}
    {disabled}
    {placeholder}
    value={displayValue}
    oninput={(e) => {
      query = e.currentTarget.value;
      isOpen = true;
      highlighted = 0;
    }}
    onfocus={openList}
    onkeydown={handleKeydown}
  />

  {#if selectedItem && !disabled}
    <button class="clear" type="button" onclick={clear} aria-label="Clear selection">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
    </button>
  {/if}

  {#if isOpen}
    <div class="combobox-list" id={listId} role="listbox">
      {#each filtered as item, i (item.id)}
        <!-- options carry no interactive descendants; the input drives the
             keyboard via aria-activedescendant -->
        <div
          class="option"
          class:highlighted={i === highlighted}
          id="{listId}-{item.id}"
          role="option"
          tabindex="-1"
          aria-selected={item.id === value}
          onmouseenter={() => (highlighted = i)}
          onclick={() => select(item)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              select(item);
            }
          }}
        >
          <span class="option-label">{item.label}</span>
          {#if item.meta}
            <span class="option-meta">{item.meta}</span>
          {/if}
        </div>
      {:else}
        <div class="empty">{emptyText}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .combobox {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 300px;
    font-family: var(--font-body);
  }

  .combobox-input {
    width: 100%;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: var(--pad-control-y) 32px var(--pad-control-y) 12px;
    transition:
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  .combobox-input::placeholder {
    color: var(--text-3);
  }

  .combobox-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .combobox-input.invalid {
    border-color: var(--danger);
  }

  .combobox-input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .clear {
    position: absolute;
    right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
    transition: color var(--t-fast) var(--ease);
  }

  .clear:hover {
    color: var(--text-1);
  }

  .clear:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .clear svg {
    width: 11px;
    height: 11px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  .combobox-list {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: var(--z-drawer);
    margin: 0;
    padding: 4px;
    list-style: none;
    max-height: 240px;
    overflow-y: auto;
    background: var(--raised);
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .combobox-list::-webkit-scrollbar {
    width: 8px;
  }

  .combobox-list::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .option {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 7px 10px;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    background: transparent;
    font-family: var(--font-body);
    font-size: 13.5px;
    color: var(--text-1);
    text-align: left;
    cursor: pointer;
    transition: background var(--t-fast) var(--ease);
  }

  .option.highlighted {
    background: var(--wash);
  }

  .option[aria-selected='true'] {
    border-color: var(--accent);
  }

  .option-meta {
    font-size: 11px;
    color: var(--text-3);
    flex-shrink: 0;
  }

  .empty {
    padding: 10px;
    font-size: 12.5px;
    color: var(--text-3);
    text-align: center;
  }
  /* THE ONE DOCUMENTED SUB-44px TARGET IN THE SYSTEM.
     .clear sits inside the text input. A centred 44px box would reach
     ~39px into the text area, so tapping the tail of the typed text would
     clear the field — worse than a small target. 40px is the most that can
     be spent without stealing text taps. Deliberate; do not "fix" to 44. */
  @media (pointer: coarse) {
    .clear {
      width: 40px;
      height: 40px;
      right: 4px;
    }
  }
</style>
