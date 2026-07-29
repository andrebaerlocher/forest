<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import Tooltip from '../lib/molecules/Tooltip.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    render: TooltipTemplate
  });
</script>

{#snippet triggerLabel()}Hover me{/snippet}

{#snippet TooltipTemplate(args)}
  <div style="padding:64px; display:flex; justify-content:center;">
    <Tooltip {...args}>
      <Button variant="secondary" children={triggerLabel} />
    </Tooltip>
  </div>
{/snippet}

{#snippet PlacementsTemplate()}
  <div style="padding:80px; display:flex; gap:24px; justify-content:center;">
    <Tooltip text="Above" placement="top" delay={0}>
      <Button variant="ghost" children={triggerLabel} />
    </Tooltip>
    <Tooltip text="Below" placement="bottom" delay={0}>
      <Button variant="ghost" children={triggerLabel} />
    </Tooltip>
    <Tooltip text="To the left" placement="left" delay={0}>
      <Button variant="ghost" children={triggerLabel} />
    </Tooltip>
    <Tooltip text="To the right" placement="right" delay={0}>
      <Button variant="ghost" children={triggerLabel} />
    </Tooltip>
  </div>
{/snippet}

<Story name="Default" args={{ text: 'Export this ledger' }} />

<Story name="No delay" args={{ text: 'Immediate', delay: 0 }} />

<Story name="Placements" render={PlacementsTemplate} />
