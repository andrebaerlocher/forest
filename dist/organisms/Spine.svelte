<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import PaperTexture from '../atoms/PaperTexture.svelte';
  import { isPhone } from '../breakpoints.svelte.js';
  import HueControl from '../molecules/HueControl.svelte';
  import ModeToggle from '../molecules/ModeToggle.svelte';
  import Drawer from './Drawer.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    // Collapsible states
    collapsed?: boolean;
    hasSecondaryPanel?: boolean;

    // Custom snippets
    rail?: Snippet;
    children?: Snippet;
    /**
     * Rail furniture with no home in a phone tab bar — the vertical wordmark,
     * the mode-toggle seal. Rendered at the foot of the rail on desktop;
     * hidden in the bottom bar and re-rendered in the drawer's footer on a
     * phone. Apps with no secondary panel must promote it into AppHeader.
     */
    railFooter?: Snippet;
    /** Phone only: is the secondary panel drawer open? Bindable so Escape
     *  and the scrim reach the trigger's aria-expanded. */
    panelOpen?: boolean;

    // Backwards compatibility legacy props
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{ href: string; label: string }>;
    showControls?: boolean;
    mode?: 'light' | 'dark';
    hue?: number;
    extraControls?: Snippet;
  }

  let {
    collapsed = false,
    hasSecondaryPanel = false,
    rail,
    children,
    railFooter,
    panelOpen = $bindable(false),
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

  const phone = isPhone();

  // Crossing back to desktop closes the drawer deliberately, rather than
  // leaving orphan state behind a display:none trigger.
  $effect(() => {
    if (!phone.current) panelOpen = false;
  });
</script>

<aside
  class="spine {className}"
  class:collapsed
  class:has-panel={hasSecondaryPanel}
  class:app-rail={!!rail}
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
    <!-- Case B: Structured App Shell (Editor/Spreadsheet).
         Rail and panel share ONE sheet of paper — the panel is a veil over the
         same texture, not a second slab butted against it. -->
    <PaperTexture class="spine-texture">
      <div class="spine-layout-grid">
        <div class="rail-column">
          {#if rail}
            {@render rail()}
          {/if}
          {#if railFooter}
            <div class="rail-footer">{@render railFooter()}</div>
          {/if}
        </div>

        {#if (hasSecondaryPanel || children) && !collapsed && !phone.current}
          <div class="panel-column">
            {#if children}
              {@render children()}
            {/if}
          </div>
        {/if}
      </div>
    </PaperTexture>
  {/if}
</aside>

<!-- SIBLING of <aside>, never inside it: .spine.app-rail carries a mask below
     761px, which makes it a containing block for fixed descendants in
     Blink/WebKit. A drawer nested inside would be trapped in the 56px bar. -->
{#if phone.current}
  <!-- A sheet, not a left drawer. Its trigger lives in the bottom bar, and a
       control at the floor that opens a panel from the far edge of the screen
       reads as two unrelated gestures. Rising from the bar it was tapped on
       keeps the movement and the thumb in the same place — and matches the
       case-study outline, which is the only other sheet on a phone. -->
  <Drawer
    open={panelOpen}
    side="bottom"
    height="min(70dvh, 560px)"
    label="Navigation"
    onclose={() => (panelOpen = false)}
  >
    {#if children}
      {@render children()}
    {/if}
    {#if railFooter}
      <div class="drawer-footer">{@render railFooter()}</div>
    {/if}
  </Drawer>
{/if}

<style>
  :global(.spine-texture) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
  }

  .panel-column {
    width: 210px;
    flex-shrink: 0;
    height: 100%;
    /* A veil over the same paper, plus one hairline — not a second slab.
       The old flat var(--panel) fill was the hard seam. */
    background: var(--wash-hover);
    border-left: 1px solid var(--line-soft);
    display: flex;
    flex-direction: column;
    padding: 28px 0 24px 8px;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
    box-sizing: border-box;
    transition: background var(--t-slow) var(--ease);
  }

  .panel-column::-webkit-scrollbar {
    display: none;
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

  /* Reproduces what the demo templates' own .rail-bottom did, so splitting
     the rail snippet in two leaves .rail-column with the same two flex
     children and `justify-content: space-between` resolves identically. */
  .rail-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* The wordmark and mode seal, re-homed at the foot of the phone drawer. */
  .drawer-footer {
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid var(--line-soft);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  /* a wordmark cannot run vertically in a horizontal footer */
  .drawer-footer :global(.wordmark-vertical) {
    writing-mode: horizontal-tb;
    transform: none;
    margin: 0;
  }

  .spine-layout-grid {
    display: flex;
    flex: 1;
    height: 100%;
    width: 100%;
    min-width: 0;
    min-height: 0; /* lets .panel-column scroll internally */
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 13px;
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

  .spine-controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
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
    color: var(--text-3);
    display: none;
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

  :global(nav a:focus-visible) {
    color: var(--text-inverse);
    background: oklch(94.5% 0.012 95 / 8%);
    outline: none;
  }

  /* Gated: a hover that sticks after a tap reads as a state this control
     is not in. */
  @media (hover: hover) {
    :global(nav a:hover) {
      color: var(--text-inverse);
      background: oklch(94.5% 0.012 95 / 8%);
      outline: none;
    }
  }

  :global(nav a:focus-visible) {
    box-shadow: inset 0 0 0 1.5px var(--accent);
  }

  .spine {
    width: 210px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100dvh;
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

    /* The 22px wave inset is carried by exactly one element per case, or the
       content gets pushed under the mask twice. With a panel it belongs to the
       panel, so its veil and hairline extend into the wave. */
    .spine:not(.has-panel) > :global(.spine-texture) {
      padding-right: 22px;
      box-sizing: border-box;
    }

    .spine.has-panel .panel-column {
      width: 232px; /* 210px content + 22px wave */
      padding-right: 22px;
      box-sizing: border-box;
    }
  }

  @media (max-width: 760px) {
    /* ── Case A / documentation spines: today's stacking, untouched.
       A wordmark plus a column of text links is not a tab bar. ── */
    .spine:not(.app-rail) {
      position: static;
      height: auto;
      width: 100% !important;
      flex-direction: column;
    }

    .spine:not(.app-rail) .rail-column {
      width: 100%;
      height: auto;
      flex-direction: row;
      padding: 12px 20px;
      border-right: none;
    }

    .spine:not(.app-rail) .panel-column {
      width: 100%;
      height: auto;
      padding: 16px 20px;
      border-left: none;
      border-top: 1px solid var(--line-soft);
    }

    .spine-layout-grid {
      flex-direction: column;
      height: auto;
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

    /* ── Structured app rails: the spine stops being a column of the page
       and becomes two separate objects — a bar at the thumb, and a drawer
       that is not here. ── */
    .spine.app-rail {
      position: fixed;
      inset: auto 0 0 0;
      width: 100% !important;
      height: auto;
      margin-right: 0;
      z-index: var(--z-sticky);

      /* geometry never animates across the breakpoint; the base rule
         transitions width, and a persistent surface does not slide */
      transition: background var(--t-slow) var(--ease);

      /* ONE wave per persistent surface. The desktop right-edge wave does
         not exist below 761px, so the bar carries its own — on top, where
         the paper meets the canvas. */
      -webkit-mask-image: linear-gradient(to top, black 0%, black 100%),
        var(--wave-mask-h-flipped);
      -webkit-mask-size: 100% calc(100% - 10px), 100% 10px;
      -webkit-mask-position: left bottom, left top;
      -webkit-mask-repeat: no-repeat, no-repeat;
      mask-image: linear-gradient(to top, black 0%, black 100%),
        var(--wave-mask-h-flipped);
      mask-size: 100% calc(100% - 10px), 100% 10px;
      mask-position: left bottom, left top;
      mask-repeat: no-repeat, no-repeat;
    }

    /* The panel is not a column on a phone; it is the drawer. display:none
       also covers the single frame before `phone` flips, so nothing flashes. */
    .spine.app-rail .panel-column {
      display: none;
    }

    .spine.app-rail .rail-column {
      width: 100%;
      height: auto;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      /* 10px of the top padding is eaten by the wave */
      padding: 16px 8px calc(6px + env(safe-area-inset-bottom, 0px));
      min-height: calc(var(--bar-phone-h) + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
      border-right: none;
    }

    .spine.app-rail .rail-column::-webkit-scrollbar {
      display: none;
    }

    /* A wordmark is a spine device — text running up a 64px column, and a
       56px bar has no vertical run. A mode toggle is a setting, and a tab
       bar holds destinations. Both move to the drawer footer. */
    .spine.app-rail .rail-footer {
      display: none;
    }
  }
</style>
