import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLSpanElement> {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Draw the seal ring. Off gives a bare initials disc. */
    ring?: boolean;
    class?: string;
}
declare const Avatar: import("svelte").Component<Props, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
