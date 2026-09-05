import type { Command } from '../domain.js';
interface Props {
    open: boolean;
    /** The commands this palette offers. The component owns no data of its own. */
    commands?: Command[];
    placeholder?: string;
    emptyText?: string;
    class?: string;
    onclose?: () => void;
    onselect?: (value: string) => void;
}
declare const CommandPalette: import("svelte").Component<Props, {}, "">;
type CommandPalette = ReturnType<typeof CommandPalette>;
export default CommandPalette;
