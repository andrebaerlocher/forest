<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TableCell from '../lib/atoms/TableCell.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/TableCell',
    component: TableCell,
    tags: ['autodocs'],
    render: TableCellTemplate
  });
</script>

{#snippet TableCellTemplate(args)}
  <table>
    <tbody>
      <tr>
        <TableCell {...args} />
      </tr>
    </tbody>
  </table>
{/snippet}

{#snippet textContent()}Sample Data{/snippet}
{#snippet numContent()}$1,234.56{/snippet}

<Story name="Text" args={{ type: 'text', children: textContent }} />
<Story name="Numeric" args={{ type: 'numeric', children: numContent }} />
<Story name="Selected" args={{ type: 'text', selected: true, children: textContent }} />
<Story name="Negative" args={{ type: 'numeric', negative: true, children: numContent }} />
