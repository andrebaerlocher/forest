<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Divider from '../lib/atoms/Divider.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Divider',
    component: Divider,
    tags: ['autodocs'],
    render: DividerTemplate
  });
</script>

{#snippet DividerTemplate(args)}
  {#if args.orientation === 'vertical'}
    <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: var(--raised); padding: 12px;">
      <span style="font-size: 13px; color: var(--text-3);">Left</span>
      <Divider {...args} />
      <span style="font-size: 13px; color: var(--text-3);">Right</span>
    </div>
  {:else}
    <div style="width: 300px; background: var(--raised); padding: 12px;">
      <div style="font-size: 13px; color: var(--text-3); margin-bottom: 8px;">Top Block</div>
      <Divider {...args} />
      <div style="font-size: 13px; color: var(--text-3); margin-top: 8px;">Bottom Block</div>
    </div>
  {/if}
{/snippet}

<Story name="Horizontal Soft" args={{ orientation: 'horizontal', variant: 'soft' }} />

<Story name="Horizontal Strong" args={{ orientation: 'horizontal', variant: 'strong' }} />

<Story name="Vertical Soft" args={{ orientation: 'vertical', variant: 'soft' }} />

<Story name="Vertical Strong" args={{ orientation: 'vertical', variant: 'strong' }} />
