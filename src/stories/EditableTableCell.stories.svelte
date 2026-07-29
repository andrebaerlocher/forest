<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EditableTableCell from '../lib/molecules/EditableTableCell.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/EditableTableCell',
    component: EditableTableCell,
    tags: ['autodocs'],
    render: CellTemplate
  });
</script>

<!-- Click selects; double-click, Enter, F2 or typing opens the editor.
     Escape cancels, Enter commits. -->
{#snippet CellTemplate(args)}
  <div style="padding:16px;">
    <table style="border-collapse:collapse; table-layout:fixed; width:220px;">
      <tbody>
        <tr>
          <EditableTableCell {...args} />
        </tr>
      </tbody>
    </table>
  </div>
{/snippet}

{#snippet textValue()}Eastern ridge{/snippet}
{#snippet kgValue()}128.4{/snippet}
{#snippet priceValue()}42.00{/snippet}
{#snippet negativeValue()}−38.50{/snippet}

<Story
  name="Text"
  args={{ value: 'Eastern ridge', selected: true, children: textValue }}
/>

<Story
  name="Numeric — one decimal"
  args={{ value: 128.4, type: 'numeric', decimals: 1, selected: true, children: kgValue }}
/>

<Story
  name="Numeric — two decimals"
  args={{ value: 42, type: 'numeric', decimals: 2, selected: true, children: priceValue }}
/>

<Story
  name="Negative"
  args={{
    value: -38.5,
    type: 'numeric',
    decimals: 2,
    negative: true,
    selected: true,
    children: negativeValue
  }}
/>

<Story
  name="Readonly"
  args={{ value: 'Computed total', readonly: true, selected: true, children: textValue }}
/>
