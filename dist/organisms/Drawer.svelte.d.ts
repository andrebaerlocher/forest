import { type Snippet } from 'svelte';
interface Props {
    open: boolean;
    /**
     * Which edge the drawer is anchored to. `bottom` is the thumb-reachable
     * sheet: on a phone the top of the screen is the farthest point from the
     * hand, so a tall list of destinations belongs at the bottom.
     */
    side?: 'left' | 'right' | 'bottom';
    /** Any CSS length. Side drawers only. */
    width?: string;
    /** Any CSS length. Bottom sheets only — capped so the page stays visible. */
    height?: string;
    /** Accessible name. role="dialog" + aria-modal requires one. */
    label?: string;
    class?: string;
    onclose?: () => void;
    children?: Snippet;
}
declare const Drawer: import("svelte").Component<Props, {}, "">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
