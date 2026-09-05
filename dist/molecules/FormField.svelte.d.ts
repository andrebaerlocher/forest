import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    id: string;
    children: Snippet;
}
declare const FormField: import("svelte").Component<Props, {}, "">;
type FormField = ReturnType<typeof FormField>;
export default FormField;
