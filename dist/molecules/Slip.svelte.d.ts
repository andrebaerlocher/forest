import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
    dragging?: boolean;
    /** Drop the default 260px cap — for slips that fill a grid cell. */
    fluid?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
}
declare const Slip: import("svelte").Component<Props, {}, "">;
type Slip = ReturnType<typeof Slip>;
export default Slip;
