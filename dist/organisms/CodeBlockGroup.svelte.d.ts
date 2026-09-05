import type { HTMLAttributes } from 'svelte/elements';
import type { CodeFile } from '../domain.js';
interface Props extends HTMLAttributes<HTMLDivElement> {
    files: CodeFile[];
    /** Bindable id of the visible file. */
    activeId?: string;
    class?: string;
}
declare const CodeBlockGroup: import("svelte").Component<Props, {}, "activeId">;
type CodeBlockGroup = ReturnType<typeof CodeBlockGroup>;
export default CodeBlockGroup;
