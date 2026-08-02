<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MetricGrid from '../lib/molecules/MetricGrid.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/MetricGrid',
    component: MetricGrid,
    tags: ['autodocs']
  });
</script>

<Story
  name="Standard"
  args={{
    metrics: [
      { label: 'p99 latency', value: '165µs', detail: 'excluding network hops' },
      { label: "Cohen's κ", value: '0.81', detail: 'inter-rater agreement' },
      { label: 'Throughput', value: '12.5K', detail: 'requests/second' },
      { label: 'Availability', value: '99.98%', detail: '52-week SLA' }
    ]
  }}
/>

<Story
  name="Learning platform metrics"
  args={{
    metrics: [
      { label: 'Exercise sequencing', value: '<200µs', detail: 'recommendation latency' },
      { label: 'Knowledge coverage', value: '94%', detail: 'of taxonomy nodes' },
      { label: 'User engagement', value: '3.2x', detail: 'vs. random sequencing' },
      { label: 'Active institutions', value: '10,240' }
    ]
  }}
/>
