import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: number;
    max: number;
    unit?: string;
    formatted?: string;
    tone?: 'neutral' | 'accent' | 'danger' | 'success' | 'warning';
    class?: string;
}
declare const BarMeter: import("svelte").Component<Props, {}, "">;
type BarMeter = ReturnType<typeof BarMeter>;
export default BarMeter;
