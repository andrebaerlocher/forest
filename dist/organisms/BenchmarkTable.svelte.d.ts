import type { HTMLAttributes } from 'svelte/elements';
import type { BenchmarkRow } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    rows: BenchmarkRow[];
    unit?: string;
    showBars?: boolean;
    total?: BenchmarkRow;
    caption?: string;
    class?: string;
}
declare const BenchmarkTable: import("svelte").Component<Props, {}, "">;
type BenchmarkTable = ReturnType<typeof BenchmarkTable>;
export default BenchmarkTable;
