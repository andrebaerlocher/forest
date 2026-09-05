export interface ScrollspyOptions {
    /** Element ids to watch, in document order. */
    ids: string[];
    /** Called with the id of the section currently being read, or null. */
    onchange: (activeId: string | null) => void;
    /**
     * Band of the viewport that counts as "being read". The default ignores the
     * top tenth and the bottom seventy percent, so the active entry advances when
     * a heading reaches the upper third rather than the instant it peeks in.
     */
    rootMargin?: string;
}
/**
 * Tracks which anchored section the reader is currently in.
 *
 * Actions never run during SSR, so the table of contents renders with no active
 * entry on the server and gains one on the first observer callback. That is the
 * house rule from `breakpoints.svelte.ts` applied here: CSS owns the first
 * frame's appearance, JS only refines it afterwards.
 *
 * Usage: <nav use:scrollspy={{ ids, onchange: (id) => (activeId = id) }}>
 */
export declare function scrollspy(node: HTMLElement, options: ScrollspyOptions): {
    update(next: ScrollspyOptions): void;
    destroy(): void;
};
