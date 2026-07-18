<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    render: ButtonTemplate
  });
</script>

{#snippet ButtonTemplate(args)}
  <Button {...args} />
{/snippet}

{#snippet primaryLabel()}Save changes{/snippet}
{#snippet duplicateLabel()}Duplicate{/snippet}
{#snippet cancelLabel()}Cancel{/snippet}
{#snippet deleteLabel()}Delete garden{/snippet}

<Story name="Primary" args={{ variant: 'primary', children: primaryLabel }} />

<Story name="Secondary" args={{ variant: 'secondary', children: duplicateLabel }} />

<Story name="Ghost" args={{ variant: 'ghost', children: cancelLabel }} />

<Story name="Danger" args={{ variant: 'danger', children: deleteLabel }} />

<Story name="Disabled" args={{ variant: 'primary', disabled: true, children: primaryLabel }} />
