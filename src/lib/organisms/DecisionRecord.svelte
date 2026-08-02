<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { DecisionStatus, RejectedAlternative } from '../domain.js';
  import StatusPill from '../molecules/StatusPill.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    id: string;
    title: string;
    status?: DecisionStatus;
    context: string;
    decision: string;
    consequences?: string[];
    alternatives?: RejectedAlternative[];
    level?: 2 | 3 | 4 | 5 | 6;
    class?: string;
  }

  let {
    id,
    title,
    status,
    context,
    decision,
    consequences,
    alternatives,
    level = 3,
    class: className = '',
    ...restProps
  }: Props = $props();

  const statusTone: Record<DecisionStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
    proposed: 'neutral',
    accepted: 'success',
    superseded: 'warning',
    deprecated: 'danger',
  };

  const statusLabel: Record<DecisionStatus, string> = {
    proposed: 'Proposed',
    accepted: 'Accepted',
    superseded: 'Superseded',
    deprecated: 'Deprecated',
  };

  let headingId = $derived(`${id}-heading`);
</script>

<section
  {id}
  aria-labelledby={headingId}
  class="decision-record {className}"
  {...restProps}
>
  <header class="head">
    <svelte:element this={`h${level}`} id={headingId} class="title">{title}</svelte:element>
    {#if status}
      <StatusPill status={statusTone[status]} label={statusLabel[status]} />
    {/if}
  </header>

  <div class="part">
    <p class="part-label">Context</p>
    <p class="part-body">{context}</p>
  </div>

  <div class="part">
    <p class="part-label">Decision</p>
    <p class="part-body">{decision}</p>
  </div>

  {#if consequences && consequences.length > 0}
    <div class="part">
      <p class="part-label">Consequences</p>
      <ul class="consequences">
        {#each consequences as item (item)}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if alternatives && alternatives.length > 0}
    <div class="part">
      <p class="part-label">Alternatives rejected</p>
      <ul class="alternatives">
        {#each alternatives as alt (alt.option)}
          <li>
            <span class="option">{alt.option}</span>
            <span class="reason">{alt.rejectedBecause}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</section>

<style>
  .decision-record {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 20px;
    font-family: var(--font-body);
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-1);
  }

  .part {
    margin-bottom: 14px;
  }

  .part:last-child {
    margin-bottom: 0;
  }

  .part-label {
    margin: 0 0 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .part-body {
    margin: 0;
    font-size: var(--font-data);
    color: var(--text-2);
    line-height: 1.6;
  }

  .consequences {
    margin: 0;
    padding-left: 18px;
    font-size: var(--font-data);
    color: var(--text-2);
    line-height: 1.6;
  }

  .alternatives {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .alternatives li {
    padding: 8px 10px;
    border: 1.5px solid transparent;
    border-left-color: var(--line-mid);
    background: var(--wash);
    border-radius: var(--radius-s);
  }

  .option {
    display: block;
    font-size: var(--font-data);
    color: var(--text-1);
  }

  .reason {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    color: var(--text-3);
  }
</style>
