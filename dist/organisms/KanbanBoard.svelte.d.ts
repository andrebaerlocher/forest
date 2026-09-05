import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** The columns, typically a run of <KanbanColumn>. */
    children?: Snippet;
    /** Accessible name for the board region. */
    label?: string;
    class?: string;
}
declare const KanbanBoard: import("svelte").Component<Props, {}, "">;
type KanbanBoard = ReturnType<typeof KanbanBoard>;
export default KanbanBoard;
