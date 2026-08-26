<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { ComponentProps } from 'svelte';
  import CurrencyInput from '../lib/molecules/CurrencyInput.svelte';
  import { CHF_CASH_STEP } from '../lib/money.js';

  const { Story } = defineMeta({
    title: 'Molecules/CurrencyInput',
    component: CurrencyInput,
    tags: ['autodocs'],
    render: CurrencyInputTemplate
  });
</script>

{#snippet CurrencyInputTemplate(args: ComponentProps<typeof CurrencyInput>)}
  <div style="padding:16px; max-width:260px;">
    <CurrencyInput {...args} />
  </div>
{/snippet}

<Story name="Default" args={{ value: 1234.5 }} />

<Story name="Empty" args={{ value: null }} />

<!-- A credit note line takes the danger ink, same as a negative table cell -->
<Story name="Negative" args={{ value: -480 }} />

<!-- Cash totals in Switzerland settle to the nearest 5 rappen -->
<Story name="Five rappen rounding" args={{ value: 12.33, roundingStep: CHF_CASH_STEP }} />

<!-- fr-CH puts the code after the number; the affix follows the locale -->
<Story name="French Switzerland" args={{ value: 1234.5, locale: 'fr-CH' }} />

<Story name="Euro" args={{ value: 1234.5, locale: 'de-DE', currency: 'EUR' }} />

<Story name="Symbol instead of code" args={{ value: 1234.5, currencyDisplay: 'narrowSymbol' }} />

<Story name="No affix" args={{ value: 1234.5, currencyDisplay: 'none' }} />

<Story name="Invalid" args={{ value: 1234.5, invalid: true }} />

<Story name="Disabled" args={{ value: 1234.5, disabled: true }} />

<Story name="Readonly" args={{ value: 1234.5, readonly: true }} />

<Story name="Clamped 0 to 100" args={{ value: 50, min: 0, max: 100 }} />
