<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    id: string;
    children: Snippet;
    [key: string]: any;
  }

  let {
    label,
    hint = '',
    error = '',
    invalid = false,
    id,
    children,
    ...restProps
  }: Props = $props();
</script>

<div class="field" {...restProps}>
  <label class="field-label" for={id}>{label}</label>
  {@render children()}
  {#if invalid && error}
    <span class="field-error">{error}</span>
  {:else if hint}
    <span class="field-hint">{hint}</span>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 300px;
  }

  .field-label {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .field-hint {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--text-3);
  }

  .field-error {
    font-family: var(--font-body);
    font-size: 12px;
    color: var(--danger);
  }
</style>
