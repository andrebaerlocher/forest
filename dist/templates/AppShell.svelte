<script lang="ts">
  import type { Snippet } from 'svelte';
  import Shell from './Shell.svelte';

  interface Props {
    mode?: 'light' | 'dark';
    hue?: number;
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{ href: string; label: string }>;
    showControls?: boolean;
    spineControls?: Snippet;
    header?: Snippet;
    strip?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    mode = $bindable('light'),
    hue = $bindable(282),
    wordmark = 'A Forest',
    wordmarkSub = 'Design system',
    links = [],
    showControls = true,
    spineControls,
    header,
    strip,
    footer,
    children
  }: Props = $props();
</script>

<Shell
  bind:mode
  bind:hue
  {wordmark}
  {wordmarkSub}
  {links}
  {showControls}
  {spineControls}
  {header}
  {strip}
  {footer}
>
  {#if children}
    {@render children()}
  {/if}
</Shell>
