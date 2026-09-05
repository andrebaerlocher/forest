import type { Snippet } from 'svelte';
interface Props {
    label: string;
    id: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    children?: Snippet;
}
declare const FieldRow: import("svelte").Component<Props, {}, "">;
type FieldRow = ReturnType<typeof FieldRow>;
export default FieldRow;
