import type { HTMLAttributes } from 'svelte/elements';
import type { TocEntry } from '../domain.js';
interface Props extends HTMLAttributes<HTMLElement> {
    entries: TocEntry[];
    /** Section currently being read. Drives aria-current. */
    activeId?: string | null;
    /** Progress through the article, 0–100. Omit to hide the rail. */
    progress?: number;
    /** Accessible name for the nav landmark. */
    label?: string;
    /** Visible heading above the list. Set '' to hide it. */
    title?: string;
    /** Fires after a link is followed — lets a drawer close itself. */
    onnavigate?: (id: string) => void;
    /**
     * Pin the progress rail and the title to the top of the scroller.
     * For the phone sheet, where the outline is longer than the sheet is
     * tall: without it the one thing telling you how far through you are
     * scrolls away on the first flick. Off on the desktop rail, which is
     * short enough to sit still.
     */
    stickyHead?: boolean;
    class?: string;
}
declare const TableOfContents: import("svelte").Component<Props, {}, "">;
type TableOfContents = ReturnType<typeof TableOfContents>;
export default TableOfContents;
