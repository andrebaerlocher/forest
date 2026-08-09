<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from '../lib/atoms/Input.svelte';
  import FieldRow from '../lib/molecules/FieldRow.svelte';
  import SettingsTemplate from '../lib/templates/SettingsTemplate.svelte';

  const { Story } = defineMeta({
    title: 'Templates/SettingsTemplate',
    component: SettingsTemplate,
    tags: ['autodocs'],
    render: SettingsRender
  });
</script>

{#snippet SettingsRender(args)}
  <SettingsTemplate {...args}>
    {#snippet navigation()}
      <button class="active">General</button>
      <button>Security</button>
      <button>Notifications</button>
    {/snippet}
    {#snippet content()}
      <FieldRow label="Display Name" id="name">
        <Input id="name" value="Forest User" />
      </FieldRow>
      <FieldRow label="Email Address" id="email">
        <Input id="email" value="user@forest.design" />
      </FieldRow>
    {/snippet}
  </SettingsTemplate>
{/snippet}

<Story name="Default" />
