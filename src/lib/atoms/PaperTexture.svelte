<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!-- .on-ink flips the canvas tokens for everything rendered on this paper -->
<div class="indigo-paper on-ink {className}">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .indigo-paper {
    /* Expressing the paper colors using OKLCH linked to the dynamic --hue variable */
    --paper: oklch(22% 0.055 var(--hue));
    --paper-dark: oklch(16% 0.055 var(--hue));
    --paper-light: oklch(28% 0.055 var(--hue));

    position: relative;
    overflow: hidden;
    isolation: isolate;
    color: var(--text-inverse, #f4f0e6);
    background:
      /* soft uneven pigment */
      radial-gradient(ellipse at 18% 10%, rgb(255 255 255 / 7%), transparent 42%),
      radial-gradient(ellipse at 78% 76%, rgb(0 0 0 / 18%), transparent 48%),
      /* very subtle directional fibres */
      repeating-linear-gradient(
        100deg,
        transparent 0 5px,
        rgb(255 255 255 / 1.8%) 6px,
        transparent 8px 16px
      ),
      linear-gradient(135deg, var(--paper-light), var(--paper) 52%, var(--paper-dark));
  }

  .indigo-paper::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    content: "";
    opacity: 0.2;
    mix-blend-mode: screen;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.65'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  .indigo-paper::after {
    position: absolute;
    z-index: -1;
    inset: 0;
    pointer-events: none;
    opacity: 0.17;
    background: repeating-radial-gradient(
      ellipse at 25% 50%,
      transparent 0 1px,
      rgb(255 255 255 / 8%) 1.5px 2px,
      transparent 2.5px 5px
    );
    mix-blend-mode: soft-light;
  }
</style>
