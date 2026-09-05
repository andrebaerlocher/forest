import type { Snippet } from 'svelte';
interface Props {
    title?: string;
    description: string;
    actionLabel?: string;
    onaction?: () => void;
    icon?: Snippet;
}
declare const EmptyState: import("svelte").Component<Props, {}, "">;
type EmptyState = ReturnType<typeof EmptyState>;
export default EmptyState;
