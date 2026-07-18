<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Kbd from '../lib/atoms/Kbd.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Kbd',
    component: Kbd,
    tags: ['autodocs'],
    render: KbdTemplate
  });
</script>

{#snippet KbdTemplate(args)}
  <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 8px;">
    <span>Press key to save:</span>
    <Kbd {...args} />
  </div>
{/snippet}

{#snippet escSnippet()}ESC{/snippet}
{#snippet cmdSnippet()}⌘S{/snippet}

<Story name="Single Key" args={{ children: escSnippet }} />

<Story name="Combination" args={{ children: cmdSnippet }} />
