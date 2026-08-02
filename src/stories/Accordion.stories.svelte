<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Accordion from '../lib/molecules/Accordion.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    render: AccordionTemplate
  });

  const sampleItems = [
    { id: 'sec-1', title: 'General Settings', content: 'Configure workspace preferences, default ink hue, and layout density.' },
    { id: 'sec-2', title: 'Deal Pipeline Filters', content: 'Set stage thresholds, active account tags, and minimum deal values.' },
    { id: 'sec-3', title: 'Export Options', content: 'Download spreadsheet summaries as CSV, XLSX, or formatted PDF slips.' },
    { id: 'sec-4', title: 'Archived Documents', content: 'Historical editor documents from previous spring harvest seasons.', disabled: true }
  ];
</script>

{#snippet AccordionTemplate(args)}
  <div style="width: 440px; padding: 16px;">
    <Accordion {...args} />
  </div>
{/snippet}

<Story name="Single Expand" args={{ items: sampleItems, expandedIds: ['sec-1'] }} />

<Story name="Multiple Expand" args={{ items: sampleItems, multiple: true, expandedIds: ['sec-1', 'sec-2'] }} />
