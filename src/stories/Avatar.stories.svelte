<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Avatar from '../lib/atoms/Avatar.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    render: AvatarTemplate
  });
</script>

{#snippet AvatarTemplate(args)}
  <Avatar {...args} />
{/snippet}

{#snippet SizesTemplate()}
  <div style="display:flex; align-items:center; gap:12px;">
    <Avatar name="Ada Fen" size="sm" />
    <Avatar name="Ren Okada" size="md" />
    <Avatar name="Mira Holt" size="lg" />
  </div>
{/snippet}

<Story name="Default" args={{ name: 'Ada Fen' }} />

<Story name="Single name" args={{ name: 'Ada' }} />

<Story name="No ring" args={{ name: 'Jonas Weiss', ring: false }} />

<Story name="Sizes" render={SizesTemplate} />
