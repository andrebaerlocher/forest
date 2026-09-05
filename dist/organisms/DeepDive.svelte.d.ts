import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TocEntry } from '../domain.js';
import { type HeadingLevel } from '../headingLevel.js';
interface Props extends HTMLAttributes<HTMLElement> {
    /** Anchor target. This is the deep link readers will be sent. */
    id: string;
    title: string;
    /** One or two sentences on what this module does and why it is here. */
    summary?: string;
    /**
     * Anchors inside this module. Rendered as a jump list when 2 or more.
     * Omit it and the list is collected from the Section components mounted
     * inside this DeepDive — pass this only when the list must be
     * server-rendered, or to override what auto-collects.
     */
    subsections?: TocEntry[];
    /** Overrides the level inherited from the enclosing container. */
    level?: HeadingLevel;
    /** Label above the title. Set '' to drop it. */
    eyebrow?: string;
    /** Keep this module out of the enclosing shell's table of contents. */
    unlisted?: boolean;
    class?: string;
    showLinks?: boolean;
    children?: Snippet;
    sectionNumber?: number;
    diveNumber?: number;
}
declare const DeepDive: import("svelte").Component<Props, {}, "">;
type DeepDive = ReturnType<typeof DeepDive>;
export default DeepDive;
