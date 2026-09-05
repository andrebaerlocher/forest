import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLElement> {
    id: string;
    caption: string;
    /** Rendered as "Fig. N". */
    number?: string | number;
    /** Diagram is wider than the reading column — lets oversized content scroll rather than squash. */
    wide?: boolean;
    /** Defaults to `wide`. An explicit `zoomable={false}` still wins over `wide`. */
    zoomable?: boolean;
    class?: string;
    /** The diagram markup. Rendered once in the frame, and again (same snippet) inside the zoom dialog. */
    children?: Snippet;
}
declare const Figure: import("svelte").Component<Props, {}, "">;
type Figure = ReturnType<typeof Figure>;
export default Figure;
