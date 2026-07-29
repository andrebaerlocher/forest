<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActivityItem from '../lib/molecules/ActivityItem.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/ActivityItem',
    component: ActivityItem,
    tags: ['autodocs'],
    render: ActivityItemTemplate
  });
</script>

{#snippet noteBody()}
  Refund processed against the spring shipment; the account is at risk until the
  replacement order is confirmed.
{/snippet}

{#snippet ActivityItemTemplate(args)}
  <div style="padding:16px; max-width:460px;">
    <ActivityItem {...args} />
  </div>
{/snippet}

<Story
  name="Default"
  args={{
    actor: 'Ada Fen',
    verb: 'moved',
    target: 'Eastern Ridge Tea Co. to Won',
    timestamp: '09:12'
  }}
/>

<Story
  name="With note"
  args={{
    actor: 'Ren Okada',
    verb: 'left a note on',
    target: 'Valley Floor Imports',
    timestamp: 'Yesterday',
    children: noteBody
  }}
/>

<Story name="Actor only" args={{ actor: 'Mira Holt', timestamp: '2 days ago' }} />
