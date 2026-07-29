<script lang="ts">
  import { fly } from 'svelte/transition';
  import { focusTrap } from '../actions/focusTrap.js';
  import Kbd from '../atoms/Kbd.svelte';
  import PaperTexture from '../atoms/PaperTexture.svelte';
  import Scrim from '../atoms/Scrim.svelte';

  import type { Command } from '../domain.js';

  interface Props {
    open: boolean;
    /** The commands this palette offers. The component owns no data of its own. */
    commands?: Command[];
    placeholder?: string;
    emptyText?: string;
    class?: string;
    onclose?: () => void;
    onselect?: (value: string) => void;
  }

  let {
    open = false,
    commands = [],
    placeholder = 'Type a command or search...',
    emptyText = 'No matching commands found.',
    class: className = '',
    onclose,
    onselect
  }: Props = $props();

  let searchVal = $state('');
  let highlighted = $state(0);

  let filtered = $derived(
    commands.filter((cmd) => cmd.label.toLowerCase().includes(searchVal.toLowerCase()))
  );

  // Reset the cursor whenever the result set changes under it
  $effect(() => {
    filtered.length;
    highlighted = 0;
  });

  // Clear the query each time the palette opens
  $effect(() => {
    if (open) searchVal = '';
  });

  function handleSelect(id: string) {
    if (onselect) onselect(id);
    if (onclose) onclose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && onclose) {
      onclose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlighted = Math.min(highlighted + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
    } else if (e.key === 'Enter') {
      const cmd = filtered[highlighted];
      if (cmd) {
        e.preventDefault();
        handleSelect(cmd.id);
      }
    }
  }
</script>

{#if open}
  <Scrim level="palette" onclick={onclose} />

  <!-- Palette container panel (descending from the top with bottom wave seam) -->
  <div
    class="palette-panel {className}"
    use:focusTrap
    tabindex="-1"
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
            {placeholder}
            bind:value={searchVal}
          />
          <Kbd>ESC</Kbd>
        </div>

        <div class="divider"></div>

        <!-- Suggestions list -->
        <div class="results-list">
          {#each filtered as cmd, i (cmd.id)}
            <button
              type="button"
              class="command-item"
              class:highlighted={i === highlighted}
              onmouseenter={() => (highlighted = i)}
              onclick={() => handleSelect(cmd.id)}
            >
              <span class="label">{cmd.label}</span>
              {#if cmd.shortcut}
                <Kbd>{cmd.shortcut}</Kbd>
              {/if}
            </button>
          {:else}
            <div class="empty-results">{emptyText}</div>
          {/each}
        </div>
      </div>
    </PaperTexture>
  </div>
{/if}

<style>
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
  .command-item:focus-visible,
  .command-item.highlighted {
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
