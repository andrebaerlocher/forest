import { type Toaster } from '../stores/toaster.svelte.js';
interface Props {
    /** Defaults to the shared stack; pass your own for an isolated region. */
    toaster?: Toaster;
    placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    class?: string;
}
declare const ToastRegion: import("svelte").Component<Props, {}, "">;
type ToastRegion = ReturnType<typeof ToastRegion>;
export default ToastRegion;
