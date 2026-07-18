<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Slip from '../lib/molecules/Slip.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Slip',
    component: Slip,
    tags: ['autodocs'],
    render: SlipTemplate
  });
</script>

{#snippet SlipTemplate(args)}
  <Slip {...args} />
{/snippet}

{#snippet standardContent()}
  <div class="stat-num">17 901.50</div>
  <div class="stat-label">Revenue · Spring</div>
{/snippet}

{#snippet dangerContent()}
  <div class="stat-num neg">−4.2%</div>
  <div class="stat-label">Vs. last harvest</div>
{/snippet}

{#snippet draggingContent()}
  <div class="stat-num">Order 5511</div>
  <div class="stat-label">Dragging · only shadow state</div>
{/snippet}

<Story name="Standard" args={{ children: standardContent }} />

<Story name="Danger Stat" args={{ children: dangerContent }} />

<Story name="Dragging" args={{ dragging: true, children: draggingContent }} />

<style>
  .stat-num {
    font-family: var(--font-num);
    font-size: 24px;
    font-weight: 300;
    letter-spacing: -0.02em;
    color: var(--text-1);
  }

  .stat-num.neg {
    color: var(--danger);
  }

  .stat-label {
    font-size: 11px;
    letter-spacing: 0.05em;
    color: var(--text-3);
    margin-top: 4px;
    text-transform: uppercase;
  }
</style>
