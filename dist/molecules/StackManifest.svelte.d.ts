import type { HTMLAttributes } from 'svelte/elements';
import type { TechStackGroup } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDListElement> {
    groups: TechStackGroup[];
    class?: string;
}
declare const StackManifest: import("svelte").Component<Props, {}, "">;
type StackManifest = ReturnType<typeof StackManifest>;
export default StackManifest;
