import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal';
    class?: string;
}
declare const Wave: import("svelte").Component<Props, {}, "">;
type Wave = ReturnType<typeof Wave>;
export default Wave;
