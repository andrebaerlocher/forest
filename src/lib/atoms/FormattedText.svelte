<script lang="ts">
  import katex from 'katex';
  import type { HTMLAttributes } from 'svelte/elements';
  import 'katex/dist/katex.min.css';
  import { type InlineToken, parseBlockMarkdown, parseInlineMarkdown } from '../utils/markdown.js';
  import Link from './Link.svelte';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    class?: string;
    block?: boolean; // Render as block element with paragraph support
    lang?: string;
  }

  let { text, class: className = '', block = false, lang = 'de', ...restProps }: Props = $props();

  function renderMath(tex: string): string {
    try {
      return katex.renderToString(tex, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return tex;
    }
  }

  // Parse text into block structure or inline tokens
  let blockTokens = $derived.by(() => {
    if (!block) {
      // Inline mode: treat as single line, ignore paragraph breaks
      return [parseInlineMarkdown(text)];
    }
    // Block mode: parse block-level elements including lists
    return [parseBlockMarkdown(text)];
  });
</script>

{#snippet renderBlockTokens(nodes: InlineToken[])}
  {#each nodes as node, nodeIdx (nodeIdx)}
    {#if node.type === 'paragraph'}
      <p>{@render renderInlineTokens(node.children ?? [])}</p>
    {:else if node.type === 'list'}
      {#if node.ordered}
        <ol>
          {#each node.children ?? [] as item, idx (idx)}
            {#if item.type === 'list-item'}
              <li>{@render renderListItem(item)}</li>
            {/if}
          {/each}
        </ol>
      {:else}
        <ul>
          {#each node.children ?? [] as item, idx (idx)}
            {#if item.type === 'list-item'}
              <li>{@render renderListItem(item)}</li>
            {/if}
          {/each}
        </ul>
      {/if}
    {/if}
  {/each}
{/snippet}

{#snippet renderListItem(item: InlineToken)}
  {@render renderInlineTokens((item.children ?? []).filter((c) => c.type !== 'list'))}
  {#each (item.children ?? []).filter((c) => c.type === 'list') as subList, subIdx (subIdx)}
    {@render renderBlockTokens([subList])}
  {/each}
{/snippet}

{#snippet renderInlineTokens(nodes: InlineToken[])}
  {#each nodes as node, nodeIdx (nodeIdx)}
    {#if node.type === 'text'}
      {node.content}
    {:else if node.type === 'br'}
      <br />
    {:else if node.type === 'strong'}
      <strong>{#if node.children}{@render renderInlineTokens(node.children)}{/if}</strong>
    {:else if node.type === 'em'}
      <em>{#if node.children}{@render renderInlineTokens(node.children)}{/if}</em>
    {:else if node.type === 'code'}
      <code class="inline-code">{node.content}</code>
    {:else if node.type === 'link'}
      <Link href={node.href}>{#if node.children}{@render renderInlineTokens(node.children)}{/if}</Link>
    {:else if node.type === 'math'}
      <span class="math" title={node.content}>{@html renderMath(node.content ?? '')}</span>
    {/if}
  {/each}
{/snippet}

<div class="formatted-text {className}" {lang} {...restProps}>
  {#if block}
    {@render renderBlockTokens(blockTokens[0])}
  {:else}
    {@render renderInlineTokens(blockTokens[0])}
  {/if}
</div>

<style>
  .formatted-text {
    display: contents;
  }

  .formatted-text :global(p) {
    margin: 0 0 0.618em 0;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    -webkit-hyphens: auto;
  }

  .formatted-text :global(p:last-child) {
    margin-bottom: 0;
  }

  .formatted-text :global(ul),
  .formatted-text :global(ol) {
    margin: 0 0 0.618em 1.5em;
    padding: 0;
  }

  .formatted-text :global(li > ul),
  .formatted-text :global(li > ol) {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }

  .formatted-text :global(ul:last-child),
  .formatted-text :global(ol:last-child) {
    margin-bottom: 0;
  }

  .formatted-text :global(li) {
    margin: 0.309em 0;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    -webkit-hyphens: auto;
  }

  .formatted-text :global(strong) {
    font-weight: 700;
    color: var(--text-1);
  }

  .inline-code {
    display: inline;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    overflow-wrap: break-word;
    font-family: var(--font-num);
    font-size: 0.9em;
    background: var(--wash);
    border: 1px solid var(--line-soft);
    border-radius: 4px;
    padding: 1px 4px;
    color: var(--text-1);
  }

  .math {
    display: inline;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    color: var(--accent);
    font-family: var(--font-num);
  }

  .math :global(.katex) {
    font-size: 1.02em;
    color: inherit;
  }
</style>
