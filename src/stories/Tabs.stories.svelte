<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tabs from '../lib/molecules/Tabs.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Tabs',
    component: Tabs,
    tags: ['autodocs']
  });
</script>

<script>
  let activeTab = $state('general');
</script>

{#snippet TabsTemplate(args)}
  <Tabs {...args} bind:activeId={activeTab} />
{/snippet}

<Story
  name="Standard"
  args={{
    items: [
      { id: 'general', label: 'General Settings' },
      { id: 'soil', label: 'Soil Metrics' },
      { id: 'logs', label: 'Harvest Logs' }
    ],
    activeId: 'general'
  }}
  render={TabsTemplate}
/>
