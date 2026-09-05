import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
interface Props extends HTMLAnchorAttributes {
    href?: string;
    class?: string;
    children?: Snippet;
}
declare const Link: import("svelte").Component<Props, {}, "">;
type Link = ReturnType<typeof Link>;
export default Link;
