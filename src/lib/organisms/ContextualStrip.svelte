<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label?: string;
    class?: string;
    children?: Snippet;
  }

  let { label = '', class: className = '', children }: Props = $props();
</script>

<div class="contextual-strip {className}">
  {#if label}
    <span class="strip-label">{label}</span>
  {/if}

  {#if children}
    <div class="strip-content">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .contextual-strip {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 24px;
    background: transparent;
    border-bottom: 1px solid var(--line-soft);
    width: 100%;
    gap: 16px;
  }

  .strip-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--text-3);
    user-select: none;
  }

  .strip-content {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 100%;
  }

  /* Support vertical dividers inside strips */
  :global(.strip-content > .divider.vertical) {
    margin: 0 6px;
    height: 16px;
    align-self: center;
  }
  /* Same consequence as StatusBar: a ~45px Input does not fit a 40px strip.
     Height becomes a floor rather than a fixed value so it can grow. */
  @media (pointer: coarse) {
    .contextual-strip {
      height: auto;
      min-height: 56px;
    }
  }
</style>
