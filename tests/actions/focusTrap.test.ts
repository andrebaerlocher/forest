import "../../src/test-setup.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { focusTrap } from "$lib/actions/focusTrap.js";

describe("focusTrap action", () => {
  let container: HTMLDivElement;
  let outsideButton: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    outsideButton = document.createElement("button");
    outsideButton.id = "outside";
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("focuses first focusable element on mount after microtask", async () => {
    const btn1 = document.createElement("button");
    btn1.id = "btn1";
    const btn2 = document.createElement("button");
    btn2.id = "btn2";
    container.appendChild(btn1);
    container.appendChild(btn2);

    const trap = focusTrap(container, { autoFocus: true, enabled: true });

    await new Promise((r) => queueMicrotask(() => r(undefined)));
    expect(document.activeElement).toBe(btn1);

    trap.destroy();
  });

  it("traps Tab key navigation at boundary (last -> first)", () => {
    const btn1 = document.createElement("button");
    btn1.id = "btn1";
    const btn2 = document.createElement("button");
    btn2.id = "btn2";
    container.appendChild(btn1);
    container.appendChild(btn2);

    const trap = focusTrap(container);
    btn2.focus();

    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    container.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(btn1);

    trap.destroy();
  });

  it("traps Shift+Tab key navigation at boundary (first -> last)", () => {
    const btn1 = document.createElement("button");
    btn1.id = "btn1";
    const btn2 = document.createElement("button");
    btn2.id = "btn2";
    container.appendChild(btn1);
    container.appendChild(btn2);

    const trap = focusTrap(container);
    btn1.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(btn2);

    trap.destroy();
  });

  it("handles container with zero focusable elements gracefully", async () => {
    const trap = focusTrap(container);

    await new Promise((r) => queueMicrotask(() => r(undefined)));

    expect(container.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(container);

    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    container.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(container);

    trap.destroy();
  });

  it("respects enabled option dynamically via update()", async () => {
    const btn = document.createElement("button");
    container.appendChild(btn);

    const trap = focusTrap(container, { enabled: false });
    await new Promise((r) => queueMicrotask(() => r(undefined)));

    expect(document.activeElement).toBe(outsideButton);

    trap.update({ enabled: true });
    await new Promise((r) => queueMicrotask(() => r(undefined)));

    expect(document.activeElement).toBe(btn);

    trap.destroy();
  });

  it("restores focus to previously active element on destroy", async () => {
    const btn = document.createElement("button");
    container.appendChild(btn);

    outsideButton.focus();
    expect(document.activeElement).toBe(outsideButton);

    const trap = focusTrap(container, { restoreFocus: true });
    await new Promise((r) => queueMicrotask(() => r(undefined)));

    expect(document.activeElement).toBe(btn);

    trap.destroy();
    expect(document.activeElement).toBe(outsideButton);
  });
});
