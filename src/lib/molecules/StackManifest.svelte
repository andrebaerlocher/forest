<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Tag from '../atoms/Tag.svelte';
  import type { TechStackGroup } from '../domain.js';

  interface Props extends HTMLAttributes<HTMLDListElement> {
    groups: TechStackGroup[];
    class?: string;
  }

  let { groups, class: className = '', ...restProps }: Props = $props();
</script>

<dl class="stack-manifest {className}" {...restProps}>
  {#each groups as group (group.category)}
    <dt class="category">{group.category}</dt>
    <dd class="items">
      <div class="tags-row">
        {#each group.items as item (item)}
          <Tag variant="standard">{item}</Tag>
        {/each}
      </div>
      {#if group.constraint}
        <div class="constraint">{group.constraint}</div>
      {/if}
    </dd>
  {/each}
</dl>

<style>
  .stack-manifest {
    display: grid;
    grid-template-columns: minmax(120px, 160px) 1fr;
    gap: 16px;
    margin: 0;
  }

  .category {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-3);
    font-weight: 600;
    margin: 0;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
  }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .constraint {
    font-family: var(--font-num);
    font-size: 12px;
    color: var(--text-2);
  }

  @media (max-width: 600px) {
    .stack-manifest {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category {
      margin-bottom: -4px;
    }
  }
</style>
