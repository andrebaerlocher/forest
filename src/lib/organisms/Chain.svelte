<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ChainStep } from '../domain.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    id?: string;
    /** Frame caption, e.g. "BFF Server Execution Order". */
    title?: string;
    /** What arrives at the top of the chain, e.g. "Client Request". */
    entry?: string;
    /** What the chain hands off to, e.g. "Handler". */
    exit?: string;
    steps: ChainStep[];
    class?: string;
  }

  let {
    id,
    title,
    entry,
    exit,
    steps,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<!-- An ordered pipeline is a list, not a picture. Drawn as ASCII in a code
     block it reads as source the reader is expected to parse; as boxes and
     arrows it needs layout it doesn't earn. An <ol> is what it actually is,
     so it stays selectable, searchable and legible at any width. -->
<section {id} class="chain {className}" {...restProps}>
  {#if title}
    <p class="chain-title">{title}</p>
  {/if}

  <div class="chain-body">
    {#if entry}
      <p class="chain-terminal chain-entry">{entry}</p>
    {/if}

    <ol class="chain-steps">
      {#each steps as step, index (step.label)}
        <li class="chain-step" class:muted={step.muted}>
          <span class="chain-num">{String(index + 1).padStart(2, '0')}</span>
          <span class="chain-text">
            <span class="chain-label">{step.label}</span>
            {#if step.detail}<span class="chain-detail">{step.detail}</span>{/if}
          </span>
        </li>
      {/each}
    </ol>

    {#if exit}
      <p class="chain-terminal chain-exit">{exit}</p>
    {/if}
  </div>
</section>

<style>
  .chain {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    overflow: hidden;
    font-family: var(--font-body);
  }

  .chain-title {
    margin: 0;
    padding: 8px 14px;
    border-bottom: 1px solid var(--line-soft);
    font-family: var(--font-num);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--text-3);
  }

  .chain-body {
    padding: 14px;
  }

  .chain-terminal {
    margin: 0;
    padding-left: 34px;
    font-family: var(--font-num);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent-ink);
  }

  .chain-entry {
    padding-bottom: 10px;
  }

  .chain-exit {
    padding-top: 10px;
  }

  .chain-steps {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
  }

  .chain-step {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 5px 0;
  }

  /* One continuous thread behind the numbers rather than a rule per row: the
     chain is the point, and per-row borders would read as a table. Stops short
     of the last number so the line doesn't dangle past the end of the list. */
  .chain-step::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--rule-soft);
  }

  .chain-step:first-child::before {
    top: 12px;
  }

  .chain-step:last-child::before {
    bottom: auto;
    height: 12px;
  }

  .chain-num {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    width: 21px;
    /* Sits on the thread, so it needs the paper under it to break the line. */
    background: var(--raised);
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    line-height: 1.6;
    text-align: center;
    color: var(--accent-ink);
  }

  .chain-text {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
    min-width: 0;
  }

  .chain-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-1);
  }

  .chain-detail {
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-3);
  }

  /* A step that is present but not the reason this chain is being shown. */
  .chain-step.muted .chain-label {
    font-weight: 400;
    color: var(--text-2);
  }
</style>
