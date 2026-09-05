import type { HTMLTextareaAttributes } from 'svelte/elements';
interface Props extends HTMLTextareaAttributes {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    rows?: number;
    class?: string;
}
declare const Textarea: import("svelte").Component<Props, {}, "value">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;
