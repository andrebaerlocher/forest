<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BreadcrumbItem } from '../domain.js';
  import Breadcrumb from '../molecules/Breadcrumb.svelte';
  import PaletteIndicator from '../molecules/PaletteIndicator.svelte';

  interface Props {
    breadcrumbs: BreadcrumbItem[];
    onsearch?: () => void;
    /**
     * A leading action rendered before the breadcrumb — typically the phone
     * navigation trigger, or a back affordance. AppHeader stays neutral about
     * width and renders it at every size; hiding it is the caller's decision.
     */
    leading?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let {
    breadcrumbs = [],
    onsearch,
    leading,
    class: className = '',
    children
  }: Props = $props();
</script>

<header class="app-header {className}">
  <div class="left-section">
    {#if leading}
      {@render leading()}
    {/if}
    <Breadcrumb items={breadcrumbs} />
  </div>

  <div class="right-section">
    <PaletteIndicator onclick={onsearch} />
    {#if children}
      <div class="actions">
        {@render children()}
      </div>
    {/if}
  </div>
</header>

<style>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 24px;
    border-bottom: 1px solid var(--line-soft);
    background: transparent;
    width: 100%;
  }

  .left-section {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 12px;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
