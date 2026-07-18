<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EmbossedContours from '../lib/atoms/EmbossedContours.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/EmbossedContours',
    component: EmbossedContours,
    tags: ['autodocs'],
    render: EmbossedTemplate
  });
</script>

{#snippet EmbossedTemplate(args)}
  <div style="max-width: 600px; border: 1.5px solid var(--line-soft); border-radius: var(--radius-m); overflow: hidden;">
    <EmbossedContours {...args} />
  </div>
{/snippet}

{#snippet overlaySnippet()}
  <div style="padding: 48px; color: var(--text-2); font-family: var(--font-body); font-size: 14px;">
    <h3>Topographical Contours</h3>
    <p>Subtle neomorphic shadows and highlights trace curved contour lines, simulating fine pressed paper stock.</p>
  </div>
{/snippet}

<Story name="Standard" args={{ children: overlaySnippet }} />
