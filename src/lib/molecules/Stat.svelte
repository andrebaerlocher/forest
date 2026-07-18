<script lang="ts">
  import Slip from './Slip.svelte';

  interface Props {
    value: string | number;
    label: string;
    negative?: boolean;
    class?: string;
  }

  let { value, label, negative = false, class: className = '' }: Props = $props();
</script>

<Slip class="stat-slip {className}">
  <div class="stat-num" class:neg={negative}>
    {value}
  </div>
  <div class="stat-label">
    {label}
  </div>
</Slip>

<style>
  :global(.stat-slip) {
    min-width: 160px;
    flex: 1;
  }

  .stat-num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 26px;
    color: var(--text-1);
    line-height: 1.2;
    font-weight: 300;
  }

  .stat-num.neg {
    color: var(--danger);
  }

  .stat-label {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: 4px;
  }
</style>
