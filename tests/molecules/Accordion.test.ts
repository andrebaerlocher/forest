import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Accordion from "$lib/molecules/Accordion.svelte";

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
    const instance = mount(Accordion, {
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
    const instance = mount(Accordion, {
      target: container,
      props: {
        items: sampleItems,
        onchange,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[0].click();
    await tick();

    const panel = container.querySelector(".accordion-panel");
    expect(panel).not.toBeNull();
    expect(panel?.textContent).toContain("Content 1");
    expect(onchange).toHaveBeenCalledWith(["sec1"]);

    triggers[0].click();
    await tick();
    expect(container.querySelector(".accordion-panel")).toBeNull();
    expect(onchange).toHaveBeenLastCalledWith([]);

    unmount(instance);
  });

  it("supports expanding multiple items simultaneously when multiple is true", async () => {
    const instance = mount(Accordion, {
      target: container,
      props: {
        items: sampleItems,
        multiple: true,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[0].click();
    await tick();
    triggers[1].click();
    await tick();

    const panels = container.querySelectorAll(".accordion-panel");
    expect(panels.length).toBe(2);

    unmount(instance);
  });

  it("does not toggle item when disabled is true", async () => {
    const onchange = vi.fn();
    const instance = mount(Accordion, {
      target: container,
      props: {
        items: sampleItems,
        onchange,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[2].click();
    await tick();

    expect(container.querySelector(".accordion-panel")).toBeNull();
    expect(onchange).not.toHaveBeenCalled();

    unmount(instance);
  });

  it("toggles item on Space and Enter keypresses", async () => {
    const instance = mount(Accordion, {
      target: container,
      props: {
        items: sampleItems,
      },
    });

    const triggers = container.querySelectorAll<HTMLButtonElement>("button.accordion-trigger");
    triggers[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(container.querySelector(".accordion-panel")).not.toBeNull();

    triggers[0].dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await tick();

    expect(container.querySelector(".accordion-panel")).toBeNull();

    unmount(instance);
  });
});
