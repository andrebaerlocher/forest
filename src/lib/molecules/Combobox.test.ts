import { tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountComponent } from "../../test-support/test-component-loader.js";
import type { ComboItem } from "../domain.js";

const sampleItems = [
  { id: "u1", label: "Ada Fen", meta: "Sales" },
  { id: "u2", label: "Ren Okada", meta: "Sales" },
  { id: "u3", label: "Mira Holt", meta: "Partnerships" },
];

describe("Combobox genuine Svelte 5 component interaction tests", () => {
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

  it("filters items in DOM list matching label or meta on user typing input", async () => {
    const instance = await mountComponent("src/lib/molecules/Combobox.svelte", {
      target: container,
      props: {
        items: sampleItems,
        placeholder: "Select member...",
      },
    });

    const input = container.querySelector<HTMLInputElement>("input.combobox-input");
    expect(input).not.toBeNull();

    input!.dispatchEvent(new Event("focus", { bubbles: true }));
    await tick();

    input!.value = "sales";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    const listOptions = container.querySelectorAll(".option");
    expect(listOptions.length).toBe(2);
    expect(listOptions[0].textContent).toContain("Ada Fen");
    expect(listOptions[1].textContent).toContain("Ren Okada");

    unmount(instance);
  });

  it("handles ArrowDown and ArrowUp keyboard navigation and active descendant update", async () => {
    const instance = await mountComponent("src/lib/molecules/Combobox.svelte", {
      target: container,
      props: {
        items: sampleItems,
      },
    });

    const input = container.querySelector<HTMLInputElement>("input.combobox-input");
    expect(input).not.toBeNull();

    // Focus to open list
    input!.dispatchEvent(new Event("focus", { bubbles: true }));
    await tick();

    const optionsAfterFirstDown = container.querySelectorAll(".option");
    expect(optionsAfterFirstDown.length).toBe(3);
    expect(optionsAfterFirstDown[0].classList.contains("highlighted")).toBe(true);

    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    const optionsAfterSecondDown = container.querySelectorAll(".option");
    expect(optionsAfterSecondDown[1].classList.contains("highlighted")).toBe(true);

    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await tick();
    const optionsAfterUp = container.querySelectorAll(".option");
    expect(optionsAfterUp[0].classList.contains("highlighted")).toBe(true);

    unmount(instance);
  });

  it("selects highlighted option on Enter keypress and triggers onchange callback", async () => {
    const onchange = vi.fn();
    let currentVal = null;

    const instance = await mountComponent("src/lib/molecules/Combobox.svelte", {
      target: container,
      props: {
        items: sampleItems,
        value: currentVal,
        onchange: (id: string | null, item: ComboItem | null) => {
          currentVal = id;
          onchange(id, item);
        },
      },
    });

    const input = container.querySelector<HTMLInputElement>("input.combobox-input");
    expect(input).not.toBeNull();

    input!.dispatchEvent(new Event("focus", { bubbles: true }));
    await tick();

    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(onchange).toHaveBeenCalledWith("u1", sampleItems[0]);

    unmount(instance);
  });

  it("closes option list on Escape keypress", async () => {
    const instance = await mountComponent("src/lib/molecules/Combobox.svelte", {
      target: container,
      props: {
        items: sampleItems,
      },
    });

    const input = container.querySelector<HTMLInputElement>("input.combobox-input");
    expect(input).not.toBeNull();

    input!.dispatchEvent(new Event("focus", { bubbles: true }));
    await tick();
    expect(container.querySelector(".combobox-list")).not.toBeNull();

    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(container.querySelector(".combobox-list")).toBeNull();

    unmount(instance);
  });

  it("clears selection when clear button is clicked in DOM", async () => {
    const onchange = vi.fn();

    const instance = await mountComponent("src/lib/molecules/Combobox.svelte", {
      target: container,
      props: {
        items: sampleItems,
        value: "u1",
        onchange,
      },
    });

    const clearBtn = container.querySelector<HTMLButtonElement>("button.clear");
    expect(clearBtn).not.toBeNull();

    clearBtn!.click();
    await tick();

    expect(onchange).toHaveBeenCalledWith(null, null);

    unmount(instance);
  });
});
