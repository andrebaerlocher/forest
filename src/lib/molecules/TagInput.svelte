<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Tag from '../atoms/Tag.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Bindable. The current values. */
    value?: string[];
    placeholder?: string;
    /** Optional autocomplete source. When empty, TagInput is free-entry only. */
    suggestions?: string[];
    /** Reject a value already present. Default true. */
    unique?: boolean;
    /** Hard cap on how many values may be added. */
    max?: number;
    disabled?: boolean;
    /** Accessible name for the text field. Required for a usable control. */
    label?: string;
    id?: string;
    class?: string;
  }

  let {
    value = $bindable([]),
    placeholder = '',
    suggestions = [],
    unique = true,
    max,
    disabled = false,
    label,
    id,
    class: className = '',
    ...restProps
  }: Props = $props();

  let query = $state('');
  let isOpen = $state(false);
  let highlighted = $state(0);
  let announcement = $state('');
  let rootEl: HTMLElement | null = $state(null);
  let inputEl: HTMLInputElement | null = $state(null);

  const generatedId = $props.id();
  let inputId = $derived(id ?? `taginput-${generatedId}`);
  const listId = `taginput-list-${generatedId}`;

  let filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q || suggestions.length === 0) return [];
    return suggestions.filter(
      (s) => s.toLowerCase().includes(q) && !value.some((v) => v.toLowerCase() === s.toLowerCase())
    );
  });
  let showList = $derived(isOpen && filtered.length > 0);
  let activeOptionId = $derived(
    showList && filtered[highlighted] !== undefined ? `${listId}-${highlighted}` : undefined
  );
  function addTag(raw: string) {
    const next = raw.trim();
    if (!next) return;
    if (max !== undefined && value.length >= max) {
      announcement = `Maximum of ${max} reached`;
      return;
    }
    if (unique && value.includes(next)) {
      announcement = `${next} is already added`;
      return;
    }
    value = [...value, next];
    announcement = `Added ${next}`;
    query = '';
    isOpen = false;
    highlighted = 0;
  }
  function removeTag(tag: string) {
    value = value.filter((v) => v !== tag);
    announcement = `Removed ${tag}`;
    inputEl?.focus();
  }
  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const pick = showList ? filtered[highlighted] : undefined;
      addTag(pick !== undefined ? pick : query);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(query);
    } else if (e.key === 'Backspace' && query === '') {
      e.preventDefault();
      const last = value[value.length - 1];
      if (last !== undefined) removeTag(last);
    } else if (e.key === 'ArrowDown') {
      if (!showList) return;
      e.preventDefault();
      highlighted = Math.min(highlighted + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      if (!showList) return;
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      isOpen = false;
    }
  }
  function handleFocusOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && rootEl?.contains(next)) return;
    isOpen = false;
  }
</script>

<div
  class="taginput {className}"
  class:disabled
  bind:this={rootEl}
  onfocusout={handleFocusOut}
  {...restProps}
>
  {#if label}
    <label class="sr-only" for={inputId}>{label}</label>
  {/if}
  <div class="field">
    {#each value as tag (tag)}
      <Tag>
        {tag}
        <button
          type="button"
          class="remove"
          aria-label={`Remove ${tag}`}
          {disabled}
          onclick={() => removeTag(tag)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </Tag>
    {/each}
    <input
      bind:this={inputEl}
      id={inputId}
      class="input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-expanded={showList}
      aria-controls={listId}
      aria-activedescendant={activeOptionId}
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      value={query}
      oninput={(e) => {
        query = e.currentTarget.value;
        isOpen = true;
        highlighted = 0;
      }}
      onkeydown={handleKeydown}
    />
  </div>
  {#if showList}
    <div class="list" id={listId} role="listbox">
      {#each filtered as suggestion, i (suggestion)}
        <div
          class="option"
          class:highlighted={i === highlighted}
          id="{listId}-{i}"
          role="option"
          tabindex="-1"
          aria-selected={i === highlighted}
          onmouseenter={() => (highlighted = i)}
          onclick={() => addTag(suggestion)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              addTag(suggestion);
            }
          }}
        >
          {suggestion}
        </div>
      {/each}
    </div>
  {/if}
  <span class="sr-only" aria-live="polite">{announcement}</span>
</div>

<style>
  .taginput {
    position: relative;
    width: 100%;
    font-family: var(--font-body);
  }
  .field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    width: 100%;
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: 6px 8px;
    transition: border-color var(--t-fast) var(--ease);
  }
  .field:has(.input:focus-visible) {
    border-color: var(--accent);
  }
  .taginput.disabled .field {
    opacity: 0.45;
  }
  .taginput :global(.tag) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .input {
    flex: 1 1 80px;
    min-width: 80px;
    border: none;
    background: transparent;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
    padding: var(--pad-control-y) 4px;
  }
  .input::placeholder {
    color: var(--text-3);
  }
  .input:focus {
    outline: none;
  }
  .remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    transition: color var(--t-fast) var(--ease);
  }
  .remove:hover:not(:disabled) {
    color: var(--danger);
  }
  .remove:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }
  .remove svg {
    width: 9px;
    height: 9px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
  }
  /* Tracks the chip's own text size at rest; coarse pointers get the same
     tap-target growth the rest of the library applies to small controls. */
  @media (pointer: coarse) {
    .remove {
      width: 28px;
      height: 28px;
    }
  }
  .list {
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
  .option {
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
</style>
