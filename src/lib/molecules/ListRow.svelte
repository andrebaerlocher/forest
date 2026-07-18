<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    value?: string | number;
    active?: boolean;
    onclick?: () => void;
    icon?: Snippet;
    trailing?: Snippet;
    class?: string;
  }

  let {
    title,
    subtitle = '',
    value = '',
    active = false,
    onclick,
    icon,
    trailing,
    class: className = ''
  }: Props = $props();
</script>

<div
  class="list-row {className}"
  class:active
  class:clickable={!!onclick}
  role={onclick ? 'button' : undefined}
  tabindex={onclick ? 0 : undefined}
  onclick={onclick}
  onkeydown={onclick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick(); } } : undefined}
>
  <div class="leading-area">
    {#if icon}
      <div class="row-icon">
        {@render icon()}
      </div>
    {/if}
    <div class="text-area">
      <span class="row-title">{title}</span>
      {#if subtitle}
        <span class="row-subtitle">{subtitle}</span>
      {/if}
    </div>
  </div>

  <div class="trailing-area">
    {#if trailing}
      {@render trailing()}
    {:else if value}
      <span class="row-val">{value}</span>
    {/if}
  </div>
</div>

<style>
  .list-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--line-soft);
    background: transparent;
    font-family: var(--font-body);
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .list-row.clickable {
    cursor: pointer;
  }

  .list-row.clickable:hover {
    background: var(--wash-hover);
  }

  .list-row.active {
    background: var(--wash);
    border-bottom-color: var(--line-mid);
  }

  .leading-area {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
  }

  /* SVG styling inside the list row */
  .row-icon :global(svg) {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .text-area {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .row-title {
    font-size: 13.5px;
    color: var(--text-1);
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-row.active .row-title {
    font-weight: 400;
  }

  .row-subtitle {
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .trailing-area {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .row-val {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    color: var(--text-2);
  }

  .list-row:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }
</style>
