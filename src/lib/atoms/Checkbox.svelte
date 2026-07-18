<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    id = `checkbox-${Math.random().toString(36).substring(2, 9)}`,
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
    class="check"
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

  .check {
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
    border-radius: 5px;
  }

  .check:hover:not(:disabled) {
    border-color: var(--text-1);
  }

  .check:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .check::before {
    content: "";
    width: 10px;
    height: 10px;
    transform: scale(0);
    transition: transform var(--t-fast) var(--ease);
    clip-path: polygon(14% 52%, 0 68%, 38% 100%, 100% 22%, 84% 8%, 36% 68%);
    background: var(--text-inverse);
  }

  .check:checked {
    background: var(--cell-edit-bg);
    border-color: var(--cell-edit-bg);
  }

  .check:checked::before {
    transform: scale(1);
    background: var(--cell-edit-text);
  }

  .check:disabled {
    cursor: not-allowed;
  }
</style>
