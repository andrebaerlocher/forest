import type { HTMLAttributes } from 'svelte/elements';
import type { DecisionStatus, RejectedAlternative } from '../domain.js';
interface Props extends HTMLAttributes<HTMLElement> {
    id: string;
    title: string;
    status?: DecisionStatus;
    context: string;
    decision: string;
    /** Neutral consequences of the decision. Can be used standalone or alongside `gains`/`costs`. */
    consequences?: string[];
    /** What the decision buys. Rendered beside `costs`. */
    gains?: string[];
    /** What it costs — the trade-off accepted knowingly, not a drawback found later. */
    costs?: string[];
    alternatives?: RejectedAlternative[];
    level?: 2 | 3 | 4 | 5 | 6;
    class?: string;
}
declare const DecisionRecord: import("svelte").Component<Props, {}, "">;
type DecisionRecord = ReturnType<typeof DecisionRecord>;
export default DecisionRecord;
