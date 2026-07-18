<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Textarea from '../lib/atoms/Textarea.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    render: TextareaTemplate
  });
</script>

{#snippet TextareaTemplate(args)}
  <div style="max-width: 480px;">
    <Textarea {...args} />
  </div>
{/snippet}

<Story name="Standard" args={{ placeholder: 'Describe the garden ecosystem...' }} />

<Story name="Invalid" args={{ invalid: true, value: 'Unrecognized soil pH reading.' }} />

<Story name="Disabled" args={{ disabled: true, placeholder: 'Disabled tea log notes.' }} />
