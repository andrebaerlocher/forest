import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Stacking level the scrim sits just below */
    level?: 'drawer' | 'palette' | 'toast';
    onclick?: () => void;
    class?: string;
}
declare const Scrim: import("svelte").Component<Props, {}, "">;
type Scrim = ReturnType<typeof Scrim>;
export default Scrim;
