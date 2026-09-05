<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Optional section label, e.g. a date group heading */
    label?: string;
    class?: string;
    children?: Snippet;
  }

  let { label = '', class: className = '', children }: Props = $props();
</script>

<section class="timeline {className}">
  {#if label}
    <div class="timeline-label">{label}</div>
  {/if}
  <div class="timeline-rail">
    {#if children}
      {@render children()}
    {/if}
  </div>
</section>

<style>
  .timeline {
    font-family: var(--font-body);
  }

  .timeline-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 8px;
  }

  /* One hairline down the left, entries hang off it. Horizontal rules between
     entries would compete with the rail, so entries are separated by space. */
  .timeline-rail {
    position: relative;
    padding-left: 20px;
  }

  .timeline-rail::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: var(--line-soft);
  }
</style>
