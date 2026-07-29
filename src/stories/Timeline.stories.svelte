<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActivityItem from '../lib/molecules/ActivityItem.svelte';
  import Timeline from '../lib/organisms/Timeline.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Timeline',
    component: Timeline,
    tags: ['autodocs'],
    render: TimelineTemplate
  });
</script>

{#snippet noteBody()}
  Refund processed against the spring shipment; the account is at risk until the
  replacement order is confirmed.
{/snippet}

{#snippet TimelineTemplate(args)}
  <div style="padding:16px; max-width:460px;">
    <Timeline {...args}>
      <ActivityItem
        actor="Ada Fen"
        verb="moved"
        target="Eastern Ridge Tea Co. to Won"
        timestamp="09:12"
      />
      <ActivityItem
        actor="Ren Okada"
        verb="left a note on"
        target="Valley Floor Imports"
        timestamp="Yesterday"
        children={noteBody}
      />
      <ActivityItem
        actor="Mira Holt"
        verb="scheduled a call with"
        target="Mist Terrace Roasters"
        timestamp="2 days ago"
      />
    </Timeline>
  </div>
{/snippet}

<Story name="Default" args={{ label: 'Recent activity' }} />

<Story name="No label" args={{}} />
