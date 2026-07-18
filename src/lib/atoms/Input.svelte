<script lang="ts">
  interface Props {
    value?: string | number;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    invalid?: boolean;
    isNumeric?: boolean;
    class?: string;
    [key: string]: any;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    type = 'text',
    disabled = false,
    invalid = false,
    isNumeric = false,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<input
  {type}
  bind:value
  {placeholder}
  {disabled}
  aria-invalid={invalid ? "true" : undefined}
  class="input {className}"
  class:numeric={isNumeric || type === 'number'}
  {...restProps}
/>

<style>
  .input {
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
    width: 100%;
  }

  .input::placeholder {
    color: var(--text-3);
  }

  .input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .input[aria-invalid="true"] {
    border-color: var(--danger);
  }

  .input.numeric {
    font-family: var(--font-num);
    text-align: right;
  }

  .input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
