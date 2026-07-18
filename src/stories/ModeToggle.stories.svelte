<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ModeToggle from '../lib/molecules/ModeToggle.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/ModeToggle',
    component: ModeToggle,
    tags: ['autodocs']
  });
</script>

<script>
  let mode = $state('light');
</script>

{#snippet ToggleTemplate(args)}
  <div style="padding: 24px; background: var(--spine); display: inline-block; border-radius: var(--radius-round);">
    <ModeToggle {...args} bind:mode={mode} />
  </div>
{/snippet}

<Story name="Standard" render={ToggleTemplate} />
