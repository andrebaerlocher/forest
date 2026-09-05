import type { Snippet } from 'svelte';
interface Props {
    mode?: 'light' | 'dark';
    hue?: number;
    wordmark?: string;
    wordmarkSub?: string;
    links?: Array<{
        href: string;
        label: string;
    }>;
    showControls?: boolean;
    spineControls?: Snippet;
    header?: Snippet;
    strip?: Snippet;
    footer?: Snippet;
    children?: Snippet;
}
declare const AppShell: import("svelte").Component<Props, {}, "hue" | "mode">;
type AppShell = ReturnType<typeof AppShell>;
export default AppShell;
