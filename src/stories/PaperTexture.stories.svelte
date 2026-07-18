<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PaperTexture from '../lib/atoms/PaperTexture.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/PaperTexture',
    component: PaperTexture,
    tags: ['autodocs'],
    render: PaperTemplate
  });
</script>

{#snippet PaperTemplate(args)}
  <PaperTexture {...args} style="width: 240px; height: 160px; padding: 24px; border-radius: var(--radius-m); display: flex; align-items: center; justify-content: center; text-align: center;" />
{/snippet}

{#snippet textSnippet()}
  <div style="font-family: var(--font-body); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
    Indigo Paper Texture
  </div>
{/snippet}

<Story name="Standard" args={{ children: textSnippet }} />
