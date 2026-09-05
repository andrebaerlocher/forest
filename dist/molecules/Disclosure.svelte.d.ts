import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Anchor target and panel-id stem. This is the deep link readers get sent. */
    id: string;
    /** Say what is inside, not what the control does — "anzeigen" belongs to the chevron. */
    label: string;
    /**
     * How much is inside: "13", "9 Stufen". The whole point of a closed
     * disclosure is that a skimmer can tell the substance exists without
     * opening it, and the count is what tells them.
     */
    count?: number | string;
    /** One line under the label, visible in both states. */
    hint?: string;
    open?: boolean;
    /** Initial state. Ignored once the reader (or a matching hash) has decided. */
    startOpen?: boolean;
    class?: string;
    children?: Snippet;
}
declare const Disclosure: import("svelte").Component<Props, {}, "open">;
type Disclosure = ReturnType<typeof Disclosure>;
export default Disclosure;
