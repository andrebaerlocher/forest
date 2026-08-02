<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Tag from '../atoms/Tag.svelte';
  import type { MetricItem } from '../domain.js';
  import { type HeadingLevel, useHeadingLevel } from '../headingLevel.js';
  import Slip from './Slip.svelte';

  /**
   * `...restProps` is forwarded to `<Slip>`, a component, not a raw DOM
   * element — so it extends Slip's own Props rather than an independent
   * `HTMLAttributes<HTMLDivElement>`. Two unrelated large structural types
   * (this one and Slip's) meeting at a `{...spread}` call site make the
   * type checker choke ("union type too complex to represent"); extending
   * the exact type the spread target expects avoids that entirely.
   */
  interface Props extends Omit<ComponentProps<typeof Slip>, 'children' | 'fluid' | 'class'> {
    title: string;
    href: string;
    standfirst?: string;
    tags?: string[];
    /** A single headline number. The index stays restrained on purpose. */
    metric?: MetricItem;
    level?: HeadingLevel;
    class?: string;
  }

  let {
    title,
    href,
    standfirst,
    tags = [],
    metric,
    level,
    class: className = '',
    ...restProps
  }: Props = $props();

  const inheritedLevel = useHeadingLevel();
  let resolvedLevel = $derived(level ?? inheritedLevel);
</script>

<!-- The link wraps the title only, so its accessible name is the case study's
     name rather than the whole card's prose; an overlay pseudo-element then
     restores the full card as the click target. -->
<Slip fluid class="cs-card {className}" {...restProps}>
  {#if tags.length > 0}
    <div class="cs-card-tags">
      {#each tags as tag (tag)}
        <Tag variant="standard">{tag}</Tag>
      {/each}
    </div>
  {/if}

  <svelte:element this={`h${resolvedLevel}`} class="cs-card-title">
    <a {href}>{title}</a>
  </svelte:element>

  {#if standfirst}
    <p class="cs-card-standfirst">{standfirst}</p>
  {/if}

  {#if metric}
    <div class="cs-card-metric">
      <span class="cs-card-metric-value">{metric.value}</span>
      <span class="cs-card-metric-label">{metric.label}</span>
    </div>
  {/if}
</Slip>

<style>
  :global(.cs-card) {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    box-sizing: border-box;
  }

  @media (hover: hover) {
    :global(.cs-card:hover) {
      border-color: var(--line-strong);
    }
  }

  /* The card carries the focus ring because the overlay makes the whole card
     the hit area — a ring around the title alone would misdescribe it. */
  :global(.cs-card:has(a:focus-visible)) {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cs-card-title {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--text-1);
  }

  .cs-card-title a {
    color: inherit;
    text-decoration: none;
  }

  .cs-card-title a:focus-visible {
    outline: none;
  }

  .cs-card-title a::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .cs-card-standfirst {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-2);
  }

  .cs-card-metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid var(--line-soft);
  }

  .cs-card-metric-value {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 20px;
    font-weight: 300;
    line-height: 1.2;
    color: var(--text-1);
  }

  .cs-card-metric-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }
</style>
