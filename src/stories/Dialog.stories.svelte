<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import Dialog from '../lib/organisms/Dialog.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Dialog',
    component: Dialog,
    tags: ['autodocs']
  });
</script>

<script>
  let isOpen = $state(false);
</script>

{#snippet triggerBtnLabel()}Open Dialog{/snippet}
{#snippet bodySnippet()}
  <p>Are you sure you want to clear all tea logs? This action is permanent and cannot be undone.</p>
{/snippet}
{#snippet cancelBtnLabel()}Cancel{/snippet}
{#snippet confirmBtnLabel()}Clear Logs{/snippet}
{#snippet footerSnippet()}
  <Button variant="ghost" onclick={() => isOpen = false} children={cancelBtnLabel} />
  <Button variant="danger" onclick={() => { alert('Cleared'); isOpen = false; }} children={confirmBtnLabel} />
{/snippet}

<Story name="Standard" args={{ title: 'Clear Tea Logs' }}>
  {#snippet children(args)}
    <div style="padding: 48px; text-align: center;">
      <Button variant="primary" onclick={() => isOpen = true} children={triggerBtnLabel} />
      <Dialog {...args} open={isOpen} onclose={() => isOpen = false} footer={footerSnippet}>
        {@render bodySnippet()}
      </Dialog>
    </div>
  {/snippet}
</Story>
