import type { ComponentProps } from 'svelte';
import type { MetricItem } from '../domain.js';
import { type HeadingLevel } from '../headingLevel.js';
import Slip from './Slip.svelte';
/**
 * `...restProps` is forwarded to `<Slip>`, a component, not a raw DOM
 * element — so it extends Slip's own Props rather than an independent
 * `HTMLAttributes<HTMLDivElement>`. Two unrelated large structural types
 * (this one and Slip's) meeting at a `{...spread}` call site make the
 * type checker choke ("union type too complex to represent"); extending
 * the exact type the spread target expects avoids that entirely.
 */
interface Props extends Omit<ComponentProps<typeof Slip>, 'children' | 'fluid' | 'class'> {
    title: string;
    href: string;
    standfirst?: string;
    tags?: string[];
    /** A single headline number. The index stays restrained on purpose. */
    metric?: MetricItem;
    level?: HeadingLevel;
    class?: string;
}
declare const CaseStudyCard: import("svelte").Component<Props, {}, "">;
type CaseStudyCard = ReturnType<typeof CaseStudyCard>;
export default CaseStudyCard;
