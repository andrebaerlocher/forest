<script lang="ts">
  import type { Snippet } from 'svelte';
  import { scale } from 'svelte/transition';
  import { focusTrap } from '../actions/focusTrap.js';
  import Scrim from '../atoms/Scrim.svelte';
  import Slip from '../molecules/Slip.svelte';

  interface Props {
    open: boolean;
    title?: string;
    /**
     * 'sm' is the confirm-dialog width this component was built for. 'lg' is for
     * content that has to be read rather than acknowledged — an expanded system
     * diagram, say — and lets its body scroll instead of overflowing the screen.
     */
    size?: 'sm' | 'lg';
    class?: string;
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    title = '',
    size = 'sm',
    class: className = '',
    onclose,
    children,
    footer
  }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

{#if open}
  <Scrim level="drawer" onclick={onclose} />

  <!-- Dialog box -->
  <div
    class="dialog-wrapper"
    use:focusTrap
    tabindex="-1"
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label={title || 'Confirm dialog'}
  >
    <div
      transition:scale={{ start: 0.96, duration: 180 }}
      class="dialog-scale-container"
      class:lg={size === 'lg'}
    >
      <Slip class="dialog-slip {className}">
        {#if title}
          <h3 class="dialog-title">{title}</h3>
        {/if}
        <div class="dialog-body">
          {#if children}
            {@render children()}
          {/if}
        </div>
        {#if footer}
          <div class="dialog-footer">
            {@render footer()}
          </div>
        {/if}
      </Slip>
    </div>
  </div>
{/if}

<style>
  .dialog-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-drawer);
    padding: 24px;
    pointer-events: none;
  }

  .dialog-scale-container {
    pointer-events: auto;
    width: 100%;
    max-width: 400px;
  }

  /* Read-me-don't-acknowledge-me sizing: fill the space, cap at the viewport,
     and let the body scroll rather than pushing the footer off-screen. */
  .dialog-scale-container.lg {
    max-width: min(1200px, 92vw);
    max-height: min(900px, 90vh);
    display: flex;
  }

  :global(.dialog-slip) {
    background: var(--canvas) !important;
    box-shadow: var(--shadow-drag) !important; /* Dialog gets shadow since it is transient entering */
    display: flex;
    flex-direction: column;
    padding: 24px !important;
    max-width: 100% !important;
    width: 100%;
  }

  .dialog-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-1);
    margin: 0 0 12px;
    letter-spacing: 0.02em;
  }

  .dialog-body {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  /* Declared after the base rules they refine, so specificity climbs down the
     stylesheet rather than up it. */
  .dialog-scale-container.lg :global(.dialog-slip) {
    max-height: min(900px, 90vh);
    overflow: hidden;
  }

  .dialog-scale-container.lg .dialog-body {
    flex: 1;
    min-height: 0;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
</style>
