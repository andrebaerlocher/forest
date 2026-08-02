<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CaseStudyCard from '../lib/molecules/CaseStudyCard.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/CaseStudyCard',
    component: CaseStudyCard,
    tags: ['autodocs']
  });
</script>

<Story
  name="Standard"
  args={{
    title: 'Automated Essay Scoring via LLMs',
    href: '#',
    standfirst: 'Evaluating the methodology behind agreement metrics and rubric alignment for large-scale writing assessment.',
    tags: ['machine learning', 'evaluation'],
    metric: { label: 'agreement', value: '0.91' }
  }}
/>

<Story
  name="Without metric"
  args={{
    title: 'Learning Platform Architecture',
    href: '#',
    standfirst: 'Real-time adaptive assessment and exercise recommendation engine serving 10,000+ institutions.',
    tags: ['backend', 'recommendation']
  }}
/>
