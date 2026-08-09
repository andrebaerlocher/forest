<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AppShell from '../lib/templates/AppShell.svelte';

  const { Story } = defineMeta({
    title: 'Templates/AppShell',
    component: AppShell,
    tags: ['autodocs'],
    render: AppShellTemplate
  });
</script>

{#snippet AppShellTemplate(args)}
  <AppShell {...args}>
    <div style="padding: 24px; color: var(--text-1);">
      <h2>Main Content Workspace</h2>
      <p>AppShell layout wrapper with header, navigation, and footer slots.</p>
    </div>
  </AppShell>
{/snippet}

<Story name="Default" args={{ wordmark: 'A Forest App', links: [{ href: '#', label: 'Dashboard' }, { href: '#', label: 'Settings' }] }} />
