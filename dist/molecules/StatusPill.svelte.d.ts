import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    status?: 'neutral' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'dashed' | 'strong';
    label?: string;
    /** Hide the dot and set the label in status ink alone */
    bare?: boolean;
    class?: string;
    children?: Snippet;
}
declare const StatusPill: import("svelte").Component<Props, {}, "">;
type StatusPill = ReturnType<typeof StatusPill>;
export default StatusPill;
