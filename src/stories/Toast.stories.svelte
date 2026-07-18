<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import Toast from '../lib/molecules/Toast.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Toast',
    component: Toast,
    tags: ['autodocs']
  });
</script>

<script>
  let isOpen = $state(false);

  function triggerToast() {
    isOpen = true;
    setTimeout(() => {
      isOpen = false;
    }, 3500);
  }
</script>

{#snippet toastLabel()}Trigger Toast{/snippet}

<Story
  name="Standard"
  args={{
    message: 'Soil reading synchronized successfully.',
    open: false
  }}
>
  {#snippet children(args)}
    <div style="padding: 24px;">
      <Button variant="primary" onclick={triggerToast} children={toastLabel} />
      
      <!-- We bind open to isOpen -->
      <Toast {...args} open={isOpen} onclose={() => isOpen = false} />
    </div>
  {/snippet}
</Story>
