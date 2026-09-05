import type { Snippet } from 'svelte';
interface Props {
    title: string;
    count?: number;
    class?: string;
    children?: Snippet;
}
declare const KanbanColumn: import("svelte").Component<Props, {}, "">;
type KanbanColumn = ReturnType<typeof KanbanColumn>;
export default KanbanColumn;
