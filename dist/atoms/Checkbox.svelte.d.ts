import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
interface Props extends HTMLInputAttributes {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    children?: Snippet;
}
declare const Checkbox: import("svelte").Component<Props, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
