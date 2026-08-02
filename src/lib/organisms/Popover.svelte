<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { scale } from 'svelte/transition';
  import { type AnchoredPlacement, anchored } from '../actions/anchored.js';
  import { focusTrap } from '../actions/focusTrap.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Bindable. */
    open?: boolean;
    anchor?: HTMLElement | null;
    placement?: AnchoredPlacement;
    offset?: number;
    matchWidth?: boolean;
    /** Accessible name for the surface. */
    label?: string;
    /** Trap Tab inside the surface. Default false — a popover is non-modal. */
    modal?: boolean;
    onclose?: () => void;
    class?: string;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    anchor = null,
    placement = 'bottom-start',
    offset = 6,
    matchWidth = false,
    label,
    modal = false,
    onclose,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let surfaceEl: HTMLElement | null = $state(null);

  function close() {
    open = false;
    onclose?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  // Click/pointerdown outside the surface AND outside the anchor closes it.
  // The anchor itself is ignored so a toggle button's own click does not
  // immediately reopen what it just closed.
  $effect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (surfaceEl?.contains(target)) return;
      if (anchor?.contains(target)) return;
      close();
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  });
</script>

{#if open}
  <div
    class="popover {className}"
    bind:this={surfaceEl}
    use:anchored={{ anchor, placement, offset, matchWidth }}
    use:focusTrap={{ enabled: modal }}
    role="dialog"
    aria-label={label}
    tabindex="-1"
    transition:scale={{ start: 0.96, duration: 150 }}
    onkeydown={handleKeydown}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  .popover {
    background: var(--canvas);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: 12px;
    z-index: var(--z-palette);
    /* A popover is transient — the same sanctioned exception Dialog and
       Drawer use. The house rule bans shadows at rest, not on a surface
       that only exists while entering/exiting. */
    box-shadow: var(--shadow-drag);
  }
</style>
