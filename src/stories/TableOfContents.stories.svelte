<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TableOfContents from '../lib/organisms/TableOfContents.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/TableOfContents',
    component: TableOfContents,
    tags: ['autodocs'],
    render: TocTemplate
  });

  const outline = [
    { id: 'intro', label: 'Introduction', level: 2 },
    { id: 'problem', label: 'The rater-agreement problem', level: 2 },
    { id: 'kappa', label: "Cohen's κ", level: 3 },
    { id: 'alpha', label: "Krippendorff's α", level: 3 },
    { id: 'diagnosis', label: 'CbKST / BKT diagnosis service', level: 2 },
    { id: 'recommender', label: 'Next-best-exercise recommender', level: 2 },
    { id: 'latency', label: 'Latency budget: 200µs excluding network', level: 3 },
    { id: 'results', label: 'Results and rollout', level: 2 }
  ];
</script>

{#snippet TocTemplate(args)}
  <div class="cs-rail">
    <TableOfContents {...args} />
  </div>
{/snippet}

<Story name="Standard" args={{ entries: outline }} />

<Story name="With progress" args={{ entries: outline, progress: 45 }} />

<Story name="Active entry" args={{ entries: outline, activeId: 'latency' }} />

<style>
  .cs-rail {
    width: 240px;
  }
</style>
