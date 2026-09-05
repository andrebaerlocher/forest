import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLQuoteElement> {
    attribution?: Snippet;
    class?: string;
    children?: Snippet;
}
declare const PullQuote: import("svelte").Component<Props, {}, "">;
type PullQuote = ReturnType<typeof PullQuote>;
export default PullQuote;
