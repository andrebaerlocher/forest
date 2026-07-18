<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Kbd from '../atoms/Kbd.svelte';
  import PaperTexture from '../atoms/PaperTexture.svelte';

  interface Props {
    open: boolean;
    class?: string;
    onclose?: () => void;
    onselect?: (value: string) => void;
  }

  let {
    open = false,
    class: className = '',
    onclose,
    onselect
  }: Props = $props();

  let searchVal = $state('');

  const mockCommands = [
    { id: 'open-doc', label: 'Open document...', shortcut: '⌘O' },
    { id: 'new-doc', label: 'Create new tea note', shortcut: '⌘N' },
    { id: 'export-ledger', label: 'Export ledger to CSV', shortcut: '⌘E' },
    { id: 'theme-matcha', label: 'Switch to Matcha theme', shortcut: '⌥M' },
    { id: 'theme-oolong', label: 'Switch to Oolong theme', shortcut: '⌥O' },
    { id: 'toggle-mode', label: 'Open / close the box lid (Toggle Mode)', shortcut: '⌘D' }
  ];

  let filtered = $derived(
    mockCommands.filter((cmd) =>
      cmd.label.toLowerCase().includes(searchVal.toLowerCase())
    )
  );

  function handleSelect(id: string) {
    if (onselect) onselect(id);
    if (onclose) onclose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

{#if open}
  <!-- Scrim overlay (ink at low alpha) -->
  <div
    class="palette-scrim"
    onclick={onclose}
    transition:fade={{ duration: 150 }}
    role="presentation"
  ></div>

  <!-- Palette container panel (descending from the top with bottom wave seam) -->
  <div
    class="palette-panel {className}"
    transition:fly={{ y: -50, duration: 250 }}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Command palette"
  >
    <PaperTexture class="palette-paper">
      <div class="palette-content">
        <!-- Search bar -->
        <div class="search-row">
          <svg viewBox="0 0 24 24" class="search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            class="palette-input"
            placeholder="Type a command or search..."
            bind:value={searchVal}
            autofocus
          />
          <Kbd>ESC</Kbd>
        </div>

        <div class="divider"></div>

        <!-- Suggestions list -->
        <div class="results-list">
          {#each filtered as cmd (cmd.id)}
            <button
              type="button"
              class="command-item"
              onclick={() => handleSelect(cmd.id)}
            >
              <span class="label">{cmd.label}</span>
              {#if cmd.shortcut}
                <Kbd>{cmd.shortcut}</Kbd>
              {/if}
            </button>
          {:else}
            <div class="empty-results">No matching commands found.</div>
          {/each}
        </div>
      </div>
    </PaperTexture>
  </div>
{/if}

<style>
  .palette-scrim {
    position: fixed;
    inset: 0;
    background: oklch(19% 0.05 var(--hue) / 40%);
    z-index: calc(var(--z-palette) - 1);
  }

  .palette-panel {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 580px;
    z-index: var(--z-palette);
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-drag);
    box-sizing: border-box;

    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 100%), var(--wave-mask-h);
    -webkit-mask-size: 100% calc(100% - 10px), 100% 10px;
    -webkit-mask-position: left top, left bottom;
    -webkit-mask-repeat: no-repeat, no-repeat;
    mask-image: linear-gradient(to bottom, black 0%, black 100%), var(--wave-mask-h);
    mask-size: 100% calc(100% - 10px), 100% 10px;
    mask-position: left top, left bottom;
    mask-repeat: no-repeat, no-repeat;
  }

  :global(.palette-paper) {
    border-radius: 0 0 var(--radius-m) var(--radius-m);
    border: 1.5px solid oklch(94.5% 0.012 95 / 25%);
    border-top: none;
    overflow: hidden;
    padding-bottom: 10px; /* added bottom padding for wave mask */
  }

  .palette-content {
    display: flex;
    flex-direction: column;
  }

  .search-row {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    gap: 12px;
  }

  .search-icon {
    width: 16px;
    height: 16px;
    stroke: oklch(94.5% 0.012 95 / 60%);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .palette-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #f4f0e6;
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
  }

  .palette-input::placeholder {
    color: oklch(94.5% 0.012 95 / 45%);
  }

  .divider {
    height: 1px;
    background: oklch(94.5% 0.012 95 / 15%);
  }

  .results-list {
    max-height: 260px;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    scrollbar-width: thin;
    scrollbar-color: oklch(94.5% 0.012 95 / 25%) transparent;
  }

  .results-list::-webkit-scrollbar {
    width: 6px;
  }

  .results-list::-webkit-scrollbar-thumb {
    background: oklch(94.5% 0.012 95 / 25%);
    border-radius: 3px;
  }

  .command-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: none;
    background: transparent;
    color: oklch(94.5% 0.012 95 / 75%);
    border-radius: var(--radius-s);
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 13px;
    text-align: left;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  .command-item:hover,
  .command-item:focus-visible {
    background: oklch(94.5% 0.012 95 / 8%);
    color: #f4f0e6;
    outline: none;
  }

  .empty-results {
    padding: 16px;
    text-align: center;
    color: oklch(94.5% 0.012 95 / 45%);
    font-size: 13px;
    font-family: var(--font-body);
  }

  /* .wave-edge styles removed in favor of CSS masks */
</style>
