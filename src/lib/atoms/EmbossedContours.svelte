<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children }: Props = $props();
</script>

<div class="embossed-panel {className}">
  <svg
    class="contours"
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <g class="contour-lines">
      <path
        d="M-40 115 C140 20 230 170 365 90 S590 40 720 120 S960 160 1240 30"
      />
      <path
        d="M-30 190 C135 95 250 265 405 165 S625 95 770 190 S1030 220 1230 125"
      />
      <path
        d="M-60 280 C120 175 250 360 430 245 S640 190 815 275 S1040 325 1250 220"
      />
      <path
        d="M-40 365 C120 270 295 455 460 330 S690 275 850 365 S1060 420 1250 325"
      />
      <path
        d="M-30 465 C170 350 305 550 510 420 S735 365 925 465 S1095 510 1240 430"
      />
      <path
        d="M-30 570 C155 450 355 640 555 515 S800 475 980 570 S1110 630 1230 550"
      />
    </g>
  </svg>

  <div class="content">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .embossed-panel {
    position: relative;
    overflow: hidden;
    min-height: 26rem;
    isolation: isolate;
    background: var(--canvas);
    transition: background var(--t-base) var(--ease);
  }

  .embossed-panel::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: "";
    opacity: 0.045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .contours {
    position: absolute;
    inset: -2%;
    z-index: -1;
    width: 104%;
    height: 104%;
  }

  .contour-lines {
    fill: none;
    stroke: var(--canvas);
    stroke-linecap: round;
    stroke-width: 1.2;
    transition:
      stroke var(--t-base) var(--ease),
      opacity var(--t-base) var(--ease);
    filter: drop-shadow(1.2px 1.2px 1px var(--neomorphic-shadow))
      drop-shadow(-1px -1px 0.8px var(--neomorphic-highlight));
  }

  :global([data-mode="dark"]) .contour-lines {
    opacity: 0.35;
  }

  .content {
    position: relative;
  }
</style>
