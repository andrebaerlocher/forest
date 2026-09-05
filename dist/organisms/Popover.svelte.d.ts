import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type AnchoredPlacement } from '../actions/anchored.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Bindable. */
    open?: boolean;
    anchor?: HTMLElement | null;
    placement?: AnchoredPlacement;
    offset?: number;
    matchWidth?: boolean;
    /** Accessible name for the surface. */
    label?: string;
    /** Trap Tab inside the surface. Default false — a popover is non-modal. */
    modal?: boolean;
    onclose?: () => void;
    class?: string;
    children?: Snippet;
}
declare const Popover: import("svelte").Component<Props, {}, "open">;
type Popover = ReturnType<typeof Popover>;
export default Popover;
