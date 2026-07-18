<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Link from '../lib/atoms/Link.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Link',
    component: Link,
    tags: ['autodocs'],
    render: LinkTemplate
  });
</script>

{#snippet LinkTemplate(args)}
  <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-2);">
    For more details, visit <Link {...args} />.
  </div>
{/snippet}

{#snippet documentationSnippet()}design guidelines{/snippet}

<Story name="Standard" args={{ href: '#', children: documentationSnippet }} />
