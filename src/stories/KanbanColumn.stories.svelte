<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ListRow from '../lib/molecules/ListRow.svelte';
  import StatusPill from '../lib/molecules/StatusPill.svelte';
  import KanbanColumn from '../lib/organisms/KanbanColumn.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/KanbanColumn',
    component: KanbanColumn,
    tags: ['autodocs']
  });
</script>

{#snippet cardsContent()}
  <ListRow title="Design Tokens Audit" description="Review OKLCH color mappings">
    {#snippet action()}<StatusPill status="warning">In Review</StatusPill>{/snippet}
  </ListRow>
  <ListRow title="A11y Roving Tabindex" description="Fix TreeView keyboard focus">
    {#snippet action()}<StatusPill status="success">Done</StatusPill>{/snippet}
  </ListRow>
{/snippet}

<Story name="Default" args={{ title: 'In Progress', count: 2 }}>
  {#snippet children()}
    {@render cardsContent()}
  {/snippet}
</Story>

<Story name="Empty Column" args={{ title: 'Backlog', count: 0 }}>
  {#snippet children()}
    <div style="padding: 16px; text-align: center; color: var(--text-3); font-size: 12px;">
      No items queued
    </div>
  {/snippet}
</Story>
