import type { HTMLAttributes } from 'svelte/elements';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    id?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
    label?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    onchange?: (value: number) => void;
    class?: string;
}
declare const Slider: import("svelte").Component<Props, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
