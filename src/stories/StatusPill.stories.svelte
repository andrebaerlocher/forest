<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusPill from '../lib/molecules/StatusPill.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/StatusPill',
    component: StatusPill,
    tags: ['autodocs'],
    render: StatusPillTemplate
  });
</script>

{#snippet StatusPillTemplate(args)}
  <StatusPill {...args} />
{/snippet}

{#snippet AllTemplate()}
  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
    <StatusPill status="neutral" label="Open" />
    <StatusPill status="success" label="Won" />
    <StatusPill status="warning" label="Stalled" />
    <StatusPill status="danger" label="At risk" />
  </div>
{/snippet}

{#snippet BareTemplate()}
  <div style="display:flex; align-items:center; gap:22px; flex-wrap:wrap;">
    <StatusPill bare status="success" label="Paid in full" />
    <StatusPill bare status="danger" label="Overdue · −1 240.00" />
  </div>
{/snippet}

<Story name="Neutral" args={{ status: 'neutral', label: 'Open' }} />

<Story name="All statuses" render={AllTemplate} />

<Story name="Bare — status as ink" render={BareTemplate} />
