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

describe("Slider component tests", () => {
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

  it("connects label and input with matching id and for attributes when label is provided", async () => {
    const instance = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: {
        id: "custom-slider",
        label: "Volume level",
        value: 50,
      },
    });

    const labelEl = container.querySelector<HTMLLabelElement>("label.slider-label");
    const inputEl = container.querySelector<HTMLInputElement>("input[type='range']");

    expect(labelEl).not.toBeNull();
    expect(inputEl).not.toBeNull();
    expect(inputEl?.id).toBe("custom-slider");
    expect(labelEl?.htmlFor).toBe("custom-slider");
    expect(labelEl?.id).toBe("custom-slider-label");
    expect(inputEl?.getAttribute("aria-labelledby")).toBe("custom-slider-label");

    unmount(instance);
  });

  it("generates deterministic unique auto id when id prop is omitted", async () => {
    const instance1 = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: { label: "Slider 1" },
    });

    const input1 = container.querySelector<HTMLInputElement>("input[type='range']");
    const id1 = input1?.id;
    expect(id1).toMatch(/^slider-\d+$/);

    unmount(instance1);

    const instance2 = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: { label: "Slider 2" },
    });

    const input2 = container.querySelector<HTMLInputElement>("input[type='range']");
    expect(input2).not.toBeNull();
    const id2 = input2?.id;
    expect(id2).toMatch(/^slider-\d+$/);
    expect(id2).not.toBe(id1);

    unmount(instance2);
  });

  it("forwards aria-label and custom aria-labelledby correctly", async () => {
    const instance = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: {
        "aria-label": "Brightness",
        "aria-labelledby": "external-label-id",
        value: 75,
      },
    });

    const input = container.querySelector<HTMLInputElement>("input[type='range']");
    expect(input?.getAttribute("aria-label")).toBe("Brightness");
    expect(input?.getAttribute("aria-labelledby")).toBe("external-label-id");

    unmount(instance);
  });

  it("updates value and triggers onchange handler when range input changes", async () => {
    const onchange = vi.fn();
    const instance = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: {
        value: 10,
        min: 0,
        max: 100,
        onchange,
      },
    });

    const input = container.querySelector<HTMLInputElement>("input[type='range']");
    expect(input).not.toBeNull();
    if (input) {
      input.value = "45";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    expect(onchange).toHaveBeenCalledWith(45);
    unmount(instance);
  });

  it("respects disabled state", async () => {
    const instance = await mountComponent("src/lib/atoms/Slider.svelte", {
      target: container,
      props: {
        disabled: true,
        label: "Disabled slider",
      },
    });

    const wrapper = container.querySelector(".slider-control");
    const input = container.querySelector<HTMLInputElement>("input[type='range']");

    expect(wrapper?.classList.contains("disabled")).toBe(true);
    expect(input?.disabled).toBe(true);

    unmount(instance);
  });
});
