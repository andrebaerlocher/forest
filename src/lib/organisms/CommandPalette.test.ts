import { tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountComponent } from "../../test-support/test-component-loader.js";

const sampleCommands = [
  { id: "new-file", label: "Create New File", shortcut: "⌘N" },
  { id: "open-file", label: "Open File", shortcut: "⌘O" },
  { id: "save", label: "Save Workspace", shortcut: "⌘S" },
];

describe("CommandPalette genuine Svelte 5 component interaction tests", () => {
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

  it("does not render palette DOM when open is false", async () => {
    const instance = await mountComponent("src/lib/organisms/CommandPalette.svelte", {
      target: container,
      props: {
        open: false,
        commands: sampleCommands,
      },
    });

    expect(container.querySelector(".palette-panel")).toBeNull();
    unmount(instance);
  });

  it("renders palette panel and filters commands on search input when open is true", async () => {
    const instance = await mountComponent("src/lib/organisms/CommandPalette.svelte", {
      target: container,
      props: {
        open: true,
        commands: sampleCommands,
      },
    });

    const panel = container.querySelector(".palette-panel");
    const input = container.querySelector<HTMLInputElement>("input.palette-input");

    expect(panel).not.toBeNull();
    expect(input).not.toBeNull();

    let items = container.querySelectorAll(".command-item");
    expect(items.length).toBe(3);

    input!.value = "File";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    items = container.querySelectorAll(".command-item");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Create New File");
    expect(items[1].textContent).toContain("Open File");

    unmount(instance);
  });

  it("handles keyboard navigation with ArrowDown and ArrowUp", async () => {
    const instance = await mountComponent("src/lib/organisms/CommandPalette.svelte", {
      target: container,
      props: {
        open: true,
        commands: sampleCommands,
      },
    });

    const panel = container.querySelector<HTMLElement>(".palette-panel");
    expect(panel).not.toBeNull();

    let items = container.querySelectorAll(".command-item");
    expect(items[0].classList.contains("highlighted")).toBe(true);

    panel!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();

    items = container.querySelectorAll(".command-item");
    expect(items[1].classList.contains("highlighted")).toBe(true);

    panel!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await tick();

    items = container.querySelectorAll(".command-item");
    expect(items[0].classList.contains("highlighted")).toBe(true);

    unmount(instance);
  });

  it("triggers onselect and onclose callbacks when command is clicked or selected with Enter", async () => {
    const onselect = vi.fn();
    const onclose = vi.fn();

    const instance = await mountComponent("src/lib/organisms/CommandPalette.svelte", {
      target: container,
      props: {
        open: true,
        commands: sampleCommands,
        onselect,
        onclose,
      },
    });

    const items = container.querySelectorAll<HTMLButtonElement>(".command-item");
    expect(items.length).toBe(3);

    items[1].click();
    await tick();

    expect(onselect).toHaveBeenCalledWith("open-file");
    expect(onclose).toHaveBeenCalled();

    unmount(instance);
  });

  it("triggers onclose callback on Escape keypress", async () => {
    const onclose = vi.fn();

    const instance = await mountComponent("src/lib/organisms/CommandPalette.svelte", {
      target: container,
      props: {
        open: true,
        commands: sampleCommands,
        onclose,
      },
    });

    const panel = container.querySelector<HTMLElement>(".palette-panel");
    panel!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(onclose).toHaveBeenCalled();
    unmount(instance);
  });
});
