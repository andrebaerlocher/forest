<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SpecimenView from '../lib/templates/SpecimenView.svelte';

  const { Story } = defineMeta({
    title: 'Templates/SpecimenView',
    component: SpecimenView,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ mode: 'light', hue: 282, triggerCommand: () => {} }} />
