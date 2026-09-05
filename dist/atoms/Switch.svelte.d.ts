import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    children?: Snippet;
}
declare const Switch: import("svelte").Component<Props, {}, "checked">;
type Switch = ReturnType<typeof Switch>;
export default Switch;
