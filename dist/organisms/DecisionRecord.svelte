<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import FormattedText from '../atoms/FormattedText.svelte';
  import type { DecisionStatus, RejectedAlternative } from '../domain.js';
  import StatusPill from '../molecules/StatusPill.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    id: string;
    title: string;
    status?: DecisionStatus;
    context: string;
    decision: string;
    /** Neutral consequences of the decision. Can be used standalone or alongside `gains`/`costs`. */
    consequences?: string[];
    /** What the decision buys. Rendered beside `costs`. */
    gains?: string[];
    /** What it costs — the trade-off accepted knowingly, not a drawback found later. */
    costs?: string[];
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
    gains,
    costs,
    alternatives,
    level = 3,
    class: className = '',
    ...restProps
  }: Props = $props();

  const statusTone: Record<DecisionStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
    proposed: 'neutral',
    accepted: 'success',
    final: 'success',
    rejected: 'danger',
    superseded: 'warning',
    deprecated: 'danger',
  };

  const statusVariant: Record<DecisionStatus, 'solid' | 'dashed' | 'strong'> = {
    proposed: 'dashed',
    accepted: 'dashed',
    final: 'strong',
    rejected: 'solid',
    superseded: 'solid',
    deprecated: 'solid',
  };

  const statusLabel: Record<DecisionStatus, string> = {
    proposed: 'Proposed',
    accepted: 'Accepted',
    final: 'Final',
    rejected: 'Rejected',
    superseded: 'Superseded',
    deprecated: 'Deprecated',
  };

  let headingId = $derived(`${id}-heading`);

  let hasSplit = $derived((gains?.length ?? 0) > 0 || (costs?.length ?? 0) > 0);
  let hasConsequences = $derived((consequences?.length ?? 0) > 0);
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
      <StatusPill
        status={statusTone[status]}
        variant={statusVariant[status]}
        label={statusLabel[status]}
      />
    {/if}
  </header>

  <div class="part">
    <p class="part-label">Kontext</p>
    <!-- FormattedText emits block-level markup, so this wrapper cannot be a
         <p> — the browser closes the paragraph early and hydration mismatches. -->
    <div class="part-body"><FormattedText text={context} /></div>
  </div>

  <div class="part">
    <p class="part-label">Entscheidung</p>
    <div class="part-body"><FormattedText text={decision} /></div>
  </div>

  {#if hasSplit}
    <div class="part">
      <p class="part-label">Auswirkungen</p>
      <div class="ledger">
        {#if gains && gains.length > 0}
          <div class="ledger-col">
            <p class="ledger-label gain">Dafür</p>
            <ul class="ledger-list gain">
              {#each gains as item (item)}
                <li><FormattedText text={item} /></li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if costs && costs.length > 0}
          <div class="ledger-col">
            <p class="ledger-label cost">Dagegen</p>
            <ul class="ledger-list cost">
              {#each costs as item (item)}
                <li><FormattedText text={item} /></li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if consequences && consequences.length > 0}
          <div class="ledger-col">
            <p class="ledger-label neutral">Neutral</p>
            <ul class="ledger-list neutral">
              {#each consequences as item (item)}
                <li><FormattedText text={item} /></li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {:else if consequences && consequences.length > 0}
    <div class="part">
      <p class="part-label">Auswirkungen</p>
      <ul class="consequences">
        {#each consequences as item (item)}
          <li><FormattedText text={item} /></li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if alternatives && alternatives.length > 0}
    <div class="part">
      <p class="part-label">Abgelehnte Alternativen</p>
      <ul class="alternatives">
        {#each alternatives as alt (alt.option)}
          <li>
            <span class="option"><FormattedText text={alt.option} /></span>
            <span class="reason"><FormattedText text={alt.rejectedBecause} /></span>
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

  /* Below the field line the title wraps to two or three lines and the pill
     gets squeezed into a column beside it. A status is a property of the
     decision, not a thing that must sit on the title's line, so it drops
     underneath and reads left-aligned with everything else. */
  @media (max-width: 600px) {
    .head {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
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

  /* Two columns when the record is wide enough, one when it isn't — the split
     is about pairing gains against costs, and a 200px column can't pair. */
  .ledger {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px 24px;
  }

  .ledger-label {
    margin: 0 0 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Colour sits on the label and the marker only. Tinting 13px body copy is
     what turns an ADR into an alert box — and status hues can't hold 4.5:1
     against --raised at that size in both modes anyway. */
  .ledger-label.gain {
    color: var(--success);
  }

  .ledger-label.cost {
    color: var(--warning);
  }

  .ledger-label.neutral {
    color: var(--text-3);
  }

  .ledger-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--font-data);
    color: var(--text-2);
    line-height: 1.6;
  }

  .ledger-list li {
    position: relative;
    padding-left: 16px;
  }

  .ledger-list li + li {
    margin-top: 4px;
  }

  .ledger-list li::before {
    position: absolute;
    left: 0;
    font-family: var(--font-num);
    /* The glyph is decoration; "Dafür"/"Dagegen"/"Neutral" already carries the meaning. */
    speak: never;
  }

  .ledger-list.gain li::before {
    content: '+';
    color: var(--success);
  }

  .ledger-list.cost li::before {
    content: '−';
    color: var(--warning);
  }

  .ledger-list.neutral li::before {
    content: '•';
    color: var(--text-3);
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

  /* 11px was too small for what this actually holds — two to four lines of the
     densest reasoning in the record. It reads as a footnote and gets skipped. */
  .reason {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--text-3);
  }
</style>
