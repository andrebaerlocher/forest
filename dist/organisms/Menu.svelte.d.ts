import type { HTMLAttributes } from 'svelte/elements';
import { type AnchoredPlacement } from '../actions/anchored.js';
import type { MenuItemData } from '../domain.js';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
    /** Bindable. */
    open?: boolean;
    anchor?: HTMLElement | null;
    items: MenuItemData[];
    placement?: AnchoredPlacement;
    /** Accessible name for the menu. */
    label?: string;
    onselect?: (id: string) => void;
    onclose?: () => void;
    class?: string;
}
declare const Menu: import("svelte").Component<Props, {}, "open">;
type Menu = ReturnType<typeof Menu>;
export default Menu;
