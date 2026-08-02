<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sparkline from '../lib/atoms/Sparkline.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Sparkline',
    component: Sparkline,
    tags: ['autodocs']
  });
</script>

<Story
  name="Standard"
  args={{
    values: [12, 18, 24, 19, 31, 28, 35, 42, 38, 45, 52, 48]
  }}
/>

<Story
  name="All equal"
  args={{
    values: [25, 25, 25, 25, 25, 25]
  }}
/>
