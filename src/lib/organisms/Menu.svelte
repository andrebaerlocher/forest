<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { scale } from 'svelte/transition';
  import { type AnchoredPlacement, anchored } from '../actions/anchored.js';
  import type { MenuItemData } from '../domain.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
    /** Bindable. */
    open?: boolean;
    anchor?: HTMLElement | null;
    items: MenuItemData[];
    placement?: AnchoredPlacement;
    /** Accessible name for the menu. */
    label?: string;
    onselect?: (id: string) => void;
    onclose?: () => void;
    class?: string;
  }

  let {
    open = $bindable(false),
    anchor = null,
    items,
    placement = 'bottom-start',
    label,
    onselect,
    onclose,
    class: className = '',
    ...restProps
  }: Props = $props();

  let containerEl: HTMLElement | null = $state(null);
  let activeId: string | null = $state(null);
  let buffer = '';
  let bufferTimer: ReturnType<typeof setTimeout> | null = null;

  let enabledItems = $derived(items.filter((i) => !i.separator && !i.disabled));

  function focusItem(id: string | null | undefined) {
    if (!id) return;
    activeId = id;
    // Wait for the tabindex roving update to land in the DOM before moving
    // real focus to it.
    queueMicrotask(() => {
      const el = containerEl?.querySelector<HTMLElement>(
        `[data-item-id="${CSS.escape(id)}"]`
      );
      el?.focus();
    });
  }

  function close() {
    open = false;
    onclose?.();
  }

  function activate(item: MenuItemData) {
    if (item.disabled || item.separator) return;
    onselect?.(item.id);
    close();
  }

  // Focus the first enabled item whenever the menu opens.
  $effect(() => {
    if (open) {
      focusItem(enabledItems[0]?.id ?? null);
    } else {
      activeId = null;
      buffer = '';
    }
  });

  $effect(() => () => {
    if (bufferTimer) clearTimeout(bufferTimer);
  });

  function typeahead(char: string) {
    buffer += char.toLowerCase();
    if (bufferTimer) clearTimeout(bufferTimer);
    bufferTimer = setTimeout(() => {
      buffer = '';
    }, 500);

    const match = enabledItems.find((i) => i.label.toLowerCase().startsWith(buffer));
    if (match) focusItem(match.id);
  }

  function handleKeydown(e: KeyboardEvent) {
    const list = enabledItems;
    const currentIndex = list.findIndex((i) => i.id === activeId);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = list[(currentIndex + 1) % list.length];
      focusItem(next?.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = list[(currentIndex - 1 + list.length) % list.length];
      focusItem(prev?.id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem(list[0]?.id);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem(list[list.length - 1]?.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
      anchor?.focus();
    } else if (e.key === 'Tab') {
      // Menus are not tab-navigable — let focus continue on its way, just
      // close behind it.
      close();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      typeahead(e.key);
    }
  }

  // Click/pointerdown outside the menu AND outside the anchor closes it.
  $effect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (containerEl?.contains(target)) return;
      if (anchor?.contains(target)) return;
      close();
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  });
</script>

{#if open}
  <div
    class="menu {className}"
    bind:this={containerEl}
    use:anchored={{ anchor, placement }}
    role="menu"
    aria-label={label}
    transition:scale={{ start: 0.96, duration: 150 }}
    onkeydown={handleKeydown}
    {...restProps}
  >
    {#each items as item (item.id)}
      {#if item.separator}
        <!-- biome-ignore lint/a11y/useFocusableInteractive: a menu separator is a divider, never a stop on the tab/roving-tabindex path -->
        <!-- biome-ignore lint/a11y/useAriaPropsForRole: valuenow applies to orientation separators; this one carries no value -->
        <div class="menu-separator" role="separator"></div>
      {:else}
        <div
          class="menu-item"
          class:active={item.id === activeId}
          class:danger={item.danger}
          class:disabled={item.disabled}
          role="menuitem"
          data-item-id={item.id}
          tabindex={item.id === activeId ? 0 : -1}
          aria-disabled={item.disabled}
          onmouseenter={() => {
            if (!item.disabled) focusItem(item.id);
          }}
          onclick={() => activate(item)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              activate(item);
            }
          }}
        >
          <span class="item-label">{item.label}</span>
          {#if item.shortcut}
            <span class="item-shortcut">{item.shortcut}</span>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .menu {
    min-width: 180px;
    background: var(--canvas);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: 6px;
    z-index: var(--z-palette);
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* Transient surface — same sanctioned exception as Popover/Dialog/Drawer. */
    box-shadow: var(--shadow-drag);
  }

  .menu-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 10px;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    background: transparent;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-1);
    cursor: pointer;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  .menu-item.active {
    background: var(--wash);
  }

  .menu-item:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }

  .menu-item.danger {
    color: var(--danger);
  }

  .menu-item.disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .item-shortcut {
    flex-shrink: 0;
    font-family: var(--font-num);
    color: var(--text-3);
  }

  .menu-separator {
    height: 1px;
    margin: 4px 6px;
    background: var(--line-mid);
  }
</style>
