import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onchange"> {
    direction?: "horizontal" | "vertical";
    split?: number;
    min?: number;
    max?: number;
    first?: Snippet;
    second?: Snippet;
    onchange?: (split: number) => void;
}
declare const SplitPane: import("svelte").Component<Props, {}, "split">;
type SplitPane = ReturnType<typeof SplitPane>;
export default SplitPane;
