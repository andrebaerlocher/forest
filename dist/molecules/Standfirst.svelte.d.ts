import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLParagraphElement> {
    class?: string;
    children?: Snippet;
}
declare const Standfirst: import("svelte").Component<Props, {}, "">;
type Standfirst = ReturnType<typeof Standfirst>;
export default Standfirst;
