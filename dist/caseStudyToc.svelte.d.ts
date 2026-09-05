import type { TocEntry } from "./domain.js";
export interface TocRegistry {
    /** Registered entries, in document order. */
    readonly entries: TocEntry[];
    /** Register an anchored section; call the returned function to remove it. */
    register(entry: TocEntry, node: HTMLElement): () => void;
}
export declare function createTocRegistry(): TocRegistry;
export declare function provideTocRegistry(registry: TocRegistry): void;
/** The enclosing shell's registry, or undefined when used standalone. */
export declare function useTocRegistry(): TocRegistry | undefined;
