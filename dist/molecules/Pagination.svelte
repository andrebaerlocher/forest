<script lang="ts">
  import SealButton from '../atoms/SealButton.svelte';

  interface Props {
    current: number;
    total: number;
    class?: string;
    onchange?: (page: number) => void;
  }

  let {
    current = $bindable(1),
    total = 1,
    class: className = '',
    onchange
  }: Props = $props();

  function prev() {
    if (current > 1) {
      current -= 1;
      if (onchange) onchange(current);
    }
  }

  function next() {
    if (current < total) {
      current += 1;
      if (onchange) onchange(current);
    }
  }
</script>

<div class="pagination {className}">
  <SealButton onclick={prev} disabled={current <= 1} aria-label="Previous page">
    <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
  </SealButton>

  <span class="info">
    Page <span class="num">{current}</span> of <span class="num">{total}</span>
  </span>

  <SealButton onclick={next} disabled={current >= total} aria-label="Next page">
    <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
  </SealButton>
</div>

<style>
  .pagination {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
  }

  .info {
    letter-spacing: 0.02em;
    user-select: none;
  }

  .num {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    color: var(--text-1);
    font-weight: 400;
  }
</style>
