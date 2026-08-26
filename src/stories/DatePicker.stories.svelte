<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { ComponentProps } from 'svelte';
  import DatePicker from '../lib/molecules/DatePicker.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    render: DatePickerTemplate
  });
</script>

{#snippet DatePickerTemplate(args: ComponentProps<typeof DatePicker>)}
  <div style="padding:16px; min-height:380px;">
    <DatePicker {...args} />
  </div>
{/snippet}

<!-- `value` is always ISO; only the display follows the locale. -->
<Story name="Default" args={{ value: '2026-08-14' }} />

<Story name="Empty" args={{ value: '' }} />

<!-- German Switzerland: 14.08.2026, weekdays Mo–So, week starts Monday -->
<Story name="German Switzerland" args={{ value: '2026-08-14', locale: 'de-CH' }} />

<Story name="French Switzerland" args={{ value: '2026-08-14', locale: 'fr-CH' }} />

<Story name="Italian Switzerland" args={{ value: '2026-08-14', locale: 'it-CH' }} />

<!-- Narrow weekdays collide in German (Montag and Mittwoch are both M) -->
<Story
  name="Narrow weekdays"
  args={{ value: '2026-08-14', locale: 'de-CH', weekdayFormat: 'narrow' }}
/>

<Story name="British English" args={{ value: '2026-08-14', locale: 'en-GB' }} />

<Story name="Invalid" args={{ value: '2026-13-45', invalid: true }} />

<Story name="Disabled" args={{ value: '2026-08-14', disabled: true }} />
