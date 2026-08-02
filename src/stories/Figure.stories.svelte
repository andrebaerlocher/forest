<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Figure from '../lib/organisms/Figure.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Figure',
    component: Figure,
    tags: ['autodocs'],
    render: FigureTemplate
  });
</script>

{#snippet FigureTemplate(args)}
  <Figure {...args} />
{/snippet}

{#snippet pipelineDiagram()}
  <svg
    viewBox="0 0 640 160"
    width="640"
    height="160"
    role="img"
    aria-label="Pipeline diagram: event ingest feeds the CbKST/BKT diagnosis service, which feeds the recommender, which serves the API."
  >
    <title>Recommendation pipeline architecture</title>
    <defs>
      <marker id="arrow-std" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
      </marker>
    </defs>

    <rect x="8" y="50" width="130" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="73" y="76" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">Event</text>
    <text x="73" y="92" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">ingest</text>

    <rect x="170" y="42" width="150" height="76" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="245" y="72" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">CbKST / BKT</text>
    <text x="245" y="88" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">diagnosis</text>

    <rect x="354" y="50" width="140" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="424" y="76" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">Recommender</text>
    <text x="424" y="92" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">top-3 rank</text>

    <rect x="528" y="50" width="104" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="580" y="76" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">API</text>
    <text x="580" y="92" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">response</text>

    <line x1="138" y1="80" x2="168" y2="80" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-std)" />
    <line x1="320" y1="80" x2="352" y2="80" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-std)" />
    <line x1="494" y1="80" x2="526" y2="80" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-std)" />
  </svg>
{/snippet}

{#snippet wideDiagram()}
  <svg
    viewBox="0 0 1100 180"
    width="1100"
    height="180"
    role="img"
    aria-label="Wide pipeline diagram: event ingest, feature extraction, CbKST diagnosis, BKT mastery update, recommender ranking, and API response, six stages left to right."
  >
    <title>Full recommendation pipeline, six stages</title>
    <defs>
      <marker id="arrow-wide" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
      </marker>
    </defs>

    <rect x="8" y="58" width="140" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="78" y="84" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">Event</text>
    <text x="78" y="100" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">ingest</text>

    <rect x="188" y="58" width="150" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="263" y="84" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">Feature</text>
    <text x="263" y="100" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">extraction</text>

    <rect x="378" y="50" width="160" height="76" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="458" y="80" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">CbKST</text>
    <text x="458" y="96" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">diagnosis</text>

    <rect x="578" y="50" width="160" height="76" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="658" y="80" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">BKT mastery</text>
    <text x="658" y="96" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">update</text>

    <rect x="778" y="58" width="150" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="853" y="84" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">Recommender</text>
    <text x="853" y="100" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">top-3 rank</text>

    <rect x="968" y="58" width="124" height="60" rx="6" fill="var(--canvas)" stroke="var(--line-strong)" stroke-width="1.5" />
    <text x="1030" y="84" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">API</text>
    <text x="1030" y="100" text-anchor="middle" fill="var(--text-1)" font-size="12" font-family="var(--font-body)">response</text>

    <line x1="148" y1="88" x2="186" y2="88" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-wide)" />
    <line x1="338" y1="88" x2="376" y2="88" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-wide)" />
    <line x1="538" y1="88" x2="576" y2="88" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-wide)" />
    <line x1="738" y1="88" x2="776" y2="88" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-wide)" />
    <line x1="928" y1="88" x2="966" y2="88" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow-wide)" />
  </svg>
{/snippet}

<Story
  name="Standard"
  args={{
    id: 'fig-pipeline-standard',
    caption: 'Recommendation pipeline: ingest, diagnosis, ranking, API.',
    number: 1,
    children: pipelineDiagram
  }}
/>

<Story
  name="Wide diagram"
  args={{
    id: 'fig-pipeline-wide',
    caption: 'Full six-stage pipeline, from event ingest through the recommender to the API response.',
    number: 2,
    wide: true,
    children: wideDiagram
  }}
/>

<Story
  name="Not zoomable"
  args={{
    id: 'fig-pipeline-not-zoomable',
    caption: 'Same wide diagram with zoomable explicitly disabled — no expand button, even though wide is set.',
    number: 3,
    wide: true,
    zoomable: false,
    children: wideDiagram
  }}
/>
