import type { Snippet } from 'svelte';
interface Props {
    text: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** ms before the tip appears on hover; focus always shows it immediately */
    delay?: number;
    class?: string;
    children?: Snippet;
}
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
