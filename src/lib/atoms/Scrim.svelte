<script lang="ts">
  import { fade } from 'svelte/transition';

  interface Props {
    /** Stacking level the scrim sits just below */
    level?: 'drawer' | 'palette' | 'toast';
    onclick?: () => void;
    class?: string;
    [key: string]: any;
  }

  let { level = 'drawer', onclick, class: className = '', ...restProps }: Props = $props();

  const zByLevel = {
    drawer: 'calc(var(--z-drawer) - 1)',
    palette: 'calc(var(--z-palette) - 1)',
    toast: 'calc(var(--z-toast) - 1)'
  };
</script>

<!-- The room dimming, not going grey: the ink at low alpha. -->
<div
  class="scrim {className}"
  style="--scrim-z: {zByLevel[level]};"
  {onclick}
  transition:fade={{ duration: 150 }}
  role="presentation"
  {...restProps}
></div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: oklch(19% 0.05 var(--hue) / 40%);
    z-index: var(--scrim-z);
  }
</style>
