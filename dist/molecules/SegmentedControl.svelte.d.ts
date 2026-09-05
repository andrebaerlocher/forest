import type { SelectableItem as Option } from '../domain.js';
interface Props {
    items: Option[];
    activeId: string;
    class?: string;
    onchange?: (id: string) => void;
}
declare const SegmentedControl: import("svelte").Component<Props, {}, "activeId">;
type SegmentedControl = ReturnType<typeof SegmentedControl>;
export default SegmentedControl;
