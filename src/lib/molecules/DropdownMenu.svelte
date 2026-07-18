<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fly } from 'svelte/transition';

  interface Props {
    open: boolean;
    class?: string;
    children?: Snippet;
  }

  let { open = false, class: className = '', children }: Props = $props();
</script>

{#if open}
  <div
    class="dropdown-menu {className}"
    transition:fly={{ y: 8, duration: 150 }}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
{/if}

<style>
  .dropdown-menu {
    position: absolute;
    z-index: var(--z-palette);
    background: var(--raised);
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    box-shadow: var(--shadow-drag); /* drops a clean elevation shadow while active */
    min-width: 180px;
    padding: 6px;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :global(.dropdown-menu button),
  :global(.dropdown-menu a) {
    background: transparent;
    border: none;
    border-radius: var(--radius-s);
    padding: 6px 12px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--text-2);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    display: block;
    width: 100%;
    transition:
      background var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  :global(.dropdown-menu button:hover),
  :global(.dropdown-menu a:hover) {
    background: var(--wash);
    color: var(--text-1);
  }

  :global(.dropdown-menu button:focus-visible),
  :global(.dropdown-menu a:focus-visible) {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }
</style>
