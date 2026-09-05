import type { Snippet } from 'svelte';
interface Props {
    title?: string;
    /**
     * Phone only: whether the Drawer copy is open. Bindable so a close
     * button, Escape, or the scrim can reach the caller's trigger state.
     * Ignored on desktop, where the panel is inline and always present —
     * matching the previous, always-visible behaviour of this component.
     */
    open?: boolean;
    onclose?: () => void;
    class?: string;
    children?: Snippet;
}
declare const DetailPanel: import("svelte").Component<Props, {}, "open">;
type DetailPanel = ReturnType<typeof DetailPanel>;
export default DetailPanel;
