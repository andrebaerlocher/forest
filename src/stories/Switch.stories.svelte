<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Switch from '../lib/atoms/Switch.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Switch',
    component: Switch,
    tags: ['autodocs'],
    render: SwitchTemplate
  });
</script>

{#snippet SwitchTemplate(args)}
  <Switch {...args} />
{/snippet}

{#snippet publishedLabel()}Published{/snippet}
{#snippet disabledLabel()}Disabled Switch{/snippet}

<Story name="Off" args={{ checked: false, children: publishedLabel }} />

<Story name="On" args={{ checked: true, children: publishedLabel }} />

<Story name="Disabled" args={{ checked: true, disabled: true, children: disabledLabel }} />
