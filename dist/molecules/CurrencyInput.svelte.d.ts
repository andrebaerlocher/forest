import type { HTMLInputAttributes } from 'svelte/elements';
import { type CurrencyDisplay } from '../money.js';
interface Props extends Omit<HTMLInputAttributes, 'value' | 'onchange' | 'oninput' | 'type' | 'min' | 'max' | 'step'> {
    /** The amount in major units — francs, not rappen. `null` is an empty field. */
    value?: number | null;
    locale?: string;
    currency?: string;
    /** How the currency reads in the affix. `'none'` drops the affix. */
    currencyDisplay?: CurrencyDisplay;
    fractionDigits?: number;
    /**
     * Rounding applied when the field commits. Pass `CHF_CASH_STEP` (0.05) for
     * Swiss cash rounding; 0 rounds to `fractionDigits` alone. It also sets the
     * arrow-key increment.
     */
    roundingStep?: number;
    min?: number | null;
    max?: number | null;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    placeholder?: string;
    /** Name of the hidden field that carries the canonical number into a form post. */
    name?: string;
    /** Fires on commit (blur or Enter) with the parsed, clamped, rounded amount. */
    onchange?: (value: number | null) => void;
    class?: string;
}
declare const CurrencyInput: import("svelte").Component<Props, {}, "value">;
type CurrencyInput = ReturnType<typeof CurrencyInput>;
export default CurrencyInput;
