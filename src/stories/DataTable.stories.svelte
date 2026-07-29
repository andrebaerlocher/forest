<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTable from '../lib/organisms/DataTable.svelte';

  const columns = [
    { key: 'account', label: 'Account', sortable: true },
    { key: 'owner', label: 'Owner', width: '22%' },
    { key: 'value', label: 'Value', type: 'numeric', width: '20%', sortable: true, active: true }
  ];

  const rows = [
    { id: 1, account: 'Eastern Ridge Tea Co.', owner: 'Ada Fen', value: 48200 },
    { id: 2, account: 'Valley Floor Imports', owner: 'Ren Okada', value: -3696 },
    { id: 3, account: 'Mist Terrace Roasters', owner: 'Mira Holt', value: 21400 },
    { id: 4, account: 'River Bend Provisions', owner: 'Ada Fen', value: 15750 }
  ];

  const { Story } = defineMeta({
    title: 'Organisms/DataTable',
    component: DataTable,
    tags: ['autodocs'],
    render: DataTableTemplate
  });
</script>

{#snippet DataTableTemplate(args)}
  <div style="padding:16px;">
    <DataTable {...args} />
  </div>
{/snippet}

<Story name="Default" args={{ columns, rows }} />

<Story name="Selectable" args={{ columns, rows, selectable: true, selectedIds: [1, 3] }} />

<Story name="Sorted" args={{ columns, rows, sort: { key: 'value', dir: 'desc' } }} />

<Story name="Loading" args={{ columns, rows: [], loading: true }} />

<Story name="Empty" args={{ columns, rows: [] }} />
