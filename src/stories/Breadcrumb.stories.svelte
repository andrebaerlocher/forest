<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Breadcrumb from '../lib/molecules/Breadcrumb.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    render: BreadcrumbTemplate
  });
</script>

{#snippet BreadcrumbTemplate(args)}
  <Breadcrumb {...args} />
{/snippet}

<Story
  name="Standard"
  args={{
    items: [
      { label: 'Gardens', href: '#/gardens' },
      { label: 'Mist Terrace', href: '#/gardens/mist' },
      { label: 'Harvest Log' }
    ]
  }}
/>
