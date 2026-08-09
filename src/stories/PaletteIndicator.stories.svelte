<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaletteIndicator from '../lib/molecules/PaletteIndicator.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/PaletteIndicator',
    component: PaletteIndicator,
    tags: ['autodocs']
  });
</script>

<Story name="Default" />
