<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { MetricItem } from '../domain.js';
  import Stat from './Stat.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    metrics: MetricItem[];
    class?: string;
  }

  let { metrics, class: className = '', ...restProps }: Props = $props();
</script>

<div class="metrics-grid {className}" {...restProps}>
  {#each metrics as metric (metric.label)}
    <div class="metric-cell">
      <Stat label={metric.label} value={metric.value} />
      {#if metric.detail}
        <span class="metric-detail">{metric.detail}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 16px;
  }

  .metric-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .metric-detail {
    font-size: 11px;
    color: var(--text-3);
  }
</style>
