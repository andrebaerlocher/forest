<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    description?: string;
    class?: string;
    children?: Snippet;
  }

  let { title, description = '', class: className = '', children }: Props = $props();
</script>

<div class="form-section {className}">
  <div class="section-info">
    <h3 class="section-title">{title}</h3>
    {#if description}
      <p class="section-desc">{description}</p>
    {/if}
  </div>
  <div class="section-fields">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .form-section {
    display: flex;
    gap: 32px;
    padding: 24px 0;
    border-bottom: 1.5px solid var(--line-mid);
    width: 100%;
  }

  .form-section:last-of-type {
    border-bottom: none;
  }

  .section-info {
    width: 240px;
    flex-shrink: 0;
  }

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-1);
    margin: 0 0 6px;
    letter-spacing: 0.02em;
  }

  .section-desc {
    font-size: 12.5px;
    color: var(--text-3);
    line-height: 1.5;
    margin: 0;
  }

  .section-fields {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .form-section {
      flex-direction: column;
      gap: 16px;
    }
    .section-info {
      width: 100%;
    }
  }
</style>
