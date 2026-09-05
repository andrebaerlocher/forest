import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
    tone?: 'neutral' | 'info' | 'warning' | 'success';
    label?: string;
    class?: string;
    children?: Snippet;
}
declare const Callout: import("svelte").Component<Props, {}, "">;
type Callout = ReturnType<typeof Callout>;
export default Callout;
