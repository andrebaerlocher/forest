import type { Snippet } from 'svelte';
interface Props {
    class?: string;
    children?: Snippet;
    left?: Snippet;
    right?: Snippet;
}
declare const StatusBar: import("svelte").Component<Props, {}, "">;
type StatusBar = ReturnType<typeof StatusBar>;
export default StatusBar;
