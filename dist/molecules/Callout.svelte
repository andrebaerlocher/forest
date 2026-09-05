<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    tone?: 'neutral' | 'info' | 'warning' | 'success';
    label?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    tone = 'neutral',
    label,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<aside class="callout callout-{tone} {className}" {...restProps}>
  {#if label}
    <div class="callout-label" class:tone-neutral={tone === 'neutral'} class:tone-info={tone === 'info'} class:tone-warning={tone === 'warning'} class:tone-success={tone === 'success'}>
      {label}
    </div>
  {/if}
  <div class="callout-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
</aside>

<style>
  .callout {
    border-left: 3px solid;
    background: var(--wash);
    border-radius: 0 var(--radius-s) var(--radius-s) 0;
    padding: 14px 18px;
    margin: 0;
  }

  .callout-neutral {
    border-left-color: var(--line-strong);
  }

  .callout-info {
    border-left-color: var(--accent);
  }

  .callout-warning {
    border-left-color: var(--warning);
  }

  .callout-success {
    border-left-color: var(--success);
  }

  .callout-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .callout-label.tone-neutral {
    color: var(--line-strong);
  }

  .callout-label.tone-info {
    color: var(--accent);
  }

  .callout-label.tone-warning {
    color: var(--warning);
  }

  .callout-label.tone-success {
    color: var(--success);
  }

  .callout-body {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-1);
  }
</style>
