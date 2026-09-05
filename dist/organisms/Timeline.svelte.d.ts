import type { Snippet } from 'svelte';
interface Props {
    /** Optional section label, e.g. a date group heading */
    label?: string;
    class?: string;
    children?: Snippet;
}
declare const Timeline: import("svelte").Component<Props, {}, "">;
type Timeline = ReturnType<typeof Timeline>;
export default Timeline;
