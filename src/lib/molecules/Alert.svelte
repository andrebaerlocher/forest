<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Status } from '../domain.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    status?: Status;
    title?: string;
    ondismiss?: () => void;
    class?: string;
    children?: Snippet;
  }

  let {
    status = 'neutral',
    title,
    ondismiss,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  // Alert role is contextual: errors (danger) are assertive (role="alert"),
  // all others are polite (role="status"). This ensures urgent alerts interrupt
  // screen reader output while routine status messages are queued.
  const role = $derived(status === 'danger' ? 'alert' : 'status');
</script>

<div class="alert alert-{status} {className}" {role} {...restProps}>
  <div class="alert-content">
    {#if title}
      <div class="alert-title">{title}</div>
    {/if}
    <div class="alert-body">
      {#if children}
        {@render children()}
      {/if}
    </div>
  </div>
  {#if ondismiss}
    <button
      type="button"
      class="alert-dismiss"
      aria-label="Dismiss"
      onclick={ondismiss}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  {/if}
</div>

<style>
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: var(--wash);
    border-left: 3px solid;
    border-radius: 0 var(--radius-s) var(--radius-s) 0;
    padding: 12px 14px;
  }

  .alert-neutral {
    border-left-color: var(--line-strong);
  }

  .alert-success {
    border-left-color: var(--success);
  }

  .alert-warning {
    border-left-color: var(--warning);
  }

  .alert-danger {
    border-left-color: var(--danger);
  }

  .alert-content {
    flex: 1;
  }

  .alert-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 4px;
  }

  .alert-body {
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-2);
  }

  .alert-dismiss {
    flex-shrink: 0;
    margin-left: auto;
    background: transparent;
    border: none;
    color: var(--text-3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-s);
    transition: color var(--t-fast) var(--ease);
  }

  .alert-dismiss:hover {
    color: var(--text-1);
  }

  .alert-dismiss:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }
</style>
