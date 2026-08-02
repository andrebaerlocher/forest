import { tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountComponent } from "../../test-support/test-component-loader.js";

const sampleItems = [
  { id: "sec1", title: "Section 1", content: "Content 1" },
  { id: "sec2", title: "Section 2", content: "Content 2" },
  { id: "sec3", title: "Section 3", content: "Content 3", disabled: true },
];

describe("Accordion genuine Svelte 5 component interaction tests", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("renders accordion items with triggers and closed panels initially", async () => {
    const instance = await mountComponent("src/lib/molecules/Accordion.svelte", {
      target: container,
      props: {
        items: sampleItems,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    expect(triggers.length).toBe(3);
    expect(triggers[0].textContent).toContain("Section 1");
    expect(triggers[1].textContent).toContain("Section 2");
    expect(container.querySelector(".accordion-panel")).toBeNull();

    unmount(instance);
  });

  it("toggles single item in single mode on click", async () => {
    const onchange = vi.fn();
    let expandedIds: string[] = [];

    const instance = await mountComponent("src/lib/molecules/Accordion.svelte", {
      target: container,
      props: {
        items: sampleItems,
        expandedIds,
        onchange: (ids: string[]) => {
          expandedIds = ids;
          onchange(ids);
        },
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[0].click();
    await tick();

    expect(onchange).toHaveBeenCalledWith(["sec1"]);
    expect(container.querySelector("#accordion-panel-sec1")).not.toBeNull();

    triggers[1].click();
    await tick();

    expect(onchange).toHaveBeenCalledWith(["sec2"]);
    expect(container.querySelector("#accordion-panel-sec1")).toBeNull();
    expect(container.querySelector("#accordion-panel-sec2")).not.toBeNull();

    unmount(instance);
  });

  it("supports expanding multiple items simultaneously when multiple is true", async () => {
    const onchange = vi.fn();

    const instance = await mountComponent("src/lib/molecules/Accordion.svelte", {
      target: container,
      props: {
        items: sampleItems,
        multiple: true,
        expandedIds: ["sec1"],
        onchange,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[1].click();
    await tick();

    expect(onchange).toHaveBeenCalledWith(["sec1", "sec2"]);
    expect(container.querySelector("#accordion-panel-sec1")).not.toBeNull();
    expect(container.querySelector("#accordion-panel-sec2")).not.toBeNull();

    unmount(instance);
  });

  it("does not toggle item when disabled is true", async () => {
    const onchange = vi.fn();

    const instance = await mountComponent("src/lib/molecules/Accordion.svelte", {
      target: container,
      props: {
        items: sampleItems,
        onchange,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    expect(triggers[2].disabled).toBe(true);

    triggers[2].click();
    await tick();

    expect(onchange).not.toHaveBeenCalled();
    expect(container.querySelector("#accordion-panel-sec3")).toBeNull();

    unmount(instance);
  });

  it("toggles item on Space and Enter keypresses", async () => {
    const onchange = vi.fn();

    const instance = await mountComponent("src/lib/molecules/Accordion.svelte", {
      target: container,
      props: {
        items: sampleItems,
        onchange,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(onchange).toHaveBeenCalledWith(["sec1"]);

    triggers[0].dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await tick();

    expect(onchange).toHaveBeenCalledWith([]);

    unmount(instance);
  });
});
