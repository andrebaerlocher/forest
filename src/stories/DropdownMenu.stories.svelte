<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DropdownMenu from '../lib/molecules/DropdownMenu.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
    render: DropdownTemplate
  });
</script>

{#snippet DropdownTemplate(args)}
  <div style="position: relative; height: 160px; width: 220px; background: var(--canvas); padding: 12px; border: 1.5px solid var(--line-soft); border-radius: var(--radius-m);">
    <span style="font-family: var(--font-body); font-size: 13px; color: var(--text-3);">Dropdown Anchor</span>
    <DropdownMenu {...args} style="top: 32px; left: 12px;" />
  </div>
{/snippet}

{#snippet actionsSnippet()}
  <button type="button">Edit details</button>
  <button type="button">Duplicate slip</button>
  <a href="#/delete" style="color: var(--danger);">Delete garden</a>
{/snippet}

<Story name="Open" args={{ open: true, children: actionsSnippet }} />
