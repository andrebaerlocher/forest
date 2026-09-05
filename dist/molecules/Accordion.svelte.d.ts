import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
export interface AccordionItemData {
    id: string;
    title: string;
    content?: string;
    disabled?: boolean;
}
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onchange" | "children"> {
    items?: AccordionItemData[];
    multiple?: boolean;
    expandedIds?: string[];
    onchange?: (expandedIds: string[]) => void;
    children?: Snippet<[AccordionItemData]>;
}
declare const Accordion: import("svelte").Component<Props, {}, "expandedIds">;
type Accordion = ReturnType<typeof Accordion>;
export default Accordion;
