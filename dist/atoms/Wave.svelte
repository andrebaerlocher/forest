<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal';
    class?: string;
  }

  let { orientation = 'vertical', class: className = '', ...restProps }: Props = $props();
</script>

<div class="wave {className}" class:horizontal={orientation === 'horizontal'} aria-hidden="true" {...restProps}>
  {#if orientation === 'vertical'}
    <svg viewBox="0 0 22 800" preserveAspectRatio="none">
      <path d="M0,0 L12,0 C19,50 5,95 10,150 C16,210 4,260 9,320 C15,380 5,430 10,490 C16,550 4,600 9,660 C14,720 6,760 10,800 L0,800 Z"/>
    </svg>
  {:else}
    <svg viewBox="0 0 800 22" preserveAspectRatio="none">
      <path d="M0,0 L0,12 C50,19 95,5 150,10 C210,16 260,4 320,9 C380,15 430,5 490,10 C550,16 600,4 660,9 C720,14 760,6 800,10 L800,0 Z"/>
    </svg>
  {/if}
</div>

<style>
  .wave {
    width: 22px;
    height: 100%;
    position: relative;
    flex-shrink: 0;
  }

  .wave.horizontal {
    width: 100%;
    height: 22px;
  }

  .wave svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .wave path {
    fill: var(--spine);
    transition: fill var(--t-slow) var(--ease);
  }
</style>
