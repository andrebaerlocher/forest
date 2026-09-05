<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export interface AccordionItemData {
    id: string;
    title: string;
    content?: string;
    disabled?: boolean;
  }

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onchange" | "children"> {
    items?: AccordionItemData[];
    multiple?: boolean;
    expandedIds?: string[];
    onchange?: (expandedIds: string[]) => void;
    children?: Snippet<[AccordionItemData]>;
  }

  let {
    items = [],
    multiple = false,
    expandedIds = $bindable([]),
    onchange,
    children,
    ...restProps
  }: Props = $props();

  function toggleItem(id: string, disabled?: boolean) {
    if (disabled) return;
    const isExpanded = expandedIds.includes(id);

    if (multiple) {
      if (isExpanded) {
        expandedIds = expandedIds.filter((item) => item !== id);
      } else {
        expandedIds = [...expandedIds, id];
      }
    } else {
      if (isExpanded) {
        expandedIds = [];
      } else {
        expandedIds = [id];
      }
    }

    if (onchange) {
      onchange(expandedIds);
    }
  }

  function handleKeyDown(event: KeyboardEvent, id: string, disabled?: boolean, index?: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleItem(id, disabled);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const buttons = Array.from(
        (event.currentTarget as HTMLElement).parentElement?.parentElement?.querySelectorAll<HTMLButtonElement>(
          ".accordion-trigger"
        ) || []
      );
      if (buttons.length === 0) return;
      const currentIndex = index ?? 0;
      const nextIndex =
        event.key === "ArrowDown"
          ? (currentIndex + 1) % buttons.length
          : (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[nextIndex]?.focus();
    }
  }
</script>

<div class="accordion-group" {...restProps}>
  {#each items as item, index (item.id)}
    {@const expanded = expandedIds.includes(item.id)}
    <div class="accordion-item" class:expanded class:disabled={item.disabled}>
      <button
        type="button"
        class="accordion-trigger"
        aria-expanded={expanded}
        aria-controls="accordion-panel-{item.id}"
        disabled={item.disabled}
        onclick={() => toggleItem(item.id, item.disabled)}
        onkeydown={(e) => handleKeyDown(e, item.id, item.disabled, index)}
      >
        <span class="title">{item.title}</span>
        <svg
          class="chevron"
          class:rotated={expanded}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {#if expanded}
        <div
          id="accordion-panel-{item.id}"
          class="accordion-panel"
          role="region"
          aria-labelledby="accordion-trigger-{item.id}"
        >
          {#if children}
            {@render children(item)}
          {:else}
            <p class="panel-content">{item.content}</p>
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .accordion-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--paper-l);
    overflow: hidden;
  }

  .accordion-item {
    border-bottom: 1px solid var(--line-soft);
  }

  .accordion-item:last-child {
    border-bottom: none;
  }

  .accordion-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-1);
    cursor: pointer;
    text-align: left;
    transition: background var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover on touch would leave the trigger looking
     permanently pressed. */
  @media (hover: hover) {
    .accordion-trigger:hover:not(:disabled) {
      background: var(--wash);
    }
  }

  .accordion-trigger:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -2px;
  }

  .accordion-trigger:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* Stacked list of triggers, so .hit-44 (an isolated-control tool) would
     make neighbouring items overlap — grow the real row instead. */
  @media (pointer: coarse) {
    .accordion-trigger {
      min-height: 44px;
      padding-block: var(--pad-control-y);
    }
  }

  .chevron {
    transition: transform var(--t-fast) var(--ease);
    color: var(--text-2);
    flex-shrink: 0;
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  .accordion-panel {
    padding: 12px 16px 16px 16px;
    font-family: var(--font-body);
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-2);
    border-top: 1px solid var(--line-soft);
    background: color-mix(in oklch, var(--paper-l), black 1%);
  }

  .panel-content {
    margin: 0;
  }
</style>
