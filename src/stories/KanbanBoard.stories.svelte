<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ListRow from '../lib/molecules/ListRow.svelte';
  import StatusPill from '../lib/molecules/StatusPill.svelte';
  import KanbanBoard from '../lib/organisms/KanbanBoard.svelte';
  import KanbanColumn from '../lib/organisms/KanbanColumn.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/KanbanBoard',
    component: KanbanBoard,
    tags: ['autodocs']
  });
</script>

{#snippet backlogCards()}
  <ListRow title="Design Tokens Audit" description="Review OKLCH color mappings">
    {#snippet action()}<StatusPill status="warning">In Review</StatusPill>{/snippet}
  </ListRow>
  <ListRow title="Storybook upgrade" description="Move to Storybook 10">
    {#snippet action()}<StatusPill status="neutral">Queued</StatusPill>{/snippet}
  </ListRow>
{/snippet}

{#snippet progressCards()}
  <ListRow title="A11y Roving Tabindex" description="Fix TreeView keyboard focus">
    {#snippet action()}<StatusPill status="success">Done</StatusPill>{/snippet}
  </ListRow>
  <ListRow title="Kanban scroller" description="Board lays out its columns">
    {#snippet action()}<StatusPill status="warning">In Review</StatusPill>{/snippet}
  </ListRow>
{/snippet}

{#snippet reviewCards()}
  <ListRow title="Hover gate audit" description="Confirm compiled CSS, not just source">
    {#snippet action()}<StatusPill status="warning">In Review</StatusPill>{/snippet}
  </ListRow>
{/snippet}

{#snippet doneCards()}
  <ListRow title="Tap target sweep" description="35 to 0 sub-44px controls">
    {#snippet action()}<StatusPill status="success">Done</StatusPill>{/snippet}
  </ListRow>
{/snippet}

<!-- The board only supplies the scroller; a fixed height on the story's own
     wrapper stands in for whatever fixed-height region a real app gives it
     (a Shell body, a split pane) so each column's own `.column-body` is the
     one that scrolls vertically, not the page. -->
<Story name="Default" args={{ label: 'Sprint board', style: 'height: 420px;' }}>
  {#snippet children()}
    <KanbanColumn title="Backlog" count={2}>
      {#snippet children()}{@render backlogCards()}{/snippet}
    </KanbanColumn>
    <KanbanColumn title="In Progress" count={2}>
      {#snippet children()}{@render progressCards()}{/snippet}
    </KanbanColumn>
    <KanbanColumn title="Review" count={1}>
      {#snippet children()}{@render reviewCards()}{/snippet}
    </KanbanColumn>
    <KanbanColumn title="Done" count={1}>
      {#snippet children()}{@render doneCards()}{/snippet}
    </KanbanColumn>
  {/snippet}
</Story>
