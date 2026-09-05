import type { Snippet } from 'svelte';
interface Props {
    class?: string;
    list?: Snippet;
    detail?: Snippet;
}
declare const ListDetailTemplate: import("svelte").Component<Props, {}, "">;
type ListDetailTemplate = ReturnType<typeof ListDetailTemplate>;
export default ListDetailTemplate;
