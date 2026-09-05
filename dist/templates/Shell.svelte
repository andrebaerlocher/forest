<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import EmbossedContours from '../atoms/EmbossedContours.svelte';
  import Spine from '../organisms/Spine.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{ href: string; label: string }>;
    showControls?: boolean;
    mode?: 'light' | 'dark';
    hue?: number;
    spineControls?: Snippet;
    header?: Snippet;
    strip?: Snippet;
    footer?: Snippet;
    children?: Snippet;
    collapsed?: boolean;
    hasSecondaryPanel?: boolean;
    rail?: Snippet;
    spineChildren?: Snippet;
    /** Rail furniture that has no home in the phone tab bar — see Spine. */
    railFooter?: Snippet;
    /** Phone only: is the secondary panel drawer open? Bindable so Escape
     *  and the scrim inside Spine reach the app's header trigger. */
    panelOpen?: boolean;
  }

  let {
    wordmark = 'A Forest',
    wordmarkSub = 'Design system',
    links = [],
    showControls = true,
    mode = $bindable('light'),
    hue = $bindable(282),
    spineControls,
    header,
    strip,
    footer,
    children,
    collapsed = false,
    hasSecondaryPanel = false,
    rail,
    spineChildren,
    railFooter,
    panelOpen = $bindable(false),
    ...restProps
  }: Props = $props();
</script>

<!-- `has-rail` is what tells the rest of the tree a fixed phone bar exists.
     Spine derives its own app-rail class from the same `rail` snippet, so the
     two agree by construction rather than by convention. -->
<div
  class="shell"
  class:app-layout={header || footer || strip}
  class:has-rail={!!rail}
  {...restProps}
>
  <Spine
    {wordmark}
    {wordmarkSub}
    {links}
    {showControls}
    bind:mode
    bind:hue
    extraControls={spineControls}
    {collapsed}
    {hasSecondaryPanel}
    {rail}
    {railFooter}
    bind:panelOpen
  >
    {#if spineChildren}
      {@render spineChildren()}
    {/if}
  </Spine>

  <EmbossedContours class="main-contours">
    <div class="canvas-stack">
      {#if header}
        {@render header()}
      {/if}
      {#if strip}
        {@render strip()}
      {/if}
      <main class="main" class:no-pad={header || footer || strip}>
        {#if children}
          {@render children()}
        {/if}
      </main>
      {#if footer}
        {@render footer()}
      {/if}
    </div>
  </EmbossedContours>
</div>

<style>
  .shell {
    display: flex;
    min-height: 100dvh;
  }

  .shell.app-layout {
    height: 100dvh;
    overflow: hidden;
  }

  :global(.main-contours) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .shell.app-layout :global(.main-contours) {
    height: 100dvh;
    min-height: 0;
  }

  .canvas-stack {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    width: 100%;
  }

  .shell.app-layout .canvas-stack {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
  }

  .main {
    flex: 1;
    padding: 48px clamp(24px, 6vw, 88px) 96px;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    /* Establishes a query context for descendants (e.g. CaseStudyShell) whose
       breakpoints depend on their own available width, not the viewport — the
       Spine rail's collapsed/expanded swing makes the viewport width alone an
       unreliable signal. */
    container-type: inline-size;
  }

  .main.no-pad {
    padding: 0;
    max-width: none;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
    display: flex;
    flex-direction: column;
  }

  .main.no-pad::-webkit-scrollbar {
    width: 8px;
  }

  .main.no-pad::-webkit-scrollbar-track {
    background: transparent;
  }

  .main.no-pad::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  @media (max-width: 760px) {
    .shell {
      flex-direction: column;
    }

    /* Only an app rail becomes a fixed bar. A documentation spine stacks in
       flow below the content and needs no clearance — reserving 56px for it
       would leave a dead band at the foot of every specimen page. */
    .shell.has-rail {
      --bar-phone: var(--bar-phone-h);
    }

    /* The app rail is a fixed bar overlaying the canvas below this width;
       reserve its height plus the safe area so the last screenful stays
       reachable. */
    .main {
      padding-bottom: calc(96px + var(--bar-phone) + env(safe-area-inset-bottom, 0px));
    }

    /* In app-layout .main is the scroller but StatusBar is a sibling BELOW
       it, so the clearance belongs to the stack, not the scroller, or the
       footer hides under the bar. `* { box-sizing: border-box }` makes this
       shrink the 100dvh content box rather than overflow it. */
    .shell.app-layout .canvas-stack {
      padding-bottom: calc(var(--bar-phone) + env(safe-area-inset-bottom, 0px));
    }

    .shell.app-layout .main.no-pad {
      padding-bottom: 0;
    }
  }
</style>
