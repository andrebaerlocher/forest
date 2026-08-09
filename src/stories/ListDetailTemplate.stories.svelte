<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ListRow from '../lib/molecules/ListRow.svelte';
  import ListDetailTemplate from '../lib/templates/ListDetailTemplate.svelte';

  const { Story } = defineMeta({
    title: 'Templates/ListDetailTemplate',
    component: ListDetailTemplate,
    tags: ['autodocs'],
    render: ListDetailRender
  });
</script>

{#snippet ListDetailRender(args)}
  <div style="height: 400px; border: 1px solid var(--line-soft);">
    <ListDetailTemplate {...args}>
      {#snippet list()}
        <ListRow title="Item 1" subtitle="Subtitle 1" active={true} />
        <ListRow title="Item 2" subtitle="Subtitle 2" />
        <ListRow title="Item 3" subtitle="Subtitle 3" />
      {/snippet}
      {#snippet detail()}
        <div style="padding: 24px; color: var(--text-1);">
          <h3>Detail View</h3>
          <p>Full record detail representation for Item 1.</p>
        </div>
      {/snippet}
    </ListDetailTemplate>
  </div>
{/snippet}

<Story name="Default" />
