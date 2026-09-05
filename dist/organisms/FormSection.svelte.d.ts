import type { Snippet } from 'svelte';
interface Props {
    title: string;
    description?: string;
    class?: string;
    children?: Snippet;
}
declare const FormSection: import("svelte").Component<Props, {}, "">;
type FormSection = ReturnType<typeof FormSection>;
export default FormSection;
