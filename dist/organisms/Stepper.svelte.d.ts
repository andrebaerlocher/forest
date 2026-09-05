import type { HTMLAttributes } from 'svelte/elements';
import type { StepItem } from '../domain.js';
interface Props extends HTMLAttributes<HTMLElement> {
    steps: StepItem[];
    /** Bindable id of the current step. */
    activeId?: string;
    /** Ids of steps already completed. */
    completedIds?: string[];
    orientation?: 'horizontal' | 'vertical';
    /**
     * When set, steps become buttons and this fires on activation. Omit it and
     * the stepper is a read-only progress display — not a row of dead buttons.
     */
    onstepclick?: (id: string) => void;
    /** Accessible name for the nav landmark. */
    label?: string;
    class?: string;
}
declare const Stepper: import("svelte").Component<Props, {}, "activeId">;
type Stepper = ReturnType<typeof Stepper>;
export default Stepper;
