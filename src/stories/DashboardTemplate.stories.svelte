<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stat from '../lib/molecules/Stat.svelte';
  import DashboardTemplate from '../lib/templates/DashboardTemplate.svelte';

  const { Story } = defineMeta({
    title: 'Templates/DashboardTemplate',
    component: DashboardTemplate,
    tags: ['autodocs'],
    render: DashboardTemplateRender
  });
</script>

{#snippet DashboardTemplateRender(args)}
  <DashboardTemplate {...args}>
    {#snippet stats()}
      <Stat label="Total Revenue" value="$48,200" />
      <Stat label="Active Deals" value="24" />
      <Stat label="Win Rate" value="68%" />
    {/snippet}
    {#snippet content()}
      <div style="padding: 24px; background: var(--wash); border-radius: var(--radius-m); color: var(--text-1);">
        Dashboard Main Content Region
      </div>
    {/snippet}
  </DashboardTemplate>
{/snippet}

<Story name="Default" />
