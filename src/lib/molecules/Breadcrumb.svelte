<script lang="ts">
  import type { BreadcrumbItem } from '../domain.js';

  interface Props {
    items: BreadcrumbItem[];
    class?: string;
  }

  let { items = [], class: className = '' }: Props = $props();
</script>

<nav class="breadcrumb {className}" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    {#each items as item, index (item.label)}
      <li class="breadcrumb-item">
        {#if index > 0}
          <span class="separator" aria-hidden="true">/</span>
        {/if}
        {#if item.href && index < items.length - 1}
          <a href={item.href} class="breadcrumb-link">{item.label}</a>
        {:else}
          <span class="current" aria-current="page">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumb {
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-3);
  }

  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
  }

  .separator {
    margin: 0 8px;
    color: var(--text-3);
    opacity: 0.5;
    user-select: none;
  }

  .breadcrumb-link {
    color: var(--text-2);
    text-decoration: none;
    transition: color var(--t-fast) var(--ease);
  }

  .breadcrumb-link:hover {
    color: var(--text-1);
  }

  .breadcrumb-link:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .current {
    color: var(--text-1);
    font-weight: 400;
  }
</style>
