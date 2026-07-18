<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusBar from '../lib/organisms/StatusBar.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/StatusBar',
    component: StatusBar,
    tags: ['autodocs'],
    render: StatusBarTemplate
  });
</script>

{#snippet StatusBarTemplate(args)}
  <div style="border: 1px solid var(--line-soft); border-radius: var(--radius-m); overflow: hidden; background: var(--canvas);">
    <div style="height: 100px; padding: 24px; font-family: var(--font-body); font-size: 13px; color: var(--text-3);">
      Workspace contents...
    </div>
    <StatusBar {...args} />
  </div>
{/snippet}

{#snippet leftSection()}
  <span>Ready</span>
  <span class="metric">pH 6.4</span>
{/snippet}

{#snippet centerSection()}
  <span>Mist Terrace · Section A</span>
{/snippet}

{#snippet rightSection()}
  <span class="metric">128.4 kg harvested</span>
{/snippet}

<Story
  name="Standard"
  args={{
    left: leftSection,
    children: centerSection,
    right: rightSection
  }}
/>
