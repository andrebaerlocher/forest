<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stat from '../lib/molecules/Stat.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Stat',
    component: Stat,
    tags: ['autodocs'],
    render: StatTemplate
  });
</script>

{#snippet StatTemplate(args)}
  <div style="max-width: 240px;">
    <Stat {...args} />
  </div>
{/snippet}

<Story
  name="Positive"
  args={{
    value: '278.6 kg',
    label: 'Total Harvest'
  }}
/>

<Story
  name="Negative"
  args={{
    value: '−4.2%',
    label: 'Vs. last year',
    negative: true
  }}
/>
