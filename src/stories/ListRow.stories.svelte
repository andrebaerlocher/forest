<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ListRow from '../lib/molecules/ListRow.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/ListRow',
    component: ListRow,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ title: 'General Settings', subtitle: 'Manage preferences and workspace defaults', value: '4 items' }} />
<Story name="Active" args={{ title: 'Active Item', subtitle: 'Currently selected item', active: true, value: 'Selected' }} />
<Story name="NavVariant" args={{ title: 'Sidebar Item', variant: 'nav', active: true }} />
