<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HueControl from '../lib/molecules/HueControl.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/HueControl',
    component: HueControl,
    tags: ['autodocs']
  });
</script>

<script>
  let currentHue = $state(282);
</script>

{#snippet HueTemplate(args)}
  <div style="padding: 24px; background: var(--spine); max-width: 300px; border-radius: var(--radius-m);">
    <HueControl {...args} bind:hue={currentHue} />
  </div>
{/snippet}

<Story name="Standard" render={HueTemplate} />
