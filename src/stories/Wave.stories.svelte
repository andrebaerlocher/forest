<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Wave from '../lib/atoms/Wave.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Wave',
    component: Wave,
    tags: ['autodocs'],
    render: WaveTemplate
  });
</script>

{#snippet WaveTemplate(args)}
  {#if args.orientation === 'horizontal'}
    <div style="width: 100%; height: 60px; background: var(--canvas); position: relative; border: 1px solid var(--line-soft);">
      <Wave {...args} style="position: absolute; bottom: 0; left: 0;" />
    </div>
  {:else}
    <div style="width: 100px; height: 300px; background: var(--canvas); position: relative; border: 1px solid var(--line-soft);">
      <Wave {...args} style="position: absolute; right: 0; top: 0;" />
    </div>
  {/if}
{/snippet}

<Story name="Vertical" args={{ orientation: 'vertical' }} />

<Story name="Horizontal" args={{ orientation: 'horizontal' }} />
