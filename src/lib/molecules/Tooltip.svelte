<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    text: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** ms before the tip appears on hover; focus always shows it immediately */
    delay?: number;
    class?: string;
    children?: Snippet;
  }

  let {
    text,
    placement = 'top',
    delay = 300,
    class: className = '',
    children
  }: Props = $props();

  let isOpen = $state(false);
  let timer: ReturnType<typeof setTimeout> | null = null;
  const id = `tooltip-${Math.random().toString(36).slice(2, 9)}`;

  function show(immediate = false) {
    if (timer) clearTimeout(timer);
    if (immediate) {
      isOpen = true;
      return;
    }
    timer = setTimeout(() => (isOpen = true), delay);
  }

  function hide() {
    if (timer) clearTimeout(timer);
    isOpen = false;
  }

  $effect(() => () => {
    if (timer) clearTimeout(timer);
  });
</script>

<!-- structural wrapper: the trigger passed as children carries the semantics -->
<span
  class="tooltip-anchor {className}"
  role="presentation"
  onmouseenter={() => show()}
  onmouseleave={hide}
  onfocusin={() => show(true)}
  onfocusout={hide}
  aria-describedby={isOpen ? id : undefined}
>
  {#if children}
    {@render children()}
  {/if}

  {#if isOpen}
    <!-- transient surface, so a Svelte transition is sanctioned -->
    <span
      class="tooltip place-{placement}"
      {id}
      role="tooltip"
      transition:fade={{ duration: 120 }}
    >
      {text}
    </span>
  {/if}
</span>

<style>
  .tooltip-anchor {
    position: relative;
    display: inline-flex;
  }

  .tooltip {
    position: absolute;
    z-index: var(--z-tooltip);
    padding: 5px 10px;
    border-radius: var(--radius-s);
    /* --spine, not --ink-2: in dark mode --ink-2 matches the canvas lightness
       and the tip would vanish. --spine stays darker than canvas in both modes. */
    background: var(--spine);
    color: var(--text-inverse);
    font-family: var(--font-body);
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.02em;
    white-space: nowrap;
    pointer-events: none;
  }

  .place-top {
    bottom: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
  }

  .place-bottom {
    top: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
  }

  .place-left {
    right: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
  }

  .place-right {
    left: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
  }
</style>
