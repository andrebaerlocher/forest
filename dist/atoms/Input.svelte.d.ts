import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLInputElement> {
    value?: string | number;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    invalid?: boolean;
    isNumeric?: boolean;
    class?: string;
}
declare const Input: import("svelte").Component<Props, {}, "value">;
type Input = ReturnType<typeof Input>;
export default Input;
