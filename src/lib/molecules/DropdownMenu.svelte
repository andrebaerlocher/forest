<script lang="ts">
  import { type Snippet, tick } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    class?: string;
    onclose?: () => void;
    triggerElement?: HTMLElement | null;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    class: className = '',
    onclose,
    triggerElement = null,
    children,
    ...restProps
  }: Props = $props();

  let menuEl = $state<HTMLElement | null>(null);
  let previousActiveElement = $state<HTMLElement | null>(null);

  function getMenuItems(): HTMLElement[] {
    if (!menuEl) return [];
    return Array.from(
      menuEl.querySelectorAll<HTMLElement>('button, a, [role="menuitem"]')
    );
  }

  function setupMenuItems() {
    const items = getMenuItems();
    items.forEach((item) => {
      if (!item.hasAttribute('role')) {
        item.setAttribute('role', 'menuitem');
      }
    });
  }

  function returnFocus() {
    const target = triggerElement ?? previousActiveElement;
    if (target && typeof target.focus === 'function') {
      try {
        target.focus();
      } catch (_) {}
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      open = false;
      onclose?.();
      returnFocus();
      return;
    }

    const items = getMenuItems();
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < 0 || currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        items[nextIndex]?.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items[prevIndex]?.focus();
        break;
      }
      case 'Home': {
        event.preventDefault();
        items[0]?.focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      }
    }
  }

  $effect(() => {
    const target = triggerElement ?? previousActiveElement;
    if (target && typeof target.setAttribute === 'function') {
      target.setAttribute('aria-haspopup', 'true');
      target.setAttribute('aria-expanded', String(open));
    }
  });

  $effect(() => {
    if (open) {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        previousActiveElement = document.activeElement;
      }
      tick().then(() => {
        setupMenuItems();
        const items = getMenuItems();
        if (items.length > 0 && (!menuEl?.contains(document.activeElement))) {
          items[0].focus();
        }
      });

      function handlePointerDown(e: PointerEvent) {
        const target = e.target as Node;
        if (triggerElement?.contains(target)) {
          return;
        }
        if (menuEl && !menuEl.contains(target)) {
          open = false;
          onclose?.();
        }
      }

      const timer = setTimeout(() => {
        window.addEventListener('pointerdown', handlePointerDown);
      }, 0);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('pointerdown', handlePointerDown);
        returnFocus();
      };
    }
  });
</script>

{#if open}
  <div
    bind:this={menuEl}
    class="dropdown-menu {className}"
    role="menu"
    tabindex="-1"
    onkeydown={handleKeyDown}
    transition:fly={{ y: 8, duration: 150 }}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  .dropdown-menu {
    position: absolute;
    z-index: var(--z-palette);
    background: var(--raised);
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    box-shadow: var(--shadow-drag); /* drops a clean elevation shadow while active */
    min-width: 180px;
    padding: 6px;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :global(.dropdown-menu button),
  :global(.dropdown-menu a) {
    background: transparent;
    border: none;
    border-radius: var(--radius-s);
    padding: 6px 12px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    display: block;
    width: 100%;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover reads as the highlighted option. */
  @media (hover: hover) {
    :global(.dropdown-menu button:hover),
    :global(.dropdown-menu a:hover) {
      background: var(--wash);
      color: var(--text-1);
    }
  }

  :global(.dropdown-menu button:focus-visible),
  :global(.dropdown-menu a:focus-visible) {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }
</style>
