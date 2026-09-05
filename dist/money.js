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
export const CHF_CASH_STEP = 0.05;
const DEFAULT_LOCALE = "de-CH";
const DEFAULT_CURRENCY = "CHF";
/**
 * Move a decimal point by re-parsing the literal, not by multiplying.
 * Falls back to arithmetic for values already in exponential form.
 */
function shift(value, digits) {
    if (!Number.isFinite(value))
        return Number.NaN;
    const s = String(value);
    if (s.includes("e") || s.includes("E"))
        return value * 10 ** digits;
    return Number(`${s}e${digits}`);
}
/** Half-away-from-zero, the convention money uses. `Math.round` is half-up. */
function roundHalfAway(n) {
    if (!Number.isFinite(n))
        return Number.NaN;
    return n >= 0 ? Math.round(n) : -Math.round(-n);
}
/** Francs to rappen, as an integer. */
export function toMinor(value, digits = 2) {
    return roundHalfAway(shift(value, digits));
}
/** Rappen back to francs. */
export function fromMinor(minor, digits = 2) {
    if (!Number.isFinite(minor))
        return Number.NaN;
    return shift(minor, -digits);
}
/** Round to a fixed number of decimals. */
export function roundToDigits(value, digits = 2) {
    if (!Number.isFinite(value))
        return value;
    return fromMinor(toMinor(value, digits), digits);
}
/**
 * Round to the nearest multiple of `step`.
 *
 * Pass {@link CHF_CASH_STEP} for the 5-rappen rounding a cash total takes.
 * A `step` of 0 or less rounds to `digits` alone.
 */
export function roundToStep(value, step, digits = 2) {
    if (!Number.isFinite(value))
        return value;
    if (!(step > 0))
        return roundToDigits(value, digits);
    const stepMinor = toMinor(step, digits);
    if (stepMinor <= 0)
        return roundToDigits(value, digits);
    const units = roundHalfAway(toMinor(value, digits) / stepMinor);
    return fromMinor(units * stepMinor, digits);
}
/** The group and decimal marks `locale` uses — `'` and `.` for `de-CH`. */
export function getSeparators(locale = DEFAULT_LOCALE) {
    try {
        const parts = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
        }).formatToParts(11111.11);
        return {
            group: parts.find((p) => p.type === "group")?.value ?? "'",
            decimal: parts.find((p) => p.type === "decimal")?.value ?? ".",
        };
    }
    catch {
        return { group: "'", decimal: "." };
    }
}
/**
 * What the currency reads as, and which side of the number it belongs on —
 * `CHF 1'234.50` in `de-CH`, `1'234.50 CHF` in `fr-CH`.
 */
export function currencyAffix(options = {}) {
    const { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY, currencyDisplay = "code", } = options;
    try {
        const parts = new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            currencyDisplay: currencyDisplay === "none" ? "code" : currencyDisplay,
        }).formatToParts(1);
        const currencyIndex = parts.findIndex((p) => p.type === "currency");
        const numberIndex = parts.findIndex((p) => p.type === "integer");
        if (currencyIndex < 0)
            return { text: currency, side: "before" };
        return {
            text: parts[currencyIndex].value,
            side: numberIndex >= 0 && currencyIndex > numberIndex ? "after" : "before",
        };
    }
    catch {
        return { text: currency, side: "before" };
    }
}
/**
 * Format an amount for display. Returns `''` for null/undefined/NaN, so an
 * empty field stays empty rather than reading `CHF 0.00`.
 */
export function formatMoney(value, options = {}) {
    const { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY, currencyDisplay = "none", fractionDigits = 2, } = options;
    if (value === null || value === undefined || !Number.isFinite(value))
        return "";
    const numberOptions = {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    };
    if (currencyDisplay !== "none") {
        numberOptions.style = "currency";
        numberOptions.currency = currency;
        numberOptions.currencyDisplay = currencyDisplay;
    }
    try {
        return new Intl.NumberFormat(locale, numberOptions).format(value);
    }
    catch {
        return value.toFixed(fractionDigits);
    }
}
/**
 * Pick out the decimal mark and drop every group separator.
 *
 * `.` and `,` are ambiguous, so the rule is positional rather than
 * locale-driven: with both present the rightmost wins; with one present it is
 * a group separator only when the whole string is grouped (`1’234`, `1.234`,
 * `12,345,678`) and a decimal mark otherwise. That reads `1'234.50`,
 * `1 234,50`, `1.234,50` and `1234,5` the way they were meant.
 */
function normaliseDecimal(digitsAndMarks) {
    const dot = digitsAndMarks.lastIndexOf(".");
    const comma = digitsAndMarks.lastIndexOf(",");
    let decimalIndex = -1;
    if (dot >= 0 && comma >= 0) {
        decimalIndex = Math.max(dot, comma);
    }
    else {
        const only = dot >= 0 ? dot : comma;
        if (only >= 0) {
            const mark = digitsAndMarks[only];
            const grouped = new RegExp(`^\\d{1,3}(\\${mark}\\d{3})+$`).test(digitsAndMarks);
            if (!grouped)
                decimalIndex = only;
        }
    }
    const onlyDigits = (s) => s.replace(/\D/g, "");
    if (decimalIndex < 0)
        return onlyDigits(digitsAndMarks);
    const whole = onlyDigits(digitsAndMarks.slice(0, decimalIndex));
    const fraction = onlyDigits(digitsAndMarks.slice(decimalIndex + 1));
    return fraction ? `${whole}.${fraction}` : whole;
}
/** Hyphen, en dash, em dash, true minus — all of them turn up in typed money. */
const DASHES = "-\u2013\u2014\u2212";
const LEADING_MINUS = new RegExp(`^\\s*[${DASHES}]`);
/**
 * A trailing dash only means "negative" when it follows a digit. After a
 * decimal mark it is the Swiss shorthand for round francs — `87.-` and `87.–`
 * are 87, not −87.
 */
const TRAILING_MINUS = new RegExp(`\\d\\s*[${DASHES}]+\\s*$`);
/**
 * Parse what somebody typed into a number, or `null` if it holds no digits.
 *
 * Deliberately permissive: currency codes and symbols, every flavour of Swiss
 * group separator (`'`, `’`, `` ` ``, ordinary/non-breaking/narrow spaces),
 * the `87.-` shorthand for round francs, a trailing minus and accountancy
 * parentheses all parse.
 */
export function parseMoney(text, options = {}) {
    void options; // the heuristic below is locale-independent by design
    if (typeof text !== "string")
        return null;
    const trimmed = text.trim();
    if (!trimmed)
        return null;
    const negative = /^\s*\(.*\)\s*$/.test(trimmed) || LEADING_MINUS.test(trimmed) || TRAILING_MINUS.test(trimmed);
    // Keep digits and the two ambiguous marks; everything else is noise.
    const stripped = trimmed.replace(/[^\d.,]/g, "");
    if (!/\d/.test(stripped))
        return null;
    const parsed = Number(normaliseDecimal(stripped));
    if (!Number.isFinite(parsed))
        return null;
    return negative ? -parsed : parsed;
}
