<script lang="ts">
  import type { Snippet } from 'svelte';
  import { isPhone } from '../breakpoints.svelte.js';
  import Drawer from './Drawer.svelte';

  interface Props {
    title?: string;
    /**
     * Phone only: whether the Drawer copy is open. Bindable so a close
     * button, Escape, or the scrim can reach the caller's trigger state.
     * Ignored on desktop, where the panel is inline and always present —
     * matching the previous, always-visible behaviour of this component.
     */
    open?: boolean;
    onclose?: () => void;
    class?: string;
    children?: Snippet;
  }

  let {
    title = '',
    open = $bindable(true),
    onclose,
    class: className = '',
    children
  }: Props = $props();

  const phone = isPhone();

  function close() {
    open = false;
    onclose?.();
  }
</script>

<!-- DOM identity only: which copy exists is decided here, never appearance
     (breakpoints.svelte.ts's rule). The two copies are mutually exclusive so
     only one is ever in the accessibility tree. -->
{#snippet panelContent()}
  {#if title}
    <div class="panel-header">
      <h3 class="panel-title">{title}</h3>
    </div>
  {/if}
  <div class="panel-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
{/snippet}

{#if !phone.current}
  <aside class="detail-panel {className}">
    {@render panelContent()}
  </aside>
{:else}
  <Drawer
    {open}
    side="right"
    width="min(320px, 92vw)"
    label={title || 'Details'}
    class={className}
    onclose={close}
  >
    {@render panelContent()}
  </Drawer>
{/if}

<style>
  .detail-panel {
    width: 320px;
    height: 100%;
    border-left: 1px solid var(--line-soft);
    background: var(--raised);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .panel-header {
    padding: 18px 20px;
    border-bottom: 1px solid var(--line-soft);
  }

  .panel-title {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-1);
    margin: 0;
    text-transform: uppercase;
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .panel-body::-webkit-scrollbar {
    width: 6px;
  }

  .panel-body::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 3px;
  }
</style>
