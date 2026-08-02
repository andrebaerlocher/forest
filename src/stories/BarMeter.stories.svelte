<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BarMeter from '../lib/atoms/BarMeter.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/BarMeter',
    component: BarMeter,
    tags: ['autodocs'],
    render: BarMeterTemplate
  });
</script>

{#snippet BarMeterTemplate(args)}
  <BarMeter {...args} />
{/snippet}

<Story
  name="Standard"
  args={{
    label: 'p99 latency',
    value: 165,
    max: 500,
    unit: 'µs'
  }}
/>

<Story
  name="Tones"
  args={{
    label: 'Placeholder'
  }}
  let:args
>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <BarMeter
      label="Latency (good)"
      value={120}
      max={500}
      unit="µs"
      tone="success"
    />
    <BarMeter
      label="Latency (neutral)"
      value={250}
      max={500}
      unit="µs"
      tone="neutral"
    />
    <BarMeter
      label="Latency (warning)"
      value={380}
      max={500}
      unit="µs"
      tone="warning"
    />
    <BarMeter
      label="Latency (critical)"
      value={490}
      max={500}
      unit="µs"
      tone="danger"
    />
  </div>
</Story>
