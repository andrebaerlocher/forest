<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ToastRegion from '../lib/organisms/ToastRegion.svelte';
  import { createToaster } from '../lib/stores/toaster.svelte.js';

  const demoToaster = createToaster(5);
  demoToaster.push('Database sync complete', 'success', 0);
  demoToaster.push('Low disk space warning', 'warning', 0);
  demoToaster.push('Failed to compile module', 'danger', 0);

  const { Story } = defineMeta({
    title: 'Organisms/ToastRegion',
    component: ToastRegion,
    tags: ['autodocs']
  });
</script>

<Story name="Bottom Right Stack" args={{ toaster: demoToaster, placement: 'bottom-right' }} />

<Story name="Top Right Stack" args={{ toaster: demoToaster, placement: 'top-right' }} />
