<script lang="ts">
  interface Props {
    value?: number; // 0 to 100. If undefined, shows indeterminate sliding loading.
    class?: string;
  }

  let { value, class: className = '' }: Props = $props();
</script>

<div class="progress-container {className}" class:indeterminate={value === undefined}>
  <svg viewBox="0 0 800 22" preserveAspectRatio="none" class="progress-svg" aria-hidden="true">
    <!-- The background wave line (soft ink/wash) -->
    <path
      class="bg-path"
      d="M0,11 Q50,3 100,11 T200,11 T300,11 T400,11 T500,11 T600,11 T700,11 T800,11"
    />
    <!-- The filled wave line (active ink) -->
    <path
      class="fill-path"
      d="M0,11 Q50,3 100,11 T200,11 T300,11 T400,11 T500,11 T600,11 T700,11 T800,11"
      style="--pct: {value !== undefined ? 100 - value : 0}"
    />
  </svg>
</div>

<style>
  .progress-container {
    width: 100%;
    height: 14px;
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .progress-svg {
    width: 100%;
    height: 100%;
  }

  .bg-path {
    fill: none;
    stroke: var(--line-soft);
    stroke-width: 2.5;
    stroke-linecap: round;
    transition: stroke var(--t-base) var(--ease);
  }

  .fill-path {
    fill: none;
    stroke: var(--cell-edit-bg);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 800;
    /* When value is defined, shift the dashoffset */
    stroke-dashoffset: calc(var(--pct, 0) * 8px);
    transition:
      stroke-dashoffset var(--t-base) var(--ease),
      stroke var(--t-base) var(--ease);
  }

  /* Indeterminate loading state: slides a dash pattern across the path infinitely */
  .indeterminate .fill-path {
    animation: wave-loading 1.6s linear infinite;
    stroke-dasharray: 180 620;
  }

  @keyframes wave-loading {
    0% {
      stroke-dashoffset: 800;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
</style>
