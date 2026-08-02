<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SplitPane from '../lib/organisms/SplitPane.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/SplitPane',
    component: SplitPane,
    tags: ['autodocs'],
    render: SplitPaneTemplate
  });
</script>

{#snippet paneContent(title, bg)}
  <div style="padding: 24px; background: {bg}; height: 100%; box-sizing: border-box;">
    <h4 style="margin: 0 0 8px 0; font-family: var(--font-body); font-size: 14px;">{title}</h4>
    <p style="margin: 0; font-family: var(--font-body); font-size: 12px; color: var(--text-2);">
      Interactive resizable pane content area. Drag the split handle or use Arrow keys when focused.
    </p>
  </div>
{/snippet}

{#snippet firstPane()}
  {@render paneContent('Primary Panel (Sidebar)', 'var(--wash)')}
{/snippet}

{#snippet secondPane()}
  {@render paneContent('Secondary Panel (Workspace)', 'var(--paper-l)')}
{/snippet}

{#snippet SplitPaneTemplate(args)}
  <div style="width: 600px; height: 320px; padding: 16px;">
    <SplitPane {...args} first={firstPane} second={secondPane} />
  </div>
{/snippet}

<Story name="Horizontal Split" args={{ direction: 'horizontal', split: 35 }} />

<Story name="Vertical Split" args={{ direction: 'vertical', split: 40 }} />
