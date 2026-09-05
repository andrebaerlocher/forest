import type { Snippet } from 'svelte';
interface Props {
    label?: string;
    class?: string;
    children?: Snippet;
}
declare const ContextualStrip: import("svelte").Component<Props, {}, "">;
type ContextualStrip = ReturnType<typeof ContextualStrip>;
export default ContextualStrip;
