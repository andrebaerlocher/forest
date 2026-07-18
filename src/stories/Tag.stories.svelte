<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tag from '../lib/atoms/Tag.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Tag',
    component: Tag,
    tags: ['autodocs'],
    render: TagTemplate
  });
</script>

{#snippet TagTemplate(args)}
  <Tag {...args} />
{/snippet}

{#snippet oolongLabel()}Oolong{/snippet}
{#snippet featuredLabel()}Featured{/snippet}

<Story name="Standard" args={{ children: oolongLabel }} />

<Story name="Accent" args={{ variant: 'accent', children: featuredLabel }} />
