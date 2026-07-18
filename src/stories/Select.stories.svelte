<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Select from '../lib/atoms/Select.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Select',
    component: Select,
    tags: ['autodocs'],
    render: SelectTemplate
  });
</script>

{#snippet SelectTemplate(args)}
  <div style="max-width: 320px;">
    <Select {...args} />
  </div>
{/snippet}

{#snippet optionsSnippet()}
  <option value="">Select an option...</option>
  <option value="matcha">Green Matcha · 120°</option>
  <option value="oolong">Classic Oolong · 282°</option>
  <option value="rose">Rose Hip · 350°</option>
{/snippet}

<Story name="Standard" args={{ children: optionsSnippet }} />

<Story name="Invalid" args={{ invalid: true, children: optionsSnippet }} />

<Story name="Disabled" args={{ disabled: true, children: optionsSnippet }} />
