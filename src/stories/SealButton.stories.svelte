<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SealButton from '../lib/atoms/SealButton.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/SealButton',
    component: SealButton,
    tags: ['autodocs'],
    render: SealButtonTemplate
  });
</script>

{#snippet SealButtonTemplate(args)}
  <div style="padding: 12px; background: var(--spine); display: inline-flex; border-radius: var(--radius-m);">
    <SealButton {...args} />
  </div>
{/snippet}

{#snippet iconSnippet()}
  <svg viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
{/snippet}

<Story name="Default" args={{ variant: 'default', children: iconSnippet }} />

<Story name="Active" args={{ variant: 'active', children: iconSnippet }} />

<Story name="Primary" args={{ variant: 'primary', children: iconSnippet }} />

<Story name="Disabled" args={{ disabled: true, children: iconSnippet }} />
