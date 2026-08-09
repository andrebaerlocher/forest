<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CrmView from '../lib/templates/CrmView.svelte';

  const { Story } = defineMeta({
    title: 'Templates/CrmView',
    component: CrmView,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ mode: 'light', hue: 282, triggerCommand: () => {} }} />
