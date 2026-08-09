import { mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SplitPane from "$lib/organisms/SplitPane.svelte";

describe("SplitPane component tests", () => {
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

  it("renders separator gutter with correct ARIA attributes", async () => {
    const instance = mount(SplitPane, {
      target: container,
      props: {
        split: 40,
        min: 15,
        max: 85,
        direction: "horizontal",
      },
    });

    const gutter = container.querySelector("[role='separator']");
    expect(gutter).not.toBeNull();
    expect(gutter?.getAttribute("aria-valuenow")).toBe("40");
    expect(gutter?.getAttribute("aria-valuemin")).toBe("15");
    expect(gutter?.getAttribute("aria-valuemax")).toBe("85");
    expect(gutter?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(gutter?.getAttribute("tabindex")).toBe("0");

    unmount(instance);
  });

  it("adjusts split ratio on keyboard navigation", async () => {
    const onchange = vi.fn();
    const instance = mount(SplitPane, {
      target: container,
      props: {
        split: 50,
        min: 10,
        max: 90,
        direction: "horizontal",
        onchange,
      },
    });

    const gutter = container.querySelector<HTMLElement>("[role='separator']");
    expect(gutter).not.toBeNull();

    if (gutter) {
      const arrowLeft = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true });
      gutter.dispatchEvent(arrowLeft);
    }

    expect(onchange).toHaveBeenCalledWith(49);
    unmount(instance);
  });

  it("removes pointer event listeners on unmount without throwing", async () => {
    const instance = mount(SplitPane, {
      target: container,
      props: {
        split: 50,
      },
    });

    expect(() => unmount(instance)).not.toThrow();
  });
});
