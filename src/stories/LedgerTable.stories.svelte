<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LedgerTable from '../lib/organisms/LedgerTable.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/LedgerTable',
    component: LedgerTable,
    tags: ['autodocs'],
    render: LedgerTemplate
  });
</script>

{#snippet LedgerTemplate(args)}
  <LedgerTable {...args} />
{/snippet}

{#snippet headersSnippet()}
  <tr>
    <th class="col-narrow"></th>
    <th>Garden</th>
    <th class="num col-kg">kg</th>
    <th class="num col-active col-price">Price</th>
    <th class="num col-total">Total</th>
  </tr>
{/snippet}

{#snippet rowsSnippet()}
  <tr>
    <td class="num row-num">1</td>
    <td class="text">Eastern ridge</td>
    <td class="num">128.4</td>
    <td class="num col-active">42.00</td>
    <td class="num">5 392.80</td>
  </tr>
  <tr>
    <td class="num row-num">2</td>
    <td class="text">Valley floor · refund</td>
    <td class="num">96.0</td>
    <td class="num col-active">38.50</td>
    <td class="num neg">−3 696.00</td>
  </tr>
  <tr>
    <td class="num row-num">3</td>
    <td class="text">Mist terrace</td>
    <td class="num">54.2</td>
    <td class="num col-active">61.00</td>
    <td class="num">3 306.20</td>
  </tr>
{/snippet}

{#snippet summarySnippet()}
  <tr class="sum">
    <td></td>
    <td class="text sum-label">Sum</td>
    <td class="num sum-val">278.6</td>
    <td class="num col-active"></td>
    <td class="num sum-val">5 003.00</td>
  </tr>
{/snippet}

<Story
  name="Standard"
  args={{
    headers: headersSnippet,
    rows: rowsSnippet,
    summary: summarySnippet
  }}
/>

<style>
  .col-narrow {
    width: 34px;
  }

  .col-kg {
    width: 20%;
  }

  .col-price {
    width: 24%;
  }

  .col-total {
    width: 24%;
  }

  .row-num {
    color: var(--text-3);
    font-size: 11px;
  }

  .sum-label {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-1);
  }

  .sum-val {
    font-weight: 500;
  }
</style>
