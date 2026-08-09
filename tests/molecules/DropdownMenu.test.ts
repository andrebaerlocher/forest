import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DropdownMenu from "$lib/molecules/DropdownMenu.svelte";

describe("DropdownMenu component tests", () => {
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

  it("renders menu with role='menu' when open is true", async () => {
    const instance = mount(DropdownMenu, {
      target: container,
      props: {
        open: true,
      },
    });

    const menuEl = container.querySelector<HTMLElement>(".dropdown-menu");
    expect(menuEl).not.toBeNull();
    expect(menuEl?.getAttribute("role")).toBe("menu");
    expect(menuEl?.getAttribute("tabindex")).toBe("-1");

    unmount(instance);
  });

  it("does not render menu when open is false", async () => {
    const instance = mount(DropdownMenu, {
      target: container,
      props: {
        open: false,
      },
    });

    const menuEl = container.querySelector<HTMLElement>(".dropdown-menu");
    expect(menuEl).toBeNull();

    unmount(instance);
  });

  it("sets aria-haspopup and aria-expanded on triggerElement", async () => {
    const triggerBtn = document.createElement("button");
    container.appendChild(triggerBtn);

    const instance = mount(DropdownMenu, {
      target: container,
      props: {
        open: true,
        triggerElement: triggerBtn,
      },
    });
    await tick();

    expect(triggerBtn.getAttribute("aria-haspopup")).toBe("true");
    expect(triggerBtn.getAttribute("aria-expanded")).toBe("true");

    unmount(instance);
  });

  it("closes menu and calls onclose when Escape key is pressed", async () => {
    const onclose = vi.fn();
    const instance = mount(DropdownMenu, {
      target: container,
      props: {
        open: true,
        onclose,
      },
    });

    const menuEl = container.querySelector<HTMLElement>(".dropdown-menu");
    expect(menuEl).not.toBeNull();

    if (menuEl) {
      const escapeEvt = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      menuEl.dispatchEvent(escapeEvt);
    }

    expect(onclose).toHaveBeenCalled();
    unmount(instance);
  });
});
