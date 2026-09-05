import type { Snippet } from 'svelte';
interface Props {
    open: boolean;
    title?: string;
    /**
     * 'sm' is the confirm-dialog width this component was built for. 'lg' is for
     * content that has to be read rather than acknowledged — an expanded system
     * diagram, say — and lets its body scroll instead of overflowing the screen.
     */
    size?: 'sm' | 'lg';
    class?: string;
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
}
declare const Dialog: import("svelte").Component<Props, {}, "">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
