import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    message?: string;
    open: boolean;
    status?: 'neutral' | 'success' | 'warning' | 'danger';
    /**
     * Position itself in the corner. Set false inside a ToastRegion, which
     * owns the positioning for the whole stack.
     */
    standalone?: boolean;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
}
declare const Toast: import("svelte").Component<Props, {}, "">;
type Toast = ReturnType<typeof Toast>;
export default Toast;
