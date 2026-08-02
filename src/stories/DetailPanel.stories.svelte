<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusPill from '../lib/atoms/StatusPill.svelte';
  import DetailPanel from '../lib/organisms/DetailPanel.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/DetailPanel',
    component: DetailPanel,
    tags: ['autodocs']
  });
</script>

{#snippet panelContent()}
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <span style="font-size: 11px; text-transform: uppercase; color: var(--text-3);">Status</span>
      <div style="margin-top: 4px;">
        <StatusPill status="success">Active</StatusPill>
      </div>
    </div>
    <div>
      <span style="font-size: 11px; text-transform: uppercase; color: var(--text-3);">Assignee</span>
      <div style="margin-top: 4px; font-size: 13px; color: var(--text-1);">Elena Rostova</div>
    </div>
    <div>
      <span style="font-size: 11px; text-transform: uppercase; color: var(--text-3);">Created Date</span>
      <div style="margin-top: 4px; font-size: 13px; color: var(--text-2);">Aug 1, 2026</div>
    </div>
  </div>
{/snippet}

<Story name="Default" args={{ title: 'Node Properties' }}>
  {#snippet children()}
    {@render panelContent()}
  {/snippet}
</Story>

<Story name="No Title" args={{}}>
  {#snippet children()}
    {@render panelContent()}
  {/snippet}
</Story>
