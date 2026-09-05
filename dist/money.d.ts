/**
 * Money — formatting, parsing and rounding for currency amounts.
 *
 * A leaf module that imports nothing, so components and the type surface can
 * both depend on it (the same rule `domain.ts` follows).
 *
 * Defaults are Swiss: `de-CH` renders `1'234.50` — an apostrophe group
 * separator and a dot decimal mark — and `CHF` sits before the number.
 *
 * ## On floats
 *
 * Every function here routes through integer minor units (rappen) rather than
 * multiplying by 100, because `Math.round(1.005 * 100)` is 100, not 101: the
 * double nearest to 1.005 is fractionally below it. Re-parsing the decimal
 * literal at a shifted exponent (`"1.005e2"`) sidesteps that.
 *
 * For an invoice, prefer summing {@link toMinor} integers and converting once
 * at the end over adding francs as floats — accumulated line totals are where
 * the missing rappen show up.
 */
/** Swiss cash rounding: totals settle to the nearest 5 rappen. */
export declare const CHF_CASH_STEP = 0.05;
/** How the currency reads next to the number. `none` omits it entirely. */
export type CurrencyDisplay = "code" | "symbol" | "narrowSymbol" | "name" | "none";
export interface MoneyFormatOptions {
    locale?: string;
    currency?: string;
    currencyDisplay?: CurrencyDisplay;
    /** Digits after the decimal mark. 2 for francs and rappen. */
    fractionDigits?: number;
}
export interface MoneyParseOptions {
    locale?: string;
}
/** Where the currency sits relative to the number, and what it reads as. */
export interface CurrencyAffix {
    text: string;
    side: "before" | "after";
}
/** The group and decimal marks `locale` uses for numbers. */
export interface NumberSeparators {
    group: string;
    decimal: string;
}
/** Francs to rappen, as an integer. */
export declare function toMinor(value: number, digits?: number): number;
/** Rappen back to francs. */
export declare function fromMinor(minor: number, digits?: number): number;
/** Round to a fixed number of decimals. */
export declare function roundToDigits(value: number, digits?: number): number;
/**
 * Round to the nearest multiple of `step`.
 *
 * Pass {@link CHF_CASH_STEP} for the 5-rappen rounding a cash total takes.
 * A `step` of 0 or less rounds to `digits` alone.
 */
export declare function roundToStep(value: number, step: number, digits?: number): number;
/** The group and decimal marks `locale` uses — `'` and `.` for `de-CH`. */
export declare function getSeparators(locale?: string): NumberSeparators;
/**
 * What the currency reads as, and which side of the number it belongs on —
 * `CHF 1'234.50` in `de-CH`, `1'234.50 CHF` in `fr-CH`.
 */
export declare function currencyAffix(options?: MoneyFormatOptions): CurrencyAffix;
/**
 * Format an amount for display. Returns `''` for null/undefined/NaN, so an
 * empty field stays empty rather than reading `CHF 0.00`.
 */
export declare function formatMoney(value: number | null | undefined, options?: MoneyFormatOptions): string;
/**
 * Parse what somebody typed into a number, or `null` if it holds no digits.
 *
 * Deliberately permissive: currency codes and symbols, every flavour of Swiss
 * group separator (`'`, `’`, `` ` ``, ordinary/non-breaking/narrow spaces),
 * the `87.-` shorthand for round francs, a trailing minus and accountancy
 * parentheses all parse.
 */
export declare function parseMoney(text: string | null | undefined, options?: MoneyParseOptions): number | null;
