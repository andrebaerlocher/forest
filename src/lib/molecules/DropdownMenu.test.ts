import fs from "node:fs";
import path from "node:path";
import { mount, unmount } from "svelte";
import { compile } from "svelte/compiler";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const componentCache = new Map<string, unknown>();

async function mountComponent(
  relativePath: string,
  options: { target: HTMLElement; props?: Record<string, unknown> },
) {
  let Component = componentCache.get(relativePath);
  if (!Component) {
    const absPath = path.resolve(relativePath);
    const code = fs.readFileSync(absPath, "utf8");
    const compiled = compile(code, {
      filename: absPath,
      generate: "client",
      dev: false,
    });
    const blob = new Blob([compiled.js.code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const mod = await import(url);
    Component = mod.default;
    componentCache.set(relativePath, Component);
  }
  return mount(Component as Parameters<typeof mount>[0], options as Parameters<typeof mount>[1]);
}

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
    const instance = await mountComponent("src/lib/molecules/DropdownMenu.svelte", {
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
    const instance = await mountComponent("src/lib/molecules/DropdownMenu.svelte", {
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

    const instance = await mountComponent("src/lib/molecules/DropdownMenu.svelte", {
      target: container,
      props: {
        open: true,
        triggerElement: triggerBtn,
      },
    });

    expect(triggerBtn.getAttribute("aria-haspopup")).toBe("true");
    expect(triggerBtn.getAttribute("aria-expanded")).toBe("true");

    unmount(instance);
  });

  it("closes menu and calls onclose when Escape key is pressed", async () => {
    const onclose = vi.fn();
    const instance = await mountComponent("src/lib/molecules/DropdownMenu.svelte", {
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
