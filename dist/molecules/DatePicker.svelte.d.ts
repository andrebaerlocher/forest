import type { HTMLAttributes } from 'svelte/elements';
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    /**
     * ISO date string, YYYY-MM-DD, or '' for empty.
     *
     * Always ISO, whatever the locale — the field *displays* `14.08.2026` in
     * `de-CH` but the bound value stays sortable and storable.
     */
    value?: string;
    /** Defaults to the locale's own pattern — `DD.MM.YYYY` for Switzerland. */
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    /** Drives the display format, month names and weekday names. */
    locale?: string;
    /**
     * Weekday heading width. `narrow` is one letter, which is ambiguous in
     * German — Montag and Mittwoch are both "M". `short` gives Mo/Di/Mi.
     */
    weekdayFormat?: 'narrow' | 'short';
    onchange?: (value: string) => void;
    class?: string;
}
declare const DatePicker: import("svelte").Component<Props, {}, "value">;
type DatePicker = ReturnType<typeof DatePicker>;
export default DatePicker;
