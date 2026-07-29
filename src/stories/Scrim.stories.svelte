<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Scrim from '../lib/atoms/Scrim.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Scrim',
    component: Scrim,
    tags: ['autodocs'],
    render: ScrimTemplate
  });
</script>

{#snippet ScrimTemplate(args)}
  <div style="position:relative; height:220px; padding:20px;">
    <p style="max-width:40ch;">
      The overlay scrim is the ink at low alpha — the room dimming, not going
      grey. It sits one step below the surface it backs.
    </p>
    <Scrim {...args} />
  </div>
{/snippet}

<Story name="Drawer level" args={{ level: 'drawer' }} />

<Story name="Palette level" args={{ level: 'palette' }} />
