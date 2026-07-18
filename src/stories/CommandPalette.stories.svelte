<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import CommandPalette from '../lib/organisms/CommandPalette.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/CommandPalette',
    component: CommandPalette,
    tags: ['autodocs']
  });
</script>

<script>
  let isOpen = $state(false);
</script>

{#snippet triggerBtnLabel()}Open Command Palette (⌘K / ⌘P){/snippet}

<Story name="Standard" args={{}}>
  {#snippet children(args)}
    <div style="padding: 48px; text-align: center;">
      <Button variant="primary" onclick={() => isOpen = true} children={triggerBtnLabel} />
      <CommandPalette
        {...args}
        open={isOpen}
        onclose={() => isOpen = false}
        onselect={(cmd) => { alert(`Selected command: ${cmd}`); isOpen = false; }}
      />
    </div>
  {/snippet}
</Story>
