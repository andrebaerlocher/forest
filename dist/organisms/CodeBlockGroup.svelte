<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { CodeFile } from '../domain.js';
  import Tabs from '../molecules/Tabs.svelte';
  import CodeBlock from './CodeBlock.svelte';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    files: CodeFile[];
    /** Bindable id of the visible file. */
    activeId?: string;
    class?: string;
  }

  let {
    files = [],
    activeId = $bindable(files[0]?.id),
    class: className = '',
    ...restProps
  }: Props = $props();

  let tabItems = $derived(files.map((f) => ({ id: f.id, label: f.filename })));
  let activeFile = $derived(files.find((f) => f.id === activeId) ?? files[0]);
</script>

{#if files.length > 0}
  <div class="cs-codeblockgroup {className}" {...restProps}>
    {#if files.length > 1}
      <Tabs items={tabItems} bind:activeId />
    {/if}
    <!-- Fields are passed explicitly rather than spread: CodeFile carries an
         `id` that would otherwise land on the root as a DOM id and collide
         with the anchors around it. -->
    {#if activeFile}
      <CodeBlock
        filename={activeFile.filename}
        language={activeFile.language}
        code={activeFile.code}
        lineNumbers={activeFile.lineNumbers}
        highlightLines={activeFile.highlightLines}
        startLine={activeFile.startLine}
      />
    {/if}
  </div>
{/if}

<style>
  .cs-codeblockgroup {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
