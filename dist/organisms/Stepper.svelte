<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { StepItem } from '../domain.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    steps: StepItem[];
    /** Bindable id of the current step. */
    activeId?: string;
    /** Ids of steps already completed. */
    completedIds?: string[];
    orientation?: 'horizontal' | 'vertical';
    /**
     * When set, steps become buttons and this fires on activation. Omit it and
     * the stepper is a read-only progress display — not a row of dead buttons.
     */
    onstepclick?: (id: string) => void;
    /** Accessible name for the nav landmark. */
    label?: string;
    class?: string;
  }

  let {
    steps,
    activeId = $bindable(),
    completedIds = [],
    orientation = 'horizontal',
    onstepclick,
    label = 'Progress',
    class: className = '',
    ...restProps
  }: Props = $props();

  type StepState = 'complete' | 'current' | 'upcoming';

  function stateOf(step: StepItem): StepState {
    if (completedIds.includes(step.id)) return 'complete';
    if (step.id === activeId) return 'current';
    return 'upcoming';
  }

  const STATE_TEXT: Record<StepState, string> = {
    complete: 'Completed',
    current: 'Current step',
    upcoming: 'Not started'
  };

  function select(id: string) {
    activeId = id;
    onstepclick?.(id);
  }
</script>

<nav class="stepper {className}" aria-label={label} data-orientation={orientation} {...restProps}>
  <ol class="stepper-list">
    {#each steps as step, i (step.id)}
      {@const state = stateOf(step)}
      <li class="stepper-step state-{state}" aria-current={state === 'current' ? 'step' : undefined}>
        {#if onstepclick}
          <button type="button" class="stepper-content" onclick={() => select(step.id)}>
            {@render marker(state, i)}
            {@render text(step, state)}
          </button>
        {:else}
          <div class="stepper-content">
            {@render marker(state, i)}
            {@render text(step, state)}
          </div>
        {/if}

        {#if i < steps.length - 1}
          <span class="stepper-connector" aria-hidden="true"></span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

{#snippet marker(state: StepState, index: number)}
  <span class="stepper-marker" aria-hidden="true">
    {#if state === 'complete'}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    {:else}
      {index + 1}
    {/if}
  </span>
{/snippet}

{#snippet text(step: StepItem, state: StepState)}
  <span class="stepper-text">
    <span class="stepper-label">
      {step.label}
      <!-- State is carried by colour and by a checkmark; neither reaches a
           screen reader, so it is also stated in words. -->
      <span class="sr-only">— {STATE_TEXT[state]}</span>
    </span>
    {#if step.detail}
      <span class="stepper-detail">{step.detail}</span>
    {/if}
  </span>
{/snippet}

<style>
  .stepper {
    width: 100%;
    font-family: var(--font-body);
  }

  .stepper-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  }

  .stepper[data-orientation='horizontal'] .stepper-list {
    flex-direction: row;
    align-items: flex-start;
  }

  .stepper[data-orientation='vertical'] .stepper-list {
    flex-direction: column;
  }

  .stepper-step {
    position: relative;
    display: flex;
    align-items: flex-start;
    min-width: 0;
  }

  .stepper[data-orientation='horizontal'] .stepper-step {
    flex: 1;
  }

  .stepper[data-orientation='vertical'] .stepper-step {
    flex-direction: column;
    align-items: stretch;
  }

  .stepper-content {
    --pad-y: 4px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    padding: var(--pad-y) 4px;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    font-family: inherit;
    text-align: left;
    color: inherit;
  }

  button.stepper-content {
    cursor: pointer;
  }

  button.stepper-content:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .stepper-marker {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-round);
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    color: var(--text-3);
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
  }

  .stepper-marker svg {
    width: 13px;
    height: 13px;
  }

  .state-complete .stepper-marker {
    border-color: var(--success);
    color: var(--success);
  }

  .state-current .stepper-marker {
    border-color: var(--accent);
    color: var(--accent-ink);
  }

  .stepper-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    margin-top: 3px;
  }

  .stepper-label {
    font-size: 13px;
    color: var(--text-3);
  }

  .state-complete .stepper-label,
  .state-current .stepper-label {
    color: var(--text-1);
  }

  .state-current .stepper-label {
    font-weight: 600;
  }

  .stepper-detail {
    font-size: 11px;
    color: var(--text-3);
  }

  .stepper-connector {
    flex: 1;
    background: var(--line-mid);
  }

  .stepper[data-orientation='horizontal'] .stepper-connector {
    height: 1.5px;
    min-width: 16px;
    align-self: flex-start;
    margin: calc(var(--pad-y, 4px) + 13px - 0.75px) 8px 0;
  }

  .stepper[data-orientation='vertical'] .stepper-connector {
    width: 1.5px;
    min-height: 18px;
    align-self: auto;
    margin: 2px 0 2px 17px;
  }

  .state-complete .stepper-connector {
    background: var(--success);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* 760px is the library's structural line: nothing stays side by side below
     it, so a horizontal stepper becomes a vertical one. */
  @media (max-width: 760px) {
    .stepper[data-orientation='horizontal'] .stepper-list {
      flex-direction: column;
    }

    .stepper[data-orientation='horizontal'] .stepper-step {
      flex: none;
      flex-direction: column;
      align-items: stretch;
    }

    .stepper[data-orientation='horizontal'] .stepper-connector {
      width: 1.5px;
      /* The horizontal rule above sets min-width: 16px to keep the connector
         visible between two wide steps. Turning the connector on its side
         without resetting it leaves used width = max(1.5px, 16px), i.e. a
         16x18 block instead of a hairline — which is exactly what it drew. */
      min-width: 0;
      height: auto;
      min-height: 18px;
      align-self: auto;
      margin: 2px 0 2px 17px;
    }
  }

  @media (pointer: coarse) {
    .stepper-content {
      --pad-y: 8px;
    }
  }
</style>
