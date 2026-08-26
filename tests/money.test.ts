import { describe, expect, it } from "vitest";
import {
  CHF_CASH_STEP,
  currencyAffix,
  formatMoney,
  fromMinor,
  getSeparators,
  parseMoney,
  roundToDigits,
  roundToStep,
  toMinor,
} from "$lib/money.js";

describe("money — formatting", () => {
  it("groups Swiss francs with an apostrophe and a dot decimal", () => {
    expect(formatMoney(1234567.5)).toBe("1'234'567.50");
  });

  it("pads to the fraction digits", () => {
    expect(formatMoney(8)).toBe("8.00");
    expect(formatMoney(8.1)).toBe("8.10");
  });

  it("returns an empty string for an empty amount rather than 0.00", () => {
    expect(formatMoney(null)).toBe("");
    expect(formatMoney(undefined)).toBe("");
    expect(formatMoney(Number.NaN)).toBe("");
  });

  it("includes the currency only when asked", () => {
    expect(formatMoney(1234.5, { currencyDisplay: "code" })).toContain("CHF");
    expect(formatMoney(1234.5)).not.toContain("CHF");
  });

  it("honours other locales", () => {
    expect(formatMoney(1234.5, { locale: "de-DE" })).toBe("1.234,50");
  });
});

describe("money — separators and affix", () => {
  it("reads the Swiss separators out of Intl", () => {
    expect(getSeparators("de-CH")).toEqual({ group: "'", decimal: "." });
    expect(getSeparators("de-DE")).toEqual({ group: ".", decimal: "," });
  });

  it("puts CHF before the number in de-CH and after it in fr-CH", () => {
    expect(currencyAffix({ locale: "de-CH" })).toEqual({ text: "CHF", side: "before" });
    expect(currencyAffix({ locale: "fr-CH" })).toEqual({ text: "CHF", side: "after" });
  });
});

describe("money — parsing", () => {
  it("reads the format it writes", () => {
    expect(parseMoney("1'234'567.50")).toBe(1234567.5);
  });

  it("accepts the separators people actually type", () => {
    expect(parseMoney("1'234.50")).toBe(1234.5);
    expect(parseMoney("1’234.50")).toBe(1234.5); // curly apostrophe
    expect(parseMoney("1 234,50")).toBe(1234.5);
    expect(parseMoney("1 234.50")).toBe(1234.5); // non-breaking space
    expect(parseMoney("1.234,50")).toBe(1234.5);
    expect(parseMoney("1234,5")).toBe(1234.5);
  });

  it("strips currency codes and symbols", () => {
    expect(parseMoney("CHF 1'234.50")).toBe(1234.5);
    expect(parseMoney("1'234.50 CHF")).toBe(1234.5);
  });

  it("reads the Swiss shorthand for round francs as positive", () => {
    // the dash stands in for the rappen, it is not a minus sign
    expect(parseMoney("87.-")).toBe(87);
    expect(parseMoney("87.–")).toBe(87);
    expect(parseMoney("87.—")).toBe(87);
    expect(parseMoney("CHF 87.-")).toBe(87);
    expect(parseMoney("Fr. 1'250.-")).toBe(1250);
  });

  it("reads a lone separator before three digits as grouping", () => {
    expect(parseMoney("1.234")).toBe(1234);
    expect(parseMoney("12,345,678")).toBe(12345678);
  });

  it("reads a lone separator before one or two digits as a decimal mark", () => {
    expect(parseMoney("1.5")).toBe(1.5);
    expect(parseMoney("1.50")).toBe(1.5);
  });

  it("handles negatives, including the accountancy forms", () => {
    expect(parseMoney("-1'234.50")).toBe(-1234.5);
    expect(parseMoney("–1'234.50")).toBe(-1234.5); // en dash
    expect(parseMoney("1'234.50-")).toBe(-1234.5); // dash after a digit
    expect(parseMoney("(1'234.50)")).toBe(-1234.5);
  });

  it("returns null when there is no number in there", () => {
    expect(parseMoney("")).toBeNull();
    expect(parseMoney("   ")).toBeNull();
    expect(parseMoney("CHF")).toBeNull();
    expect(parseMoney(null)).toBeNull();
    expect(parseMoney(undefined)).toBeNull();
  });
});

describe("money — minor units", () => {
  it("converts francs to rappen and back", () => {
    expect(toMinor(1234.5)).toBe(123450);
    expect(fromMinor(123450)).toBe(1234.5);
  });

  it("survives the classic float trap that `value * 100` walks into", () => {
    // 1.005 * 100 is 100.49999999999999, so Math.round gives 100.
    expect(toMinor(1.005)).toBe(101);
    expect(roundToDigits(1.005)).toBe(1.01);
  });

  it("rounds half away from zero, not half up", () => {
    expect(toMinor(-1.005)).toBe(-101);
    expect(roundToDigits(-1.005)).toBe(-1.01);
  });

  it("keeps a sum of line totals exact", () => {
    const lines = [19.9, 19.9, 19.9, 0.3];
    const naive = lines.reduce((a, b) => a + b, 0);
    const exact = fromMinor(lines.reduce((a, b) => a + toMinor(b), 0));
    expect(naive).not.toBe(60); // 60.000000000000014
    expect(exact).toBe(60);
  });
});

describe("money — rounding", () => {
  it("settles to the nearest 5 rappen", () => {
    expect(CHF_CASH_STEP).toBe(0.05);
    expect(roundToStep(12.32, CHF_CASH_STEP)).toBe(12.3);
    expect(roundToStep(12.33, CHF_CASH_STEP)).toBe(12.35);
    expect(roundToStep(12.37, CHF_CASH_STEP)).toBe(12.35);
    expect(roundToStep(12.38, CHF_CASH_STEP)).toBe(12.4);
  });

  it("rounds a .025 midpoint away from zero in both directions", () => {
    expect(roundToStep(12.325, CHF_CASH_STEP)).toBe(12.35);
    expect(roundToStep(-12.325, CHF_CASH_STEP)).toBe(-12.35);
  });

  it("leaves an exact multiple alone", () => {
    expect(roundToStep(12.35, CHF_CASH_STEP)).toBe(12.35);
    expect(roundToStep(0, CHF_CASH_STEP)).toBe(0);
  });

  it("falls back to plain decimal rounding when the step is 0", () => {
    expect(roundToStep(12.333, 0)).toBe(12.33);
    expect(roundToStep(12.333, -1)).toBe(12.33);
  });
});
