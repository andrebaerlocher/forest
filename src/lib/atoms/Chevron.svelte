<script lang="ts">
  interface Props {
    /** Where it points when `open` is false. */
    direction?: 'right' | 'down' | 'left' | 'up';
    /** Rotates 90° clockwise from `direction`. */
    open?: boolean;
    size?: number;
    class?: string;
  }

  let { direction = 'right', open = false, size = 14, class: className = '' }: Props = $props();

  const base: Record<NonNullable<Props['direction']>, number> = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  let angle = $derived(base[direction] + (open ? 90 : 0));
</script>

<!-- Decorative by contract: the control that owns this carries the state in
     aria-expanded, so announcing a rotation too would just be noise. -->
<svg
  class="chevron {className}"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  style:transform="rotate({angle}deg)"
  aria-hidden="true"
  focusable="false"
>
  <polyline points="9 6 15 12 9 18" />
</svg>

<style>
  /* A chevron is persistent furniture, so it moves by CSS transition — never
     by a Svelte transition, which is for elements that enter and leave. */
  .chevron {
    flex-shrink: 0;
    transition: transform var(--t-fast) var(--ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }
  }
</style>
