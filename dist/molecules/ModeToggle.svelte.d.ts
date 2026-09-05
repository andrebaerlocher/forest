import type { HTMLButtonAttributes } from 'svelte/elements';
interface Props extends HTMLButtonAttributes {
    mode?: 'light' | 'dark';
}
declare const ModeToggle: import("svelte").Component<Props, {}, "mode">;
type ModeToggle = ReturnType<typeof ModeToggle>;
export default ModeToggle;
