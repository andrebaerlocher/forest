import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<SVGSVGElement> {
    values: number[];
    width?: number;
    height?: number;
    tone?: 'neutral' | 'accent';
    class?: string;
}
declare const Sparkline: import("svelte").Component<Props, {}, "">;
type Sparkline = ReturnType<typeof Sparkline>;
export default Sparkline;
