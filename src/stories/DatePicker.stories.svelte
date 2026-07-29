<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DatePicker from '../lib/molecules/DatePicker.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    render: DatePickerTemplate
  });
</script>

{#snippet DatePickerTemplate(args)}
  <div style="padding:16px; min-height:380px;">
    <DatePicker {...args} />
  </div>
{/snippet}

<Story name="Default" args={{ value: '2026-08-14' }} />

<Story name="Empty" args={{ value: '' }} />

<Story name="German locale" args={{ value: '2026-08-14', locale: 'de-CH' }} />

<Story name="Invalid" args={{ value: '2026-13-45', invalid: true }} />

<Story name="Disabled" args={{ value: '2026-08-14', disabled: true }} />
