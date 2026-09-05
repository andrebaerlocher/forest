import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    hue?: number;
}
declare const HueControl: import("svelte").Component<Props, {}, "hue">;
type HueControl = ReturnType<typeof HueControl>;
export default HueControl;
