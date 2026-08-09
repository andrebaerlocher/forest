<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Pagination from '../lib/molecules/Pagination.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Pagination',
    component: Pagination,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ current: 1, total: 10 }} />
<Story name="MiddlePage" args={{ current: 5, total: 10 }} />
<Story name="LastPage" args={{ current: 10, total: 10 }} />
