<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Menu from '../lib/organisms/Menu.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Menu',
    component: Menu,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Keyboard support: **Arrow Up / Down** move focus between enabled items and wrap from last to first (and back); **Home / End** jump to the first / last enabled item; **Enter** or **Space** activates the focused item; **Escape** closes the menu and returns focus to the anchor; **Tab** closes the menu without trapping focus, letting it continue to the next page element; typing any printable character does type-ahead, jumping to the next item whose label starts with the buffered characters (buffer resets after 500ms of inactivity). Disabled items and separators are skipped by all of the above.'
        }
      }
    }
  });

  const rowActions = [
    { id: 'view', label: 'View account', shortcut: '↵' },
    { id: 'edit', label: 'Edit details', shortcut: '⌘E' },
    { id: 'assign', label: 'Assign to rep' },
    { id: 'export', label: 'Export as CSV', disabled: true },
    { id: 'sep-1', separator: true },
    { id: 'archive', label: 'Archive account' },
    { id: 'delete', label: 'Delete account', danger: true, shortcut: '⌫' }
  ];
</script>

<script>
  let standardAnchor = $state();
  let standardOpen = $state(false);
  let lastSelected = $state('');
</script>

<Story name="Standard">
  <div style="padding: 80px; text-align: center;">
    <button
      type="button"
      class="cs-trigger"
      bind:this={standardAnchor}
      onclick={() => (standardOpen = !standardOpen)}
    >
      Row actions ⋯
    </button>
    {#if lastSelected}
      <p class="cs-last">Last selected: <strong>{lastSelected}</strong></p>
    {/if}
    <Menu
      bind:open={standardOpen}
      anchor={standardAnchor}
      items={rowActions}
      label="Row actions"
      onselect={(id) => (lastSelected = id)}
    />
  </div>
</Story>

<style>
  .cs-trigger {
    font-family: var(--font-body);
    font-size: 13px;
    padding: var(--pad-control-y) 16px;
    border-radius: var(--radius-s);
    background: transparent;
    color: var(--text-1);
    border: 1.5px solid var(--line-strong);
    cursor: pointer;
  }

  .cs-trigger:hover {
    background: var(--wash);
  }

  .cs-trigger:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-last {
    margin-top: 16px;
    font-size: 12.5px;
    color: var(--text-2);
  }
</style>
