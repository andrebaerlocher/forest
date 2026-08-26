import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CurrencyInput from "$lib/molecules/CurrencyInput.svelte";
import { CHF_CASH_STEP } from "$lib/money.js";

describe("CurrencyInput component tests", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  const field = () => container.querySelector<HTMLInputElement>("input.amount") as HTMLInputElement;

  /** Focus, replace the contents, blur — what a person does to a filled field. */
  async function type(text: string) {
    const input = field();
    input.focus();
    await tick();
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.blur();
    await tick();
  }

  it("shows the amount grouped the Swiss way at rest", () => {
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 1234.5 },
    });

    expect(field().value).toBe("1'234.50");

    unmount(instance);
  });

  it("leaves an empty field empty rather than showing 0.00", () => {
    const instance = mount(CurrencyInput, { target: container, props: { value: null } });

    expect(field().value).toBe("");
    expect(field().placeholder).toBe("0.00");

    unmount(instance);
  });

  it("puts the currency before the number in de-CH", () => {
    const instance = mount(CurrencyInput, { target: container, props: { value: 10 } });

    const affix = container.querySelector(".affix");
    expect(affix?.textContent?.trim()).toBe("CHF");
    expect(container.querySelector(".currency-input.affix-after")).toBeNull();
    // the affix names the field's unit for a screen reader
    expect(field().getAttribute("aria-describedby")).toBe(affix?.id);

    unmount(instance);
  });

  it("puts the currency after the number in fr-CH", () => {
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 10, locale: "fr-CH" },
    });

    expect(container.querySelector(".currency-input.affix-after")).not.toBeNull();

    unmount(instance);
  });

  it("swaps to an ungrouped draft on focus", async () => {
    const instance = mount(CurrencyInput, { target: container, props: { value: 1234.5 } });

    field().focus();
    await tick();
    expect(field().value).toBe("1234.50");

    unmount(instance);
  });

  it("parses what was typed and reformats it on blur", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: null, onchange: (v: number | null) => changes.push(v) },
    });

    await type("1'234.50");

    expect(changes).toEqual([1234.5]);
    expect(field().value).toBe("1'234.50");

    unmount(instance);
  });

  it("accepts a comma as the decimal mark", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: null, onchange: (v: number | null) => changes.push(v) },
    });

    await type("1234,5");

    expect(changes).toEqual([1234.5]);

    unmount(instance);
  });

  it("applies Swiss 5-rappen rounding when asked", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: {
        value: null,
        roundingStep: CHF_CASH_STEP,
        onchange: (v: number | null) => changes.push(v),
      },
    });

    await type("12.33");

    expect(changes).toEqual([12.35]);
    expect(field().value).toBe("12.35");

    unmount(instance);
  });

  it("clamps to min and max on commit", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: null, min: 0, max: 100, onchange: (v: number | null) => changes.push(v) },
    });

    await type("-5");
    await type("500");

    expect(changes).toEqual([0, 100]);

    unmount(instance);
  });

  it("clears the value when the field is emptied", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 42, onchange: (v: number | null) => changes.push(v) },
    });

    await type("");

    expect(changes).toEqual([null]);
    expect(field().value).toBe("");

    unmount(instance);
  });

  it("gives a negative amount the danger treatment", () => {
    const instance = mount(CurrencyInput, { target: container, props: { value: -20 } });

    expect(field().classList.contains("neg")).toBe(true);

    unmount(instance);
  });

  it("carries the canonical number in a hidden field for form posts", () => {
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 1234.5, name: "total" },
    });

    const hidden = container.querySelector<HTMLInputElement>("input[type='hidden']");
    expect(hidden?.name).toBe("total");
    // not the locale text — a number the server can parse
    expect(hidden?.value).toBe("1234.5");

    unmount(instance);
  });

  it("steps by the rounding step on arrow keys", async () => {
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 10, roundingStep: CHF_CASH_STEP },
    });

    const input = field();
    input.focus();
    await tick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await tick();

    expect(input.value).toBe("10.05");

    unmount(instance);
  });

  it("abandons the draft on Escape", async () => {
    const changes: Array<number | null> = [];
    const instance = mount(CurrencyInput, {
      target: container,
      props: { value: 42, onchange: (v: number | null) => changes.push(v) },
    });

    const input = field();
    input.focus();
    await tick();
    input.value = "999";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(changes).toEqual([]);
    expect(input.value).toBe("42.00");

    unmount(instance);
  });
});
