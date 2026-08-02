<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Callout from '../lib/molecules/Callout.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Callout',
    component: Callout,
    tags: ['autodocs']
  });
</script>

{#snippet neutralBody()}
All metrics reported in this study are derived from production telemetry collected across the Q4 evaluation period.
{/snippet}

{#snippet infoBody()}
The inter-rater reliability dashboard plots Cohen's κ and Krippendorff's α alongside rater agreement curves to identify drift in scoring behaviour.
{/snippet}

{#snippet warningBody()}
A gap between human consensus and model predictions may indicate either a mislabeled training example or a data distribution shift in the production corpus.
{/snippet}

{#snippet successBody()}
The automated scoring model achieved 91% agreement with human raters, with κ = 0.87 across all rubric dimensions.
{/snippet}

{#snippet retrospectiveBody()}
This design choice prioritized latency over throughput: we cache recommendation scores for 30 seconds rather than recomputing on every request.
{/snippet}

<Story name="Neutral" args={{ tone: 'neutral', children: neutralBody }} />

<Story name="Info" args={{ tone: 'info', children: infoBody }} />

<Story name="Warning" args={{ tone: 'warning', children: warningBody }} />

<Story name="Success" args={{ tone: 'success', children: successBody }} />

<Story name="With label" args={{ tone: 'neutral', label: 'Retrospective', children: retrospectiveBody }} />
