<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Standfirst from '../lib/molecules/Standfirst.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Standfirst',
    component: Standfirst,
    tags: ['autodocs']
  });
</script>

{#snippet introText()}
A learning platform for adaptive assessment and recommendation, serving 10,000+ institutions with real-time feedback and exercise sequencing via a high-performance backend.
{/snippet}

{#snippet secondaryText()}
This system combines knowledge state diagnosis with a recommendation engine that returns the three next-best exercises in under 200µs, excluding network hops.
{/snippet}

<Story name="Standard" args={{ children: introText }} />

<Story name="Secondary" args={{ children: secondaryText }} />
