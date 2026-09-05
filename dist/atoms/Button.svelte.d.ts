import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
interface Props extends HTMLButtonAttributes {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "ghost" | "danger";
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
