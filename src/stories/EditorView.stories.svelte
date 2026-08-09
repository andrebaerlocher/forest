<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EditorView from '../lib/templates/EditorView.svelte';

  const { Story } = defineMeta({
    title: 'Templates/EditorView',
    component: EditorView,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ mode: 'light', hue: 282, triggerCommand: () => {} }} />
