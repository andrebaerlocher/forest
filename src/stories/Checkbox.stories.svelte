<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from '../lib/atoms/Checkbox.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    render: CheckboxTemplate
  });
</script>

{#snippet CheckboxTemplate(args)}
  <Checkbox {...args} />
{/snippet}

{#snippet organicLabel()}Organic{/snippet}
{#snippet shadeGrownLabel()}Shade-grown{/snippet}
{#snippet disabledLabel()}Disabled Checkbox{/snippet}

<Story name="Unchecked" args={{ checked: false, children: organicLabel }} />

<Story name="Checked" args={{ checked: true, children: shadeGrownLabel }} />

<Story name="Disabled" args={{ checked: true, disabled: true, children: disabledLabel }} />
