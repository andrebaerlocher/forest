import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** The wordmark text. Ignored when `children` is given. */
    text?: string;
    class?: string;
    children?: Snippet;
}
declare const Wordmark: import("svelte").Component<Props, {}, "">;
type Wordmark = ReturnType<typeof Wordmark>;
export default Wordmark;
