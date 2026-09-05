<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    stats?: Snippet;
    content?: Snippet;
  }

  let { class: className = '', stats, content }: Props = $props();
</script>

<div class="dashboard-layout {className}">
  {#if stats}
    <div class="stats-grid">
      {@render stats()}
    </div>
  {/if}

  {#if content}
    <div class="content-area">
      {@render content()}
    </div>
  {/if}
</div>

<style>
  .dashboard-layout {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    width: 100%;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    width: 100%;
  }

  .content-area {
    width: 100%;
  }
</style>
