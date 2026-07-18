<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    description: string;
    actionLabel?: string;
    onaction?: () => void;
    icon?: Snippet;
  }

  let {
    title = '',
    description,
    actionLabel = '',
    onaction,
    icon
  }: Props = $props();
</script>

<div class="empty-state">
  <div class="large-seal" aria-hidden="true">
    {#if icon}
      {@render icon()}
    {:else}
      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    {/if}
  </div>

  {#if title}
    <h3 class="title">{title}</h3>
  {/if}
  
  <p class="description">{description}</p>

  {#if actionLabel && onaction}
    <button type="button" class="action-btn" onclick={onaction}>
      {actionLabel}
    </button>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px;
    max-width: 320px;
    margin: 0 auto;
  }

  .large-seal {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid var(--text-3);
    color: var(--text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    background: transparent;
  }

  .large-seal :global(svg) {
    width: 22px;
    height: 22px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-1);
    margin: 0 0 8px;
  }

  .description {
    font-size: 13px;
    color: var(--text-3);
    margin: 0 0 20px;
    line-height: 1.6;
  }

  .action-btn {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    padding: var(--pad-control-y) 18px;
    border-radius: var(--radius-s);
    cursor: pointer;
    border: 1.5px solid transparent;
    background: var(--cell-edit-bg);
    color: var(--cell-edit-text);
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  .action-btn:hover {
    background: color-mix(in oklch, var(--cell-edit-bg), white 8%);
  }

  .action-btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }
</style>
