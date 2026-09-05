<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { toaster } from '../stores/toaster.svelte.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    filename?: string;
    language?: string;
    /** Raw source, rendered as plain escaped text. */
    code?: string;
    /**
     * Syntax-highlighted output from the consuming app's own build-time
     * highlighter, supplied as a snippet.
     *
     * Deliberately a Snippet and not an HTML string: a published component must
     * never be a channel for raw markup, however well-intentioned the caller.
     * Whoever holds the highlighter's output decides how to render it, and any
     * `{@html}` risk stays visible in the app that actually took it on.
     *
     * Rendered whole — the per-line gutter cannot split arbitrary markup on
     * newlines, so `lineNumbers`/`highlightLines` do not apply here.
     */
    highlighted?: Snippet;
    lineNumbers?: boolean;
    highlightLines?: number[];
    startLine?: number;
    copyable?: boolean;
    /** Accessible label when there is no filename. */
    label?: string;
    class?: string;
  }

  let {
    filename,
    language,
    code,
    highlighted,
    lineNumbers = false,
    highlightLines,
    startLine = 1,
    copyable = true,
    label,
    class: className = '',
    ...restProps
  }: Props = $props();

  let showHeader = $derived(!!filename || !!language || copyable);
  let regionLabel = $derived(filename || label || 'Code');

  // The per-line gutter only ever applies to the plain-text `code` path.
  let showLines = $derived(
    highlighted === undefined &&
      code !== undefined &&
      (lineNumbers || (highlightLines?.length ?? 0) > 0)
  );
  let codeLines = $derived(showLines ? (code as string).split('\n') : []);

  async function handleCopy() {
    if (code === undefined) return;
    try {
      await navigator.clipboard.writeText(code);
      toaster.success('Copied to clipboard');
    } catch {
      toaster.danger('Could not copy code to clipboard');
    }
  }
</script>

<div class="cs-codeblock {className}" {...restProps}>
  {#if showHeader}
    <div class="cs-codeblock-header">
      <span class="cs-codeblock-filename">{filename}</span>
      <div class="cs-codeblock-meta">
        {#if language}<span class="cs-codeblock-lang">{language}</span>{/if}
        {#if copyable && code !== undefined}
          <button type="button" class="cs-codeblock-copy" aria-label="Copy code" onclick={handleCopy}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- The rule assumes tabindex on a non-interactive element is a mistake. Here
       it is the fix: WCAG 2.1.1 requires a region that scrolls to be operable
       by keyboard, and a long line of code is unreadable without it. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre class="cs-codeblock-pre" tabindex="0" role="region" aria-label={regionLabel}><code class="cs-codeblock-code">{#if highlighted}{@render highlighted()}{:else if showLines}{#each codeLines as line, i (i)}<span class="cs-code-line" class:hl={highlightLines?.includes(startLine + i)}><span class="cs-code-num">{startLine + i}</span><span class="cs-code-text">{line}</span></span>{/each}{:else}{code}{/if}</code></pre>
</div>

<style>
  .cs-codeblock {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    overflow: hidden;
  }

  .cs-codeblock-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    background: var(--raised);
    border-bottom: 1px solid var(--line-mid);
  }

  .cs-codeblock-filename {
    font-family: var(--font-num);
    font-size: 12px;
    color: var(--text-2);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cs-codeblock-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .cs-codeblock-lang {
    font-family: var(--font-num);
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .cs-codeblock-copy {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    color: var(--text-2);
    border: 1.5px solid transparent;
    border-radius: var(--radius-s);
    cursor: pointer;
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }

  @media (hover: hover) {
    .cs-codeblock-copy:hover {
      color: var(--text-1);
      background: var(--wash);
      border-color: var(--line-mid);
    }
  }

  .cs-codeblock-copy:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 1px;
  }

  /* Dark code surface — a deliberate, sanctioned exception. Code stays on ink
     in both themes, the same pair of literals the library's other on-ink
     surfaces use, so every derived value below is an alpha or color-mix of
     those two rather than a new hardcoded colour. */
  .cs-codeblock-pre {
    margin: 0;
    padding: 14px 16px;
    background: oklch(19% 0.045 var(--hue));
    color: oklch(94.5% 0.012 95);
    font-family: var(--font-num);
    font-size: 12.5px;
    line-height: 1.6;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .cs-codeblock-pre::-webkit-scrollbar {
    height: 8px;
  }

  .cs-codeblock-pre::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .cs-codeblock-pre:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: -1.5px;
  }

  .cs-codeblock-code {
    font: inherit;
  }

  .cs-code-line {
    display: flex;
    /* Transparent-border box model: the highlighted state adds a border, so
       giving every row the same border up front keeps nothing from shifting. */
    border-left: 3px solid transparent;
  }

  .cs-code-line.hl {
    background: color-mix(in oklch, var(--accent), transparent 88%);
    border-left-color: var(--accent);
  }

  .cs-code-num {
    flex-shrink: 0;
    min-width: 2.4em;
    padding-right: 14px;
    text-align: right;
    user-select: none;
    color: color-mix(in oklch, oklch(94.5% 0.012 95), transparent 55%);
  }

  .cs-code-text {
    white-space: pre;
  }
</style>
