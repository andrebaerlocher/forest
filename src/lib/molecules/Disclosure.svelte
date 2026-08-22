<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fly } from 'svelte/transition';
  import Chevron from '../atoms/Chevron.svelte';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Anchor target and panel-id stem. This is the deep link readers get sent. */
    id: string;
    /** Say what is inside, not what the control does — "anzeigen" belongs to the chevron. */
    label: string;
    /**
     * How much is inside: "13", "9 Stufen". The whole point of a closed
     * disclosure is that a skimmer can tell the substance exists without
     * opening it, and the count is what tells them.
     */
    count?: number | string;
    /** One line under the label, visible in both states. */
    hint?: string;
    open?: boolean;
    /** Initial state. Ignored once the reader (or a matching hash) has decided. */
    startOpen?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    id,
    label,
    count,
    hint,
    open = $bindable(),
    startOpen = false,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let internalOpen = $state(startOpen);
  let isOpen = $derived(open ?? internalOpen);

  let panelId = $derived(`${id}-panel`);

  function toggle() {
    const next = !isOpen;
    internalOpen = next;
    open = next;
  }

  // A link to a collapsed section that lands on a collapsed section is a broken
  // link. Deep links have to win over the default state, on load and on every
  // subsequent hash change.
  $effect(() => {
    const openIfTargeted = () => {
      if (window.location.hash !== `#${id}`) return;
      internalOpen = true;
      open = true;
    };
    openIfTargeted();
    window.addEventListener('hashchange', openIfTargeted);
    return () => window.removeEventListener('hashchange', openIfTargeted);
  });
</script>

<div {id} class="disclosure {className}" {...restProps}>
  <button
    type="button"
    class="disclosure-trigger"
    aria-expanded={isOpen}
    aria-controls={panelId}
    onclick={toggle}
  >
    <Chevron open={isOpen} direction="right" />
    <span class="disclosure-label">{label}</span>
    {#if count !== undefined}
      <span class="disclosure-count">{count}</span>
    {/if}
  </button>

  {#if hint}
    <p class="disclosure-hint">{hint}</p>
  {/if}

  {#if isOpen}
    <div id={panelId} class="disclosure-panel" transition:fly={{ duration: 200, y: -6 }}>
      {#if children}
        {@render children()}
      {/if}
    </div>
  {/if}
</div>

<style>
  .disclosure {
    display: flex;
    flex-direction: column;
    gap: 8px;
    scroll-margin-top: 64px;
  }

  /* The whole row is the target, not the words — a 13px label is a 60px-wide
     hit area otherwise. Transparent border so the focus ring costs no pixels. */
  .disclosure-trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    margin: 0;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    border-left-color: var(--line-mid);
    color: var(--text-2);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-align: left;
    cursor: pointer;
    transition:
      color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  @media (hover: hover) {
    .disclosure-trigger:hover {
      color: var(--text-1);
      background: var(--wash-hover);
      border-left-color: var(--accent);
    }
  }

  .disclosure-trigger[aria-expanded='true'] {
    color: var(--text-1);
    border-left-color: var(--accent);
  }

  .disclosure-trigger:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .disclosure-label {
    flex: 1;
    min-width: 0;
  }

  .disclosure-count {
    flex-shrink: 0;
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    font-weight: 500;
    color: var(--accent-ink);
  }

  .disclosure-hint {
    margin: 0;
    padding-left: 34px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-3);
    max-width: 62ch;
  }

  /* Indented under the trigger's chevron so an open panel reads as belonging
     to it rather than as the next sibling section. */
  .disclosure-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-left: 34px;
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--text-1);
  }

  .disclosure-panel > :global(p) {
    margin: 0;
    max-width: 68ch;
  }

  @media (max-width: 600px) {
    .disclosure-hint,
    .disclosure-panel {
      padding-left: 0;
    }
  }
</style>
