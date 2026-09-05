import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
interface Props extends HTMLButtonAttributes {
    variant?: 'default' | 'active' | 'primary';
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
}
declare const SealButton: import("svelte").Component<Props, {}, "">;
type SealButton = ReturnType<typeof SealButton>;
export default SealButton;
