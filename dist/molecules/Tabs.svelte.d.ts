import type { SelectableItem as TabItem } from '../domain.js';
interface Props {
    items: TabItem[];
    activeId: string;
    class?: string;
    onchange?: (id: string) => void;
}
declare const Tabs: import("svelte").Component<Props, {}, "activeId">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
