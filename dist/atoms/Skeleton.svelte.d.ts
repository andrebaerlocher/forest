import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Preset shapes. 'text' is a line of body copy; 'block' is an arbitrary box. */
    variant?: 'text' | 'block' | 'circle';
    /** Any CSS length. Defaults: text/block -> '100%', circle -> '32px'. */
    width?: string;
    /** Any CSS length. Defaults: text -> '1em', block -> '80px', circle -> width. */
    height?: string;
    /** For variant='text': render this many stacked lines. */
    lines?: number;
    class?: string;
}
declare const Skeleton: import("svelte").Component<Props, {}, "">;
type Skeleton = ReturnType<typeof Skeleton>;
export default Skeleton;
