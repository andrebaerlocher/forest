<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    rows?: number;
    class?: string;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    disabled = false,
    invalid = false,
    rows = 4,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<textarea
  class="textarea {className}"
  bind:value
  {placeholder}
  {disabled}
  {rows}
  aria-invalid={invalid ? 'true' : undefined}
  {...restProps}
></textarea>

<style>
  .textarea {
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--text-1);
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: var(--pad-control-y) 12px;
    transition:
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
    resize: vertical;
    width: 100%;
  }

  .textarea::placeholder {
    color: var(--text-3);
  }

  .textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .textarea[aria-invalid="true"] {
    border-color: var(--danger);
  }

  .textarea:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
