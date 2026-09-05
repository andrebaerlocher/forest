import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
    collapsed?: boolean;
    hasSecondaryPanel?: boolean;
    rail?: Snippet;
    children?: Snippet;
    /**
     * Rail furniture with no home in a phone tab bar — the vertical wordmark,
     * the mode-toggle seal. Rendered at the foot of the rail on desktop;
     * hidden in the bottom bar and re-rendered in the drawer's footer on a
     * phone. Apps with no secondary panel must promote it into AppHeader.
     */
    railFooter?: Snippet;
    /** Phone only: is the secondary panel drawer open? Bindable so Escape
     *  and the scrim reach the trigger's aria-expanded. */
    panelOpen?: boolean;
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{
        href: string;
        label: string;
    }>;
    showControls?: boolean;
    mode?: 'light' | 'dark';
    hue?: number;
    extraControls?: Snippet;
}
declare const Spine: import("svelte").Component<Props, {}, "hue" | "mode" | "panelOpen">;
type Spine = ReturnType<typeof Spine>;
export default Spine;
