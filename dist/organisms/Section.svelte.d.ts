import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import { type HeadingLevel } from '../headingLevel.js';
interface Props extends HTMLAttributes<HTMLElement> {
    /** Anchor target. Must be unique in the document — it is the deep link. */
    id: string;
    title: string;
    /** A section marker, e.g. "01". Rendered in the numeric face. */
    number?: string | number;
    /** Overrides the level inherited from the enclosing container. */
    level?: HeadingLevel;
    /** Keep this section out of the enclosing shell's table of contents. */
    unlisted?: boolean;
    class?: string;
    children?: Snippet;
    startsClosed?: boolean;
    canCollapse?: boolean;
}
declare const Section: import("svelte").Component<Props, {}, "">;
type Section = ReturnType<typeof Section>;
export default Section;
