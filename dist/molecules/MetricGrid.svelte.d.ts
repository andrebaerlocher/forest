import type { HTMLAttributes } from 'svelte/elements';
import type { MetricItem } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    metrics: MetricItem[];
    class?: string;
}
declare const MetricGrid: import("svelte").Component<Props, {}, "">;
type MetricGrid = ReturnType<typeof MetricGrid>;
export default MetricGrid;
