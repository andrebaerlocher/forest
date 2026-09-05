import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { MetricItem, TocEntry } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    tags?: string[];
    metrics?: MetricItem[];
    /**
     * An explicit outline. Omit it and the shell collects one from the
     * Section / DeepDive / DecisionRecord components mounted inside it —
     * convenient, but client-only, since children render after their parent.
     * Pass this when the outline must be server-rendered.
     */
    toc?: TocEntry[];
    tocTitle?: string;
    heroVisualization?: Snippet;
    /**
     * Masthead facts — roles, timeline, team. Belongs in the header rather
     * than at the top of the article: the header is full-bleed while the
     * article is indented into the numbering gutter, so meta rendered as
     * children lands on the body's left edge and reads as a stray indent
     * rather than as part of the masthead.
     */
    meta?: Snippet;
    class?: string;
    children?: Snippet;
}
declare const CaseStudyShell: import("svelte").Component<Props, {}, "">;
type CaseStudyShell = ReturnType<typeof CaseStudyShell>;
export default CaseStudyShell;
