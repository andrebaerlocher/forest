import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'standard' | 'accent';
    children?: Snippet;
}
declare const Tag: import("svelte").Component<Props, {}, "">;
type Tag = ReturnType<typeof Tag>;
export default Tag;
