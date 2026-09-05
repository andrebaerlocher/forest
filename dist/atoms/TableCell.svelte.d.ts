import type { Snippet } from 'svelte';
import type { HTMLTdAttributes } from 'svelte/elements';
interface Props extends HTMLTdAttributes {
    type?: 'text' | 'numeric';
    active?: boolean;
    negative?: boolean;
    selected?: boolean;
    editing?: boolean;
    /** Forced hover state — for static specimens that can't demonstrate :hover */
    hover?: boolean;
    /** The <td> itself, so wrappers can focus the cell */
    element?: HTMLTableCellElement | null;
    class?: string;
    children?: Snippet;
}
declare const TableCell: import("svelte").Component<Props, {}, "element">;
type TableCell = ReturnType<typeof TableCell>;
export default TableCell;
