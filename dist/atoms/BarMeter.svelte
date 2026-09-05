<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
    max: number;
    unit?: string;
    formatted?: string;
    tone?: 'neutral' | 'accent' | 'danger' | 'success' | 'warning';
    class?: string;
  }

  let {
    label,
    value,
    max,
    unit = '',
    formatted,
    tone = 'neutral',
    class: className = '',
    ...restProps
  }: Props = $props();

  let display = $derived(formatted ?? `${value}${unit}`);
  let pct = $derived(Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0)));
</script>

<div
  class="bar-meter {className}"
  role="img"
  aria-label="{label}: {display} of {max}{unit}"
  {...restProps}
>
  <div class="row">
    <span class="label">{label}</span>
    <span class="value">{display}</span>
  </div>
  <div class="track" aria-hidden="true">
    <div class="fill tone-{tone}" style="width: {pct}%"></div>
  </div>
</div>

<style>
  .bar-meter {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .label {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--text-2);
  }

  .value {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    color: var(--text-1);
    white-space: nowrap;
  }

  .track {
    width: 100%;
    height: 6px;
    background: var(--line-soft);
    border-radius: var(--radius-round);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: var(--radius-round);
    transition: width var(--t-base) var(--ease);
  }

  .fill.tone-neutral {
    background: var(--line-strong);
  }

  .fill.tone-accent {
    background: var(--accent);
  }

  .fill.tone-danger {
    background: var(--danger);
  }

  .fill.tone-success {
    background: var(--success);
  }

  .fill.tone-warning {
    background: var(--warning);
  }
</style>
