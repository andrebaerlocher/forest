<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PullQuote from '../lib/molecules/PullQuote.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/PullQuote',
    component: PullQuote,
    tags: ['autodocs']
  });
</script>

{#snippet quoteOne()}
Reducing p99 latency from 2.4s to 165µs required rethinking both our indexing strategy and our request batching layer. The gains came from understanding where the tail latency was actually hiding.
{/snippet}

{#snippet attributionOne()}
—Engineering lead, Anchor-text generation platform
{/snippet}

{#snippet quoteTwo()}
We learned that adaptive learning systems don't just need accuracy—they need the right accuracy at the right time, in the learner's zone of proximal development.
{/snippet}

<Story name="Standard" args={{ children: quoteOne, attribution: attributionOne }} />

<Story name="Without attribution" args={{ children: quoteTwo }} />
