import type { HTMLButtonAttributes } from 'svelte/elements';
interface Props extends HTMLButtonAttributes {
    onclick?: (event: MouseEvent) => void;
    class?: string;
}
declare const PaletteIndicator: import("svelte").Component<Props, {}, "">;
type PaletteIndicator = ReturnType<typeof PaletteIndicator>;
export default PaletteIndicator;
