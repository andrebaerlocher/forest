import type { HTMLAttributes } from 'svelte/elements';
import type { ComboItem } from '../domain.js';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    items?: ComboItem[];
    /** id of the selected item */
    value?: string | null;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** Text shown when the filter matches nothing */
    emptyText?: string;
    onchange?: (id: string | null, item: ComboItem | null) => void;
    class?: string;
}
declare const Combobox: import("svelte").Component<Props, {}, "value">;
type Combobox = ReturnType<typeof Combobox>;
export default Combobox;
