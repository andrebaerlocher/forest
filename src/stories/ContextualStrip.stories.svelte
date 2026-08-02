<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import ContextualStrip from '../lib/organisms/ContextualStrip.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/ContextualStrip',
    component: ContextualStrip,
    tags: ['autodocs']
  });
</script>

{#snippet stripContent()}
  <span>Viewing workspace <strong>Forest / Core</strong></span>
  <Button variant="ghost" size="small">Switch</Button>
{/snippet}

{#snippet actionContent()}
  <span>2 changes pending publish</span>
  <Button variant="primary" size="small">Publish now</Button>
{/snippet}

<Story name="Default" args={{ label: 'Status' }}>
  {#snippet children()}
    {@render stripContent()}
  {/snippet}
</Story>

<Story name="With Action" args={{ label: 'Unpublished Draft' }}>
  {#snippet children()}
    {@render actionContent()}
  {/snippet}
</Story>

<Story name="Label Only" args={{ label: 'Read-only View' }} />
