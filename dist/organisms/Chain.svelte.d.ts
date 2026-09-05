import type { HTMLAttributes } from 'svelte/elements';
import type { ChainStep } from '../domain.js';
interface Props extends HTMLAttributes<HTMLElement> {
    id?: string;
    /** Frame caption, e.g. "BFF Server Execution Order". */
    title?: string;
    /** What arrives at the top of the chain, e.g. "Client Request". */
    entry?: string;
    /** What the chain hands off to, e.g. "Handler". */
    exit?: string;
    steps: ChainStep[];
    class?: string;
}
declare const Chain: import("svelte").Component<Props, {}, "">;
type Chain = ReturnType<typeof Chain>;
export default Chain;
