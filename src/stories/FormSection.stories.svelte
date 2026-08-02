<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from '../lib/atoms/Input.svelte';
  import Textarea from '../lib/atoms/Textarea.svelte';
  import FormField from '../lib/molecules/FormField.svelte';
  import FormSection from '../lib/organisms/FormSection.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/FormSection',
    component: FormSection,
    tags: ['autodocs']
  });
</script>

{#snippet fieldsContent()}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <FormField label="Library Name">
      <Input value="Forest UI" />
    </FormField>
    <FormField label="Description">
      <Textarea value="High-performance Svelte 5 component design system." />
    </FormField>
  </div>
{/snippet}

<Story name="Default" args={{ title: 'General Configuration', description: 'Basic workspace identity and public metadata.' }}>
  {#snippet children()}
    {@render fieldsContent()}
  {/snippet}
</Story>

<Story name="Title Only" args={{ title: 'Security Credentials' }}>
  {#snippet children()}
    {@render fieldsContent()}
  {/snippet}
</Story>
