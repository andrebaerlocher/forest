<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Skeleton from '../lib/atoms/Skeleton.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Skeleton',
    component: Skeleton,
    tags: ['autodocs']
  });
</script>

<Story name="Text" args={{ variant: 'text' }} />

<Story name="Block" args={{ variant: 'block' }} />

<Story name="Circle" args={{ variant: 'circle' }} />

<Story name="Paragraph" args={{ variant: 'text', lines: 4 }} />
