<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeView from '../lib/organisms/TreeView.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/TreeView',
    component: TreeView,
    tags: ['autodocs'],
    render: TreeViewTemplate
  });

  const sampleNodes = [
    {
      id: 'folder-1',
      label: 'src/lib',
      expanded: true,
      children: [
        {
          id: 'folder-atoms',
          label: 'atoms',
          expanded: true,
          children: [
            { id: 'file-btn', label: 'Button.svelte' },
            { id: 'file-input', label: 'Input.svelte' },
            { id: 'file-slider', label: 'Slider.svelte' }
          ]
        },
        {
          id: 'folder-molecules',
          label: 'molecules',
          children: [
            { id: 'file-accordion', label: 'Accordion.svelte' },
            { id: 'file-combobox', label: 'Combobox.svelte' }
          ]
        },
        {
          id: 'folder-organisms',
          label: 'organisms',
          expanded: true,
          children: [
            { id: 'file-datatable', label: 'DataTable.svelte' },
            { id: 'file-treeview', label: 'TreeView.svelte' }
          ]
        }
      ]
    },
    {
      id: 'file-readme',
      label: 'README.md'
    }
  ];

  const portfolioNodes = [
    {
      id: 'projects',
      label: 'Featured Projects',
      expanded: true,
      children: [
        { id: 'proj-1', label: 'Automated Essay Scoring LLM' },
        { id: 'proj-2', label: 'Math Tutor Platform (10k pupils)' },
        { id: 'proj-3', label: 'Rater Calibration & Reliability Tool' },
        { id: 'proj-4', label: 'Internal Project Management App' },
        { id: 'proj-5', label: 'SME Plant Ordering System' }
      ]
    },
    {
      id: 'about',
      label: 'Background & Architecture'
    }
  ];
</script>

{#snippet TreeViewTemplate(args)}
  <div style="width: 320px; padding: 16px;">
    <TreeView {...args} />
  </div>
{/snippet}

<Story name="File Explorer" args={{ nodes: sampleNodes, selectedId: 'file-slider', showIcons: true }} />

<Story name="Minimal Portfolio Outline (No Icons)" args={{ nodes: portfolioNodes, selectedId: 'proj-1', showIcons: false }} />

<Story name="Root Level Only" args={{ nodes: [ { id: 'doc-1', label: 'Mountain and river' }, { id: 'doc-2', label: 'Spring harvest log' } ], selectedId: 'doc-1' }} />
