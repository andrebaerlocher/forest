<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SegmentedControl from '../lib/molecules/SegmentedControl.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/SegmentedControl',
    component: SegmentedControl,
    tags: ['autodocs']
  });
</script>

<script>
  let activeId = $state('day');
</script>

{#snippet ControlTemplate(args)}
  <SegmentedControl {...args} bind:activeId={activeId} />
{/snippet}

<Story
  name="Standard"
  args={{
    items: [
      { id: 'day', label: 'Day' },
      { id: 'week', label: 'Week' },
      { id: 'month', label: 'Month' }
    ]
  }}
  render={ControlTemplate}
/>
