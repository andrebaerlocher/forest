import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Status } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    status?: Status;
    title?: string;
    ondismiss?: () => void;
    class?: string;
    children?: Snippet;
}
declare const Alert: import("svelte").Component<Props, {}, "">;
type Alert = ReturnType<typeof Alert>;
export default Alert;
