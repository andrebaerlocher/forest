<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { ComponentProps } from 'svelte';
  import { formatMoney } from '../lib/money.js';
  import ReorderableTable from '../lib/organisms/ReorderableTable.svelte';

  // `as const` pins `type` to the literal the column type wants, and the row
  // callbacks stay loose because Storybook resolves the component's Row
  // generic to `object` — an app passing real rows gets the real inference.
  const columns = [
    { key: 'position', label: 'Position', primary: true },
    { key: 'quantity', label: 'Qty', type: 'numeric' as const, width: '12%' },
    {
      key: 'unitPrice',
      label: 'Unit price',
      type: 'numeric' as const,
      width: '20%',
      format: (v: unknown) => formatMoney(Number(v))
    },
    {
      key: 'total',
      label: 'Total',
      type: 'numeric' as const,
      width: '20%',
      active: true,
      getValue: (row: any) => row.quantity * row.unitPrice,
      format: (v: unknown) => formatMoney(Number(v))
    }
  ];

  const rows = [
    { id: 'l1', position: 'Concept workshop', quantity: 2, unitPrice: 1450 },
    { id: 'l2', position: 'Interface design', quantity: 12, unitPrice: 165 },
    { id: 'l3', position: 'Frontend build', quantity: 34, unitPrice: 155 },
    { id: 'l4', position: 'Hosting, first year', quantity: 1, unitPrice: 480 }
  ];

  const subtotal = rows.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

  const { Story } = defineMeta({
    title: 'Organisms/ReorderableTable',
    component: ReorderableTable,
    tags: ['autodocs'],
    render: ReorderableTableTemplate
  });
</script>

{#snippet ReorderableTableTemplate(args: ComponentProps<typeof ReorderableTable>)}
  <div style="padding:16px; max-width:760px;">
    <ReorderableTable {...args} />
  </div>
{/snippet}

<!-- Drag a handle, or focus one and press Space then the arrow keys. -->
<Story name="Default" args={{ columns, rows }} />

<Story name="Single row" args={{ columns, rows: rows.slice(0, 1) }} />

<Story name="Disabled" args={{ columns, rows, disabled: true }} />

<Story name="Empty" args={{ columns, rows: [] }} />

<Story
  name="Empty with custom copy"
  args={{
    columns,
    rows: [],
    emptyTitle: 'No positions',
    emptyDescription: 'Add a position to start this offer.'
  }}
/>

<!-- An offer's line items, which is what a hand-made order is actually for -->
<Story name="Offer positions with total">
  {#snippet template()}
    <div style="padding:16px; max-width:760px;">
      <ReorderableTable {columns} {rows} rowKey="id">
        {#snippet footer()}
          <tr>
            <td></td>
            <td colspan="2" style="text-align:right; color:var(--text-3); font-size:12px;">
              Subtotal
            </td>
            <td style="text-align:right; font-family:var(--font-num); padding:8px 15px;">
              {formatMoney(subtotal)}
            </td>
          </tr>
        {/snippet}
        {#snippet cardFooter()}
          Subtotal &nbsp; <span class="num">{formatMoney(subtotal)}</span>
        {/snippet}
      </ReorderableTable>
    </div>
  {/snippet}
</Story>
