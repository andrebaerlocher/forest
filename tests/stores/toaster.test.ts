import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createToaster } from "$lib/stores/toaster.svelte.js";

describe("toaster store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("pushes toast items with status and returns unique ID", () => {
    const t = createToaster();
    const id = t.push("Item 1");

    expect(typeof id).toBe("string");
    expect(id).toMatch(/^toast-/);
    expect(t.items.length).toBe(1);
    expect(t.items[0]).toEqual({
      id,
      message: "Item 1",
      status: "neutral",
      duration: 3500,
    });
  });

  it("supports status helper methods success, warning, danger", () => {
    const t = createToaster();
    t.success("Success message");
    t.warning("Warning message");
    t.danger("Danger message");

    expect(t.items.length).toBe(3);
    expect(t.items[0].status).toBe("success");
    expect(t.items[1].status).toBe("warning");
    expect(t.items[2].status).toBe("danger");
  });

  it("auto-dismisses toast after specified duration", () => {
    const t = createToaster();
    t.push("Short lived", { duration: 1000 });

    expect(t.items.length).toBe(1);
    vi.advanceTimersByTime(999);
    expect(t.items.length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(t.items.length).toBe(0);
  });

  it("enforces max toast count by dropping oldest item", () => {
    const t = createToaster({ max: 2 });
    t.push("Msg 1");
    t.push("Msg 2");
    t.push("Msg 3");

    expect(t.items.length).toBe(2);
    expect(t.items[0].message).toBe("Msg 2");
    expect(t.items[1].message).toBe("Msg 3");
  });

  it("allows manual dismissal of specific toast", () => {
    const t = createToaster();
    const id1 = t.push("Msg 1");
    const id2 = t.push("Msg 2");

    expect(t.items.length).toBe(2);
    t.dismiss(id1);
    expect(t.items.length).toBe(1);
    expect(t.items[0].id).toBe(id2);
  });

  it("pauses and resumes auto-dismiss timers", () => {
    const t = createToaster();
    const id = t.push("Pausable", { duration: 1000 });

    vi.advanceTimersByTime(500);
    t.pause(id);

    vi.advanceTimersByTime(2000);
    expect(t.items.length).toBe(1);

    t.resume(id);
    vi.advanceTimersByTime(1000);
    expect(t.items.length).toBe(0);
  });

  it("clears all toasts and timers on clear()", () => {
    const t = createToaster();
    t.push("Msg 1");
    t.push("Msg 2");
    t.push("Msg 3");

    expect(t.items.length).toBe(3);
    t.clear();
    expect(t.items.length).toBe(0);
  });
});
