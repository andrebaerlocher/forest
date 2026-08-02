<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BenchmarkTable from '../lib/organisms/BenchmarkTable.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/BenchmarkTable',
    component: BenchmarkTable,
    tags: ['autodocs']
  });
</script>

<Story
  name="Standard"
  args={{
    caption: 'Latency breakdown for recommendation request (95th percentile)',
    unit: 'µs',
    rows: [
      { label: 'Database query', value: 42 },
      { label: 'Recommendation scoring', value: 89 },
      { label: 'Serialization', value: 18 },
      { label: 'Network overhead', value: 16 }
    ]
  }}
/>

<Story
  name="With bars"
  args={{
    caption: 'Latency breakdown for recommendation request (95th percentile)',
    unit: 'µs',
    showBars: true,
    rows: [
      { label: 'Database query', value: 42 },
      { label: 'Recommendation scoring', value: 89 },
      { label: 'Serialization', value: 18 },
      { label: 'Network overhead', value: 16 }
    ]
  }}
/>

<Story
  name="With total"
  args={{
    caption: 'Latency breakdown for recommendation request (95th percentile)',
    unit: 'µs',
    rows: [
      { label: 'Database query', value: 42 },
      { label: 'Recommendation scoring', value: 89 },
      { label: 'Serialization', value: 18 },
      { label: 'Network overhead', value: 16 }
    ],
    total: { label: 'Total', value: 165 }
  }}
/>
