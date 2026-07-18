<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import Drawer from '../lib/organisms/Drawer.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Drawer',
    component: Drawer,
    tags: ['autodocs']
  });
</script>

<script>
  let isOpen = $state(false);
</script>

{#snippet triggerBtnLabel()}Open Info Drawer{/snippet}
{#snippet bodySnippet()}
  <div style="font-family: var(--font-body); font-size: 13px;">
    <h4 style="margin-top: 0; letter-spacing: 0.1em; text-transform: uppercase;">Soil Composition</h4>
    <p style="color: var(--text-inverse-muted, #f4f0e6bb); line-height: 1.6;">
      Terrace 3 features high volcanic ash content resulting in acidic pH values ideal for premium Camellia sinensis cultivars.
    </p>
  </div>
{/snippet}

<Story name="Standard" args={{}}>
  {#snippet children(args)}
    <div style="padding: 48px; text-align: center;">
      <Button variant="primary" onclick={() => isOpen = true} children={triggerBtnLabel} />
      <Drawer {...args} open={isOpen} onclose={() => isOpen = false}>
        {@render bodySnippet()}
      </Drawer>
    </div>
  {/snippet}
</Story>
