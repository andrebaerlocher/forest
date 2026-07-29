<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    group: any;
    value: any;
    name?: string;
    disabled?: boolean;
    id?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    group = $bindable(),
    value,
    name,
    disabled = false,
    id = `radio-${Math.random().toString(36).substring(2, 9)}`,
    children,
    ...restProps
  }: Props = $props();
</script>

<label class="opt" class:disabled for={id}>
  <input
    type="radio"
    bind:group
    {value}
    {name}
    {disabled}
    {id}
    class="radio hit-44"
    {...restProps}
  />
  {#if children}
    {@render children()}
  {/if}
</label>

<style>
  .opt {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-2);
    cursor: pointer;
    margin-right: 18px;
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  .opt.disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .radio {
    appearance: none;
    width: 18px;
    height: 18px;
    margin: 0 8px 0 0;
    cursor: pointer;
    border: 1.5px solid var(--text-3);
    background: transparent;
    transition:
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
    display: inline-grid;
    place-content: center;
    border-radius: 50%;
  }

  .radio:hover:not(:disabled) {
    border-color: var(--text-1);
  }

  .radio:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .radio::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: scale(0);
    transition: transform var(--t-fast) var(--ease);
    background: var(--accent);
  }

  .radio:checked {
    border-color: var(--accent);
  }

  .radio:checked::before {
    transform: scale(1);
  }

  .radio:disabled {
    cursor: not-allowed;
  }
  /* A 44px hit box on an 18px mark overflows the label's line box, so
     stacked options would steal each other's taps. */
  @media (pointer: coarse) {
    .opt {
      min-height: 44px;
    }
  }
</style>
