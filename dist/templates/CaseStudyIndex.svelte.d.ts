import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { CaseStudySummaryData } from '../domain.js';
import { type HeadingLevel } from '../headingLevel.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    studies: CaseStudySummaryData[];
    /** Heading level for the cards. The page owns its <h1>, so default <h2>. */
    cardLevel?: HeadingLevel;
    /** Accessible name for the list. */
    label?: string;
    class?: string;
    /** Intro copy rendered above the grid. */
    children?: Snippet;
}
declare const CaseStudyIndex: import("svelte").Component<Props, {}, "">;
type CaseStudyIndex = ReturnType<typeof CaseStudyIndex>;
export default CaseStudyIndex;
