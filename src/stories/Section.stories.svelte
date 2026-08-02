<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Section from '../lib/organisms/Section.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Section',
    component: Section,
    tags: ['autodocs']
  });
</script>

{#snippet sectionBody()}
  <p>
    The recommendation engine uses a multi-armed bandit approach to explore the learner's knowledge gaps while exploiting high-confidence predictions. This balance is tuned per institution based on their performance goals.
  </p>
  <p>
    Response times are kept below 200µs by caching scores for 30 seconds and batching user requests into micro-transactions.
  </p>
{/snippet}

<Story
  name="Standard"
  args={{
    id: 'section-1',
    title: 'Architecture Overview',
    number: '01',
    children: sectionBody
  }}
/>

<Story
  name="Level 3"
  args={{
    id: 'section-2',
    title: 'Latency Analysis',
    level: 3,
    children: sectionBody
  }}
/>

<Story
  name="Level 4"
  args={{
    id: 'section-3',
    title: 'Caching Strategy',
    level: 4,
    children: sectionBody
  }}
/>
