import type { Snippet } from 'svelte';
interface Props {
    /** Who did it — also drives the avatar initials */
    actor: string;
    /** What they did, e.g. "moved" or "left a note on" */
    verb?: string;
    /** What it happened to, e.g. a deal or contact name */
    target?: string;
    /** Already-formatted timestamp; the component does no date maths */
    timestamp?: string;
    avatarSrc?: string;
    class?: string;
    /** Optional body — a note, a quoted change, an attachment row */
    children?: Snippet;
    trailing?: Snippet;
}
declare const ActivityItem: import("svelte").Component<Props, {}, "">;
type ActivityItem = ReturnType<typeof ActivityItem>;
export default ActivityItem;
