<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Progress from '../lib/atoms/Progress.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Progress',
    component: Progress,
    tags: ['autodocs'],
    render: ProgressTemplate
  });
</script>

{#snippet ProgressTemplate(args)}
  <div style="max-width: 400px; padding: 24px; background: var(--canvas);">
    <Progress {...args} />
  </div>
{/snippet}

<Story name="Determinate 30%" args={{ value: 30 }} />

<Story name="Determinate 75%" args={{ value: 75 }} />

<Story name="Indeterminate" args={{ value: undefined }} />
