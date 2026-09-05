<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';
  import PaperTexture from '../atoms/PaperTexture.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    message?: string;
    open: boolean;
    status?: 'neutral' | 'success' | 'warning' | 'danger';
    /**
     * Position itself in the corner. Set false inside a ToastRegion, which
     * owns the positioning for the whole stack.
     */
    standalone?: boolean;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    message = '',
    open = false,
    status = 'neutral',
    standalone = true,
    class: className = '',
    onclose,
    children,
    ...restProps
  }: Props = $props();
</script>

{#if open}
  <div
    class="toast-wrapper on-ink {className} status-{status}"
    class:standalone
    transition:fly={{ x: 24, duration: 250 }}
    role="status"
    aria-live="polite"
    {...restProps}
  >
    <PaperTexture class="toast-paper">
      <div class="toast-content">
        {#if children}
          {@render children()}
        {:else}
          <span class="toast-msg">{message}</span>
        {/if}
        {#if onclose}
          <button type="button" class="close-btn" onclick={onclose} aria-label="Close notification">
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        {/if}
      </div>
    </PaperTexture>
  </div>
{/if}

<style>
  .toast-wrapper {
    border-radius: var(--radius-m);
    overflow: hidden;
    /* a transient surface entering — the sanctioned second use of shadow */
    box-shadow: var(--shadow-drag);
    border: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    max-width: 340px;
    width: 100%;
  }

  /* Standalone toasts place themselves; inside a ToastRegion the region does.
     Width: min() instead of 100vw (which includes the scrollbar gutter and
     can overflow a narrow phone) — matches ToastRegion's own shape.
     Bottom: safe-area inset added so the toast clears the home indicator
     instead of sitting on top of it. */
  .toast-wrapper.standalone {
    position: fixed;
    bottom: calc(24px + env(safe-area-inset-bottom));
    right: 24px;
    z-index: var(--z-toast);
    width: min(400px, calc(100% - 32px));
  }

  /* Status as ink: a thin rule down the leading edge, never a tinted fill */
  .toast-wrapper.status-success {
    border-left: 3px solid var(--success);
  }

  .toast-wrapper.status-warning {
    border-left: 3px solid var(--warning);
  }

  .toast-wrapper.status-danger {
    border-left: 3px solid var(--danger);
  }

  :global(.toast-paper) {
    padding: 12px 16px;
    border-radius: var(--radius-m);
  }

  .toast-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    color: #f4f0e6;
    font-family: var(--font-body);
    font-size: 13px;
  }

  .toast-msg {
    line-height: 1.5;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: oklch(94.5% 0.012 95 / 60%);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--t-fast) var(--ease);
  }

  /* Gated: a stuck hover on touch would leave the close icon looking lit
     with no way to release it. */
  @media (hover: hover) {
    .close-btn:hover {
      color: #f4f0e6;
    }
  }

  /* Touch target: .hit-44 is the wrong tool here — .toast-wrapper sets
     overflow: hidden (to clip the rounded corners) and is an ancestor of
     this button, which would clip the ::after expansion per the contract
     at forest.css:274-279. Grow the real box with padding instead; the
     16px content gap already gives it room to breathe. */
  @media (pointer: coarse) {
    .close-btn {
      padding: 15px;
      margin: -15px;
    }
  }

  .close-btn svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
