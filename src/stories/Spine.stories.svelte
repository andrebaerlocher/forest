<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SealButton from '../lib/atoms/SealButton.svelte';
  import Spine from '../lib/organisms/Spine.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Spine',
    component: Spine,
    tags: ['autodocs'],
    render: SpineTemplate
  });
</script>

{#snippet SpineTemplate(args)}
  <div style="height: 500px; display: flex; border: 1.5px solid var(--line-soft); border-radius: var(--radius-m); overflow: hidden;">
    <Spine {...args} />
    <div style="flex: 1; padding: 24px; font-family: var(--font-body); font-size: 14px; background: var(--canvas); color: var(--text-2);">
      Main content area container.
    </div>
  </div>
{/snippet}

{#snippet docIcon()}
  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
{/snippet}

{#snippet chartIcon()}
  <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
{/snippet}

{#snippet railSnippet()}
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
    <SealButton variant="active" children={docIcon} />
    <SealButton children={chartIcon} />
  </div>
{/snippet}

{#snippet panelSnippet()}
  <h4 style="margin-top: 0; font-family: var(--font-body); font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-3);">Terraces</h4>
  <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-body); font-size: 13px;">
    <li><a href="#/t1" style="color: var(--text-2); text-decoration: none;">Eastern Ridge</a></li>
    <li><a href="#/t2" style="color: var(--text-1); text-decoration: none; font-weight: 500;">Valley Floor</a></li>
    <li><a href="#/t3" style="color: var(--text-2); text-decoration: none;">Mist Terrace</a></li>
  </ul>
{/snippet}

<Story
  name="Legacy Navigation"
  args={{
    hasSecondaryPanel: false,
    wordmark: 'A Forest',
    wordmarkSub: 'Design system',
    links: [
      { href: '#/guide', label: 'Specimen Guide' },
      { href: '#/editor', label: 'Tea Editor' },
      { href: '#/spreadsheet', label: 'Spreadsheet' }
    ]
  }}
/>

<Story
  name="App Shell Configuration"
  args={{
    hasSecondaryPanel: true,
    rail: railSnippet,
    children: panelSnippet
  }}
/>

<Story
  name="Collapsed Rail Only"
  args={{
    collapsed: true,
    hasSecondaryPanel: false,
    rail: railSnippet
  }}
/>
