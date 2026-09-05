import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{
        href: string;
        label: string;
    }>;
    showControls?: boolean;
    mode?: 'light' | 'dark';
    hue?: number;
    spineControls?: Snippet;
    header?: Snippet;
    strip?: Snippet;
    footer?: Snippet;
    children?: Snippet;
    collapsed?: boolean;
    hasSecondaryPanel?: boolean;
    rail?: Snippet;
    spineChildren?: Snippet;
    /** Rail furniture that has no home in the phone tab bar — see Spine. */
    railFooter?: Snippet;
    /** Phone only: is the secondary panel drawer open? Bindable so Escape
     *  and the scrim inside Spine reach the app's header trigger. */
    panelOpen?: boolean;
}
declare const Shell: import("svelte").Component<Props, {}, "hue" | "mode" | "panelOpen">;
type Shell = ReturnType<typeof Shell>;
export default Shell;
