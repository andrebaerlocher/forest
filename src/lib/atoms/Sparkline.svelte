<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<SVGSVGElement> {
    values: number[];
    width?: number;
    height?: number;
    tone?: 'neutral' | 'accent';
    class?: string;
  }

  let {
    values,
    width = 96,
    height = 32,
    tone = 'neutral',
    class: className = '',
    ...restProps
  }: Props = $props();

  const inset = 2;

  let points = $derived.by(() => {
    if (!values || values.length < 2) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min;
    const innerHeight = height - inset * 2;
    const step = values.length > 1 ? (width - inset * 2) / (values.length - 1) : 0;

    return values
      .map((v, i) => {
        const x = inset + i * step;
        // guard divide-by-zero: all-equal values sit on a flat mid-height line
        const y = span === 0 ? height / 2 : inset + innerHeight - ((v - min) / span) * innerHeight;
        return `${x},${y}`;
      })
      .join(' ');
  });
</script>

<svg
  class="sparkline tone-{tone} {className}"
  viewBox="0 0 {width} {height}"
  width={width}
  height={height}
  aria-hidden="true"
  {...restProps}
>
  {#if points}
    <polyline
      points={points}
      fill="none"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  {/if}
</svg>

<style>
  .sparkline {
    display: block;
  }

  .sparkline polyline {
    stroke: var(--line-strong);
    transition: stroke var(--t-fast) var(--ease);
  }

  .sparkline.tone-accent polyline {
    stroke: var(--accent);
  }
</style>
