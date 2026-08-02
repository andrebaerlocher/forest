import { tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountComponent } from "../../test-support/test-component-loader.js";

describe("Dialog genuine Svelte 5 component interaction tests", () => {
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

  it("does not render dialog DOM when open is false", async () => {
    const instance = await mountComponent("src/lib/organisms/Dialog.svelte", {
      target: container,
      props: {
        open: false,
        title: "Test Dialog",
      },
    });

    expect(container.querySelector(".dialog-wrapper")).toBeNull();
    unmount(instance);
  });

  it("renders dialog DOM, title, and modal accessibility attributes when open is true", async () => {
    const instance = await mountComponent("src/lib/organisms/Dialog.svelte", {
      target: container,
      props: {
        open: true,
        title: "Confirm Deletion",
      },
    });

    const wrapper = container.querySelector<HTMLElement>(".dialog-wrapper");
    const titleEl = container.querySelector(".dialog-title");

    expect(wrapper).not.toBeNull();
    expect(wrapper?.getAttribute("role")).toBe("dialog");
    expect(wrapper?.getAttribute("aria-modal")).toBe("true");
    expect(wrapper?.getAttribute("aria-label")).toBe("Confirm Deletion");
    expect(titleEl?.textContent).toBe("Confirm Deletion");

    unmount(instance);
  });

  it("applies lg modifier class when size is set to lg", async () => {
    const instance = await mountComponent("src/lib/organisms/Dialog.svelte", {
      target: container,
      props: {
        open: true,
        title: "System Logs",
        size: "lg",
      },
    });

    const scaleContainer = container.querySelector(".dialog-scale-container");
    expect(scaleContainer?.classList.contains("lg")).toBe(true);

    unmount(instance);
  });

  it("triggers onclose callback when Escape key is pressed", async () => {
    const onclose = vi.fn();

    const instance = await mountComponent("src/lib/organisms/Dialog.svelte", {
      target: container,
      props: {
        open: true,
        title: "Escape Test",
        onclose,
      },
    });

    const wrapper = container.querySelector<HTMLElement>(".dialog-wrapper");
    wrapper!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(onclose).toHaveBeenCalledTimes(1);

    unmount(instance);
  });

  it("triggers onclose callback when Scrim backdrop overlay is clicked", async () => {
    const onclose = vi.fn();

    const instance = await mountComponent("src/lib/organisms/Dialog.svelte", {
      target: container,
      props: {
        open: true,
        title: "Scrim Click Test",
        onclose,
      },
    });

    const scrim = container.querySelector<HTMLElement>(".scrim");
    expect(scrim).not.toBeNull();

    scrim!.click();
    await tick();

    expect(onclose).toHaveBeenCalledTimes(1);

    unmount(instance);
  });
});
