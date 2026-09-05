<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { CaseStudySummaryData } from '../domain.js';
  import { type HeadingLevel, provideHeadingLevel } from '../headingLevel.js';
  import CaseStudyCard from '../molecules/CaseStudyCard.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    studies: CaseStudySummaryData[];
    /** Heading level for the cards. The page owns its <h1>, so default <h2>. */
    cardLevel?: HeadingLevel;
    /** Accessible name for the list. */
    label?: string;
    class?: string;
    /** Intro copy rendered above the grid. */
    children?: Snippet;
  }

  let {
    studies,
    cardLevel = 2,
    label = 'Case studies',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  // Read once: setContext only runs during initialisation, so the level is
  // fixed for this grid's lifetime.
  // svelte-ignore state_referenced_locally
  provideHeadingLevel(cardLevel);
</script>

<div class="cs-index {className}" {...restProps}>
  {#if children}
    <div class="cs-index-intro">
      {@render children()}
    </div>
  {/if}

  <!-- Safari drops list semantics from a list-style: none <ul>, so the role is
       restated explicitly. Same reasoning as DataTable's card mode. -->
  <ul class="cs-index-grid" aria-label={label}>
    {#each studies as study (study.slug)}
      <li>
        <CaseStudyCard
          title={study.title}
          href={study.href}
          standfirst={study.standfirst}
          tags={study.tags}
          metric={study.metric}
        />
      </li>
    {/each}
  </ul>
</div>

<style>
  .cs-index {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    font-family: var(--font-body);
    color: var(--text-1);
  }

  .cs-index-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .cs-index-grid > li {
    display: flex;
  }

  @media (max-width: 600px) {
    .cs-index-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
