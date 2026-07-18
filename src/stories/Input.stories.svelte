<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from '../lib/atoms/Input.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    render: InputTemplate
  });
</script>

{#snippet InputTemplate(args)}
  <Input {...args} />
{/snippet}

<Story name="Standard" args={{ placeholder: 'Eastern ridge' }} />

<Story name="Numeric" args={{ value: '128.4', isNumeric: true }} />

<Story name="Invalid" args={{ value: '−12.00', invalid: true, isNumeric: true }} />

<Story name="Disabled" args={{ placeholder: 'Disabled input', disabled: true }} />
