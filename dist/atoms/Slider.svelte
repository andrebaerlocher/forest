<script module lang="ts">
  let nextSliderId = 0;
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    id?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
    label?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    onchange?: (value: number) => void;
    class?: string;
  }

  let {
    id,
    value = $bindable(50),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = false,
    label,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    onchange,
    class: className = '',
    ...restProps
  }: Props = $props();

  const autoId = `slider-${++nextSliderId}`;
  const inputId = $derived(id ?? autoId);
  const labelId = $derived(`${inputId}-label`);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const val = Number(target.value);
    value = val;
    if (onchange) {
      onchange(val);
    }
  }

  const percentage = $derived(
    max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0
  );
</script>

<div class="slider-control {className}" class:disabled {...restProps}>
  {#if label || showValue}
    <div class="slider-header">
      {#if label}
        <label id={labelId} for={inputId} class="slider-label">{label}</label>
      {/if}
      {#if showValue}
        <span class="slider-value">{value}</span>
      {/if}
    </div>
  {/if}
  <div class="slider-track-wrapper">
    <input
      id={inputId}
      type="range"
      {min}
      {max}
      {step}
      {value}
      {disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
      oninput={handleInput}
      style="--slider-progress: {percentage}%;"
    />
  </div>
</div>

<style>
  .slider-control {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: var(--font-body);
    width: 100%;
  }

  .slider-control.disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  .slider-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .slider-label {
    color: var(--text-1);
    font-weight: 500;
    cursor: pointer;
  }

  .slider-value {
    color: var(--text-2);
    font-variant-numeric: tabular-nums;
  }

  .slider-track-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(
      to right,
      var(--accent) 0%,
      var(--accent) var(--slider-progress),
      var(--line-mid) var(--slider-progress),
      var(--line-mid) 100%
    );
    outline: none;
    cursor: pointer;
    margin: 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--paper-l);
    border: 2px solid var(--accent);
    cursor: pointer;
    transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--paper-l);
    border: 2px solid var(--accent);
    cursor: pointer;
    transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
  }

  input[type="range"]:focus-visible::-webkit-slider-thumb {
    transform: scale(1.15);
    box-shadow: 0 0 0 3px oklch(29% 0.055 var(--hue) / 25%);
  }

  input[type="range"]:focus-visible::-moz-range-thumb {
    transform: scale(1.15);
    box-shadow: 0 0 0 3px oklch(29% 0.055 var(--hue) / 25%);
  }
</style>
