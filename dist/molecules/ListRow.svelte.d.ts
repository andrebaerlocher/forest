import type { Snippet } from 'svelte';
interface Props {
    title: string;
    subtitle?: string;
    value?: string | number;
    active?: boolean;
    /** 'nav' is the tighter, hairline-free form for sidebar lists */
    variant?: 'default' | 'nav';
    /** Show the bottom hairline. Defaults to true, except for 'nav'. */
    divided?: boolean;
    onclick?: () => void;
    icon?: Snippet;
    trailing?: Snippet;
    class?: string;
}
declare const ListRow: import("svelte").Component<Props, {}, "">;
type ListRow = ReturnType<typeof ListRow>;
export default ListRow;
