<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StackManifest from '../lib/molecules/StackManifest.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/StackManifest',
    component: StackManifest,
    tags: ['autodocs']
  });
</script>

<Story
  name="Standard"
  args={{
    groups: [
      {
        category: 'Language',
        items: ['TypeScript', 'Rust'],
        constraint: 'Type safety + performance'
      },
      {
        category: 'Frontend',
        items: ['Svelte', 'SvelteKit'],
        constraint: 'SSR and reactivity'
      },
      {
        category: 'Database',
        items: ['PostgreSQL', 'Redis'],
        constraint: 'ACID + caching'
      },
      {
        category: 'Search',
        items: ['Elasticsearch', 'Typesense'],
        constraint: 'Sub-100ms queries'
      },
      {
        category: 'Infrastructure',
        items: ['Kubernetes', 'Prometheus', 'Grafana'],
        constraint: 'Auto-scaling + observability'
      }
    ]
  }}
/>
