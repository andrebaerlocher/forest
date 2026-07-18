<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmptyState from '../lib/molecules/EmptyState.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/EmptyState',
    component: EmptyState,
    tags: ['autodocs'],
    render: EmptyTemplate
  });
</script>

{#snippet EmptyTemplate(args)}
  <div style="border: 1px solid var(--line-soft); border-radius: var(--radius-m); background: var(--canvas);">
    <EmptyState {...args} />
  </div>
{/snippet}

{#snippet customIcon()}
  <svg viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
{/snippet}

<Story
  name="Standard"
  args={{
    title: 'No Gardens Found',
    description: 'Create a new garden to begin tracking soil metrics and tea harvests.',
    actionLabel: 'New Garden',
    onaction: () => alert('Create garden clicked')
  }}
/>

<Story
  name="Custom Icon"
  args={{
    title: 'No Documents',
    description: 'Write your first tea harvesting note to populate this guide list.',
    actionLabel: 'Write note',
    onaction: () => alert('Write note clicked'),
    icon: customIcon
  }}
/>
