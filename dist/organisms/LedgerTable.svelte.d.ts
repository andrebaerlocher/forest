import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLTableElement> {
    activeCol?: string;
    headers?: Snippet;
    rows?: Snippet;
    summary?: Snippet;
}
declare const LedgerTable: import("svelte").Component<Props, {}, "activeCol">;
type LedgerTable = ReturnType<typeof LedgerTable>;
export default LedgerTable;
