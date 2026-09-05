<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    id: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    children?: Snippet;
  }

  let {
    label,
    id,
    hint,
    error,
    invalid = false,
    children
  }: Props = $props();
</script>

<div class="field-row" class:invalid>
  <div class="label-col">
    <label class="field-label" for={id}>{label}</label>
    {#if hint && !invalid}
      <span class="field-hint">{hint}</span>
    {/if}
    {#if error && invalid}
      <span class="field-error">{error}</span>
    {/if}
  </div>
  <div class="control-col">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .field-row {
    display: flex;
    gap: 24px;
    padding: 16px 0;
    border-bottom: 1px solid var(--line-soft);
    align-items: baseline;
    width: 100%;
  }

  .label-col {
    width: 210px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    cursor: pointer;
  }

  .control-col {
    flex: 1;
    min-width: 0;
    max-width: 420px;
  }

  .field-hint {
    font-size: 11.5px;
    color: var(--text-3);
    line-height: 1.4;
  }

  .field-error {
    font-size: 11.5px;
    color: var(--danger);
    line-height: 1.4;
  }

  @media (max-width: 600px) {
    .field-row {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;
    }
    .label-col {
      width: 100%;
    }
  }
</style>
