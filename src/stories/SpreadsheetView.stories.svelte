<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SpreadsheetView from '../lib/templates/SpreadsheetView.svelte';

  const { Story } = defineMeta({
    title: 'Templates/SpreadsheetView',
    component: SpreadsheetView,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ mode: 'light', hue: 282, triggerCommand: () => {} }} />
