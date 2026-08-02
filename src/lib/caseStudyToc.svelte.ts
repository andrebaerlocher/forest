/**
 * Table-of-contents registry — the channel anchored sections use to announce
 * themselves to the shell above them.
 *
 * A long-form case study is authored as markup, not as a data blob, so the
 * shell cannot know its own outline up front. Section / DeepDive / DecisionRecord
 * register on mount and the shell renders whatever registered.
 *
 * The registry is optional by design: every anchored component works standalone
 * (it just has nobody to report to), and `CaseStudyShell` accepts an explicit
 * `toc` prop for consumers who want the outline server-rendered.
 */
import { getContext, setContext } from "svelte";
import type { TocEntry } from "./domain.js";

const TOC_KEY = Symbol("forest.case-study.toc");

interface Registration {
  entry: TocEntry;
  node: HTMLElement;
}

export interface TocRegistry {
  /** Registered entries, in document order. */
  readonly entries: TocEntry[];
  /** Register an anchored section; call the returned function to remove it. */
  register(entry: TocEntry, node: HTMLElement): () => void;
}

export function createTocRegistry(): TocRegistry {
  const items = $state<Registration[]>([]);

  return {
    get entries() {
      // Sort by document position rather than trusting registration order:
      // Svelte makes no promise about the order sibling effects fire in, and a
      // DeepDive's nested Sections register whenever their own effect runs.
      return [...items]
        .sort((a, b) =>
          a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        )
        .map((registration) => registration.entry);
    },
    register(entry, node) {
      items.push({ entry, node });
      return () => {
        const index = items.findIndex((r) => r.entry.id === entry.id);
        if (index !== -1) items.splice(index, 1);
      };
    },
  };
}

export function provideTocRegistry(registry: TocRegistry): void {
  setContext(TOC_KEY, registry);
}

/** The enclosing shell's registry, or undefined when used standalone. */
export function useTocRegistry(): TocRegistry | undefined {
  return getContext<TocRegistry | undefined>(TOC_KEY);
}
