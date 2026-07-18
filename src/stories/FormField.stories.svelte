<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from '../lib/atoms/Input.svelte';
  import FormField from '../lib/molecules/FormField.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/FormField',
    component: FormField,
    tags: ['autodocs'],
    render: FormFieldTemplate
  });
</script>

{#snippet FormFieldTemplate(args)}
  <FormField {...args} />
{/snippet}

{#snippet inputSnippet()}
  <Input id="gardenName" placeholder="Enter garden name..." />
{/snippet}

{#snippet invalidInputSnippet()}
  <Input id="invalidName" placeholder="Enter garden name..." invalid={true} />
{/snippet}

<Story
  name="With Hint"
  args={{
    id: 'gardenName',
    label: 'Garden Name',
    hint: 'Give it a unique botanical name.',
    children: inputSnippet
  }}
/>

<Story
  name="With Error"
  args={{
    id: 'invalidName',
    label: 'Garden Name',
    invalid: true,
    error: 'This garden name is already claimed.',
    children: invalidInputSnippet
  }}
/>
