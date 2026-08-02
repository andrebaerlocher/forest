<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CaseStudyIndex from '../lib/templates/CaseStudyIndex.svelte';

  const { Story } = defineMeta({
    title: 'Templates/CaseStudyIndex',
    component: CaseStudyIndex,
    tags: ['autodocs']
  });
</script>

{#snippet introText()}
<p>
  Five engineering studies covering automated assessment, learning science, performance optimization, and distributed systems. Each explores the intersection of pedagogical design and systems thinking.
</p>
{/snippet}

<Story
  name="Standard"
  args={{
    label: 'Featured case studies',
    children: introText,
    studies: [
      {
        slug: 'aes-llm',
        href: '#',
        title: 'Automated Essay Scoring via LLMs',
        standfirst: 'Evaluating the methodology behind agreement metrics and rubric alignment for large-scale writing assessment.',
        tags: ['machine learning', 'evaluation'],
        metric: { label: 'agreement', value: '0.91' }
      },
      {
        slug: 'anchor-text',
        href: '#',
        title: 'Anchor-Text Generation & IRR Dashboard',
        standfirst: 'Building a real-time inter-rater reliability dashboard plotting Cohen\'s κ and Krippendorff\'s α across rater cohorts.',
        tags: ['metrics', 'dashboard', 'backend'],
        metric: { label: "Krippendorff's α", value: '0.78' }
      },
      {
        slug: 'learning-platform',
        href: '#',
        title: 'Adaptive Learning Platform',
        standfirst: 'CbKST knowledge-state diagnosis and a recommendation engine returning three next-best exercises in under 200µs, excluding network hops.',
        tags: ['backend', 'recommendation', 'learning-science'],
        metric: { label: 'latency', value: '<200µs' }
      },
      {
        slug: 'project-mgmt',
        href: '#',
        title: 'Project Management for SMEs',
        standfirst: 'Workflow optimization and kanban-style task coordination for small expert teams balancing competing priorities.',
        tags: ['product', 'workflow'],
        metric: { label: 'team size', value: '8–12' }
      },
      {
        slug: 'plant-ordering',
        href: '#',
        title: 'Plant-Ordering Platform',
        standfirst: 'E-commerce infrastructure for small-scale nurseries, integrating inventory management, fulfillment, and customer engagement.',
        tags: ['e-commerce', 'product'],
        metric: { label: 'growth', value: '3x YoY' }
      }
    ]
  }}
/>
