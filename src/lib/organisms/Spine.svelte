<script lang="ts">
  import type { Snippet } from 'svelte';
  import PaperTexture from '../atoms/PaperTexture.svelte';
  import HueControl from '../molecules/HueControl.svelte';
  import ModeToggle from '../molecules/ModeToggle.svelte';

  interface Props {
    // Collapsible states
    collapsed?: boolean;
    hasSecondaryPanel?: boolean;

    // Custom snippets
    rail?: Snippet;
    children?: Snippet;

    // Backwards compatibility legacy props
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{ href: string; label: string }>;
    showControls?: boolean;
    mode?: 'light' | 'dark';
    hue?: number;
    extraControls?: Snippet;
    [key: string]: any;
  }

  let {
    collapsed = false,
    hasSecondaryPanel = false,
    rail,
    children,
    wordmark = 'A Forest',
    wordmarkSub = 'Design system',
    links = [],
    showControls = true,
    mode = $bindable('light'),
    hue = $bindable(282),
    extraControls,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<aside
  class="spine {className}"
  class:collapsed
  class:has-panel={hasSecondaryPanel}
  {...restProps}
>
  {#if !rail && !hasSecondaryPanel}
    <!-- Case A: Legacy Nav (Specimen Guide) -->
    <PaperTexture class="spine-texture">
      <div class="spine-layout-grid legacy-grid">
        <div class="rail-column">
          <div class="wordmark-container">
            <div class="wordmark">{wordmark}</div>
            {#if wordmarkSub}
              <div class="wordmark-sub">{wordmarkSub}</div>
            {/if}
          </div>
        </div>
        <div class="legacy-nav-wrapper">
          <nav aria-label="Sections">
            {#each links as link (link.href)}
              <a href={link.href}>{link.label}</a>
            {/each}
          </nav>
          {#if showControls}
            <div class="spine-controls">
              <HueControl bind:hue />
              <ModeToggle bind:mode />
            </div>
          {/if}
        </div>
      </div>
    </PaperTexture>
  {:else}
    <!-- Case B: Structured App Shell (Editor/Spreadsheet) -->
    <div class="rail-wrapper">
      <PaperTexture class="spine-texture">
        <div class="rail-column">
          {#if rail}
            {@render rail()}
          {/if}
        </div>
      </PaperTexture>
    </div>

    {#if (hasSecondaryPanel || children) && !collapsed}
      <div class="panel-column">
        {#if children}
          {@render children()}
        {/if}
      </div>
    {/if}
  {/if}
</aside>

<style>
  .spine {
    width: 210px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: row;
    transition:
      width var(--t-slow) var(--ease),
      background var(--t-slow) var(--ease);
    z-index: var(--z-sticky);
  }

  .spine.collapsed {
    width: 64px;
  }

  .spine.has-panel {
    width: 274px; /* 64px rail + 210px panel */
  }

  @media (min-width: 761px) {
    .spine {
      width: 232px; /* 210px content + 22px wave */
      margin-right: -22px;
      box-sizing: border-box;

      -webkit-mask-image: linear-gradient(to right, black 0%, black 100%), var(--wave-mask-v);
      -webkit-mask-size: calc(100% - 22px) 100%, 22px 100%;
      -webkit-mask-position: left top, right top;
      -webkit-mask-repeat: no-repeat, no-repeat;
      mask-image: linear-gradient(to right, black 0%, black 100%), var(--wave-mask-v);
      mask-size: calc(100% - 22px) 100%, 22px 100%;
      mask-position: left top, right top;
      mask-repeat: no-repeat, no-repeat;
    }

    .spine.collapsed {
      width: 86px; /* 64px content + 22px wave */
    }

    .spine.has-panel {
      width: 296px; /* 64px rail + 210px panel + 22px wave */
    }

    /* Padding applied to children to prevent content clipping, while extending backgrounds */
    .spine > :global(.spine-texture) {
      padding-right: 22px;
      box-sizing: border-box;
    }

    .spine.collapsed .rail-wrapper {
      width: 100%;
      padding-right: 22px;
      box-sizing: border-box;
    }

    .spine.has-panel .panel-column {
      width: 232px; /* 210px content + 22px wave */
      padding-right: 22px;
      box-sizing: border-box;
    }
  }

  :global(.spine-texture) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
  }

  .spine-layout-grid {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .rail-wrapper {
    width: 64px;
    height: 100%;
    flex-shrink: 0;
  }

  .rail-column {
    width: 64px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 24px 0;
    box-sizing: border-box;
  }

  .panel-column {
    width: 210px;
    height: 100%;
    background: var(--panel);
    display: flex;
    flex-direction: column;
    padding: 32px 16px 24px 20px;
    min-width: 0;
    overflow-y: auto;
    scrollbar-width: none;
    box-sizing: border-box;
    transition: background var(--t-slow) var(--ease);
  }

  .panel-column::-webkit-scrollbar {
    display: none;
  }

  /* Support legacy navigation if no snippets are passed */
  .legacy-nav-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32px 16px 24px 20px;
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
  }

  .legacy-nav-wrapper nav {
    overflow-y: auto;
    scrollbar-width: none;
    flex-shrink: 1;
  }

  .legacy-nav-wrapper nav::-webkit-scrollbar {
    display: none;
  }

  .legacy-nav-wrapper .spine-controls {
    align-items: stretch;
    margin-top: auto;
    padding-top: 24px;
  }

  .wordmark-container {
    padding: 16px 8px;
  }

  .wordmark {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    margin-bottom: 6px;
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  .wordmark-sub {
    font-family: var(--font-body);
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: oklch(94.5% 0.012 95 / 50%);
    display: none;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 13px;
  }

  :global(nav a) {
    color: oklch(94.5% 0.012 95 / 60%);
    text-decoration: none;
    padding: 6px 14px 6px 12px;
    border-radius: 8px 0 0 8px;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
    font-family: var(--font-body);
    display: block;
  }

  :global(nav a:hover),
  :global(nav a:focus-visible) {
    color: var(--text-inverse);
    background: oklch(94.5% 0.012 95 / 8%);
    outline: none;
  }

  :global(nav a:focus-visible) {
    box-shadow: inset 0 0 0 1.5px var(--accent);
  }

  .spine-controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
  }

  @media (max-width: 760px) {
    .spine {
      position: static;
      height: auto;
      width: 100% !important;
      flex-direction: column;
    }

    .spine-layout-grid {
      flex-direction: column;
      height: auto;
    }

    .rail-wrapper {
      width: 100%;
      height: auto;
    }

    .rail-column {
      width: 100%;
      height: auto;
      flex-direction: row;
      padding: 12px 20px;
      border-right: none;
    }

    .panel-column {
      width: 100%;
      height: auto;
      padding: 16px 20px;
    }

    .wordmark {
      writing-mode: horizontal-tb;
      transform: none;
    }

    .spine-controls {
      flex-direction: row;
      width: auto;
    }

    .legacy-nav-wrapper {
      width: 100%;
      height: auto;
      padding: 16px 20px;
    }

    .legacy-nav-wrapper .spine-controls {
      flex-direction: row;
      align-items: center;
      width: auto;
      margin-top: 16px;
      padding-top: 0;
    }
  }
</style>
