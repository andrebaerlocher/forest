<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Combobox from '../lib/molecules/Combobox.svelte';

  const owners = [
    { id: 'u1', label: 'Ada Fen', meta: 'Sales' },
    { id: 'u2', label: 'Ren Okada', meta: 'Sales' },
    { id: 'u3', label: 'Mira Holt', meta: 'Partnerships' },
    { id: 'u4', label: 'Jonas Weiss', meta: 'Sales' }
  ];

  const { Story } = defineMeta({
    title: 'Molecules/Combobox',
    component: Combobox,
    tags: ['autodocs'],
    render: ComboboxTemplate
  });
</script>

{#snippet ComboboxTemplate(args)}
  <div style="padding:16px; min-height:280px;">
    <Combobox {...args} />
  </div>
{/snippet}

<Story name="Default" args={{ items: owners, placeholder: 'All owners' }} />

<Story name="Preselected" args={{ items: owners, value: 'u3' }} />

<Story name="Invalid" args={{ items: owners, invalid: true, placeholder: 'Owner required' }} />

<Story name="Disabled" args={{ items: owners, disabled: true, placeholder: 'All owners' }} />

<Story name="Empty list" args={{ items: [], placeholder: 'No owners loaded' }} />
