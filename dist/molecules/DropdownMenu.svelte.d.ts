import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    class?: string;
    onclose?: () => void;
    triggerElement?: HTMLElement | null;
    children?: Snippet;
}
declare const DropdownMenu: import("svelte").Component<Props, {}, "open">;
type DropdownMenu = ReturnType<typeof DropdownMenu>;
export default DropdownMenu;
