<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from '../lib/atoms/Input.svelte';
  import FieldRow from '../lib/molecules/FieldRow.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/FieldRow',
    component: FieldRow,
    tags: ['autodocs'],
    render: FieldRowTemplate
  });
</script>

{#snippet FieldRowTemplate(args)}
  <FieldRow {...args}>
    <Input id={args.id} placeholder="Enter value..." />
  </FieldRow>
{/snippet}

<Story name="Default" args={{ label: 'Username', id: 'username-input', hint: 'Unique workspace handler' }} />
<Story name="Error" args={{ label: 'Email', id: 'email-input', invalid: true, error: 'Invalid email address' }} />
