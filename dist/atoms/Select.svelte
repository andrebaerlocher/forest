<script lang="ts" generics="T = unknown">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLSelectAttributes, 'value'> {
    value?: T;
    disabled?: boolean;
    invalid?: boolean;
    children?: Snippet;
    class?: string;
  }

  let {
    value = $bindable(),
    disabled = false,
    invalid = false,
    children,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<div class="select-container" class:disabled class:invalid>
  <select
    class="select {className}"
    bind:value
    {disabled}
    aria-invalid={invalid ? 'true' : undefined}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </select>
  <div class="chevron-overlay" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
</div>

<style>
  .select-container {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .select {
    appearance: none;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: var(--pad-control-y) 36px var(--pad-control-y) 12px;
    transition:
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
    width: 100%;
    cursor: pointer;
  }

  .select:focus {
    outline: none;
    border-color: var(--accent);
  }

  .select-container.invalid .select {
    border-color: var(--danger);
  }

  .select-container.disabled .select {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .chevron-overlay {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
    color: var(--text-3);
    transition: color var(--t-fast) var(--ease);
  }

  .select:focus + .chevron-overlay {
    color: var(--accent-ink);
  }

  .chevron-overlay svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
