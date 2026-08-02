<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Preset shapes. 'text' is a line of body copy; 'block' is an arbitrary box. */
    variant?: 'text' | 'block' | 'circle';
    /** Any CSS length. Defaults: text/block -> '100%', circle -> '32px'. */
    width?: string;
    /** Any CSS length. Defaults: text -> '1em', block -> '80px', circle -> width. */
    height?: string;
    /** For variant='text': render this many stacked lines. */
    lines?: number;
    class?: string;
  }

  let {
    variant = 'text',
    width,
    height,
    lines = 1,
    class: className = '',
    ...restProps
  }: Props = $props();

  let resolvedWidth = $derived(width ?? (variant === 'circle' ? '32px' : '100%'));
  let resolvedHeight = $derived(
    height ??
      (variant === 'text' ? '1em' : variant === 'circle' ? resolvedWidth : '80px')
  );

  // The last line of a paragraph runs short; without that a stack reads as a
  // bar chart rather than as text.
  let lineWidths = $derived(
    Array.from({ length: Math.max(1, lines) }, (_, i) =>
      i === lines - 1 && lines > 1 ? '60%' : resolvedWidth
    )
  );
</script>

<!-- Decorative. The loading state itself must be announced by whatever region
     owns it (a role="status" container), never by the placeholders — a screen
     reader hearing "loading" eight times is worse than hearing it once. -->
{#if variant === 'text' && lines > 1}
  <div class="skeleton-stack {className}" aria-hidden="true" {...restProps}>
    {#each lineWidths as lineWidth, i (i)}
      <div
        class="skeleton skeleton-text"
        style="width: {lineWidth}; height: {resolvedHeight};"
      ></div>
    {/each}
  </div>
{:else}
  <div
    class="skeleton skeleton-{variant} {className}"
    aria-hidden="true"
    style="width: {resolvedWidth}; height: {resolvedHeight};"
    {...restProps}
  ></div>
{/if}

<style>
  .skeleton {
    background: var(--line-soft);
    border-radius: var(--radius-s);
  }

  .skeleton-circle {
    border-radius: var(--radius-round);
  }

  .skeleton-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* The static block must already read correctly, so the pulse is additive and
     only ever applied when motion is welcome. */
  @media (prefers-reduced-motion: no-preference) {
    .skeleton {
      animation: skeleton-pulse 1.6s var(--ease) infinite;
    }
  }

  @keyframes skeleton-pulse {
    0%,
    100% {
      background-color: var(--line-soft);
    }
    50% {
      background-color: var(--line-mid);
    }
  }
</style>
