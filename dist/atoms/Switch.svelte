<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    children?: Snippet;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    id = `switch-${Math.random().toString(36).substring(2, 9)}`,
    children,
    ...restProps
  }: Props = $props();
</script>

<label class="opt" class:disabled for={id}>
  <input
    type="checkbox"
    bind:checked
    {disabled}
    {id}
    class="switch hit-44"
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

  .switch {
    appearance: none;
    width: 40px;
    height: 22px;
    border-radius: var(--radius-round);
    cursor: pointer;
    background: var(--wash);
    border: 1.5px solid var(--line-mid);
    position: relative;
    vertical-align: -6px;
    margin: 0 8px 0 0;
    transition:
      border-color var(--t-base) var(--ease),
      background var(--t-base) var(--ease);
    display: inline-block;
  }

  .switch::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--text-3);
    transition:
      transform var(--t-base) var(--ease),
      background var(--t-base) var(--ease);
  }

  .switch:checked {
    background: var(--cell-edit-bg);
    border-color: var(--cell-edit-bg);
  }

  .switch:checked::before {
    transform: translateX(18px);
    background: var(--cell-edit-text);
  }

  .switch:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .switch:disabled {
    cursor: not-allowed;
  }
  @media (pointer: coarse) {
    .opt {
      min-height: 44px;
    }
  }
</style>
