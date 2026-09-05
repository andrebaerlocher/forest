import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Bindable. The current values. */
    value?: string[];
    placeholder?: string;
    /** Optional autocomplete source. When empty, TagInput is free-entry only. */
    suggestions?: string[];
    /** Reject a value already present. Default true. */
    unique?: boolean;
    /** Hard cap on how many values may be added. */
    max?: number;
    disabled?: boolean;
    /** Accessible name for the text field. Required for a usable control. */
    label?: string;
    id?: string;
    class?: string;
}
declare const TagInput: import("svelte").Component<Props, {}, "value">;
type TagInput = ReturnType<typeof TagInput>;
export default TagInput;
