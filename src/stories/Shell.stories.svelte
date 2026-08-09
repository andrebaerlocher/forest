<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Shell from '../lib/templates/Shell.svelte';

  const { Story } = defineMeta({
    title: 'Templates/Shell',
    component: Shell,
    tags: ['autodocs'],
    render: ShellRender
  });
</script>

{#snippet ShellRender(args)}
  <div style="height: 500px; position: relative;">
    <Shell {...args}>
      <div style="padding: 24px; color: var(--text-1);">
        <h3>Shell Container Workspace</h3>
        <p>Full application shell frame.</p>
      </div>
    </Shell>
  </div>
{/snippet}

<Story name="Default" args={{ wordmark: 'A Forest', links: [{ href: '#', label: 'Docs' }, { href: '#', label: 'Components' }] }} />
