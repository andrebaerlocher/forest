import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
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
declare const CodeBlock: import("svelte").Component<Props, {}, "">;
type CodeBlock = ReturnType<typeof CodeBlock>;
export default CodeBlock;
