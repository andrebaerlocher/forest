import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollspy } from "$lib/actions/scrollspy.js";
import { setupDOM } from "../../src/test-support/test-dom.ts";

setupDOM();

describe("scrollspy action", () => {
  let nav: HTMLElement;
  let sec1: HTMLElement;
  let sec2: HTMLElement;
  let observerCallback: (entries: Array<{ target: HTMLElement; isIntersecting: boolean }>) => void;
  let observedElements: HTMLElement[];
  let disconnected: boolean;

  beforeEach(() => {
    document.body.replaceChildren();
    nav = document.createElement("nav");
    sec1 = document.createElement("section");
    sec1.id = "sec1";
    sec2 = document.createElement("section");
    sec2.id = "sec2";

    document.body.appendChild(nav);
    document.body.appendChild(sec1);
    document.body.appendChild(sec2);

    observedElements = [];
    disconnected = false;

    class MockIntersectionObserver {
      root = null;
      rootMargin = "";
      thresholds = [];

      constructor(callback: (entries: unknown[]) => void) {
        observerCallback = callback as (
          entries: Array<{ target: HTMLElement; isIntersecting: boolean }>,
        ) => void;
      }

      observe(target: HTMLElement) {
        observedElements.push(target);
      }

      unobserve(target: HTMLElement) {
        observedElements = observedElements.filter((el) => el !== target);
      }

      disconnect() {
        disconnected = true;
        observedElements = [];
      }

      takeRecords() {
        return [];
      }
    }

    (globalThis as unknown as Record<string, unknown>).IntersectionObserver =
      MockIntersectionObserver;
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("observes elements matching provided IDs", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    expect(observedElements).toContain(sec1);
    expect(observedElements).toContain(sec2);

    action.destroy();
  });

  it("emits first visible section ID when elements intersect", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    observerCallback([{ target: sec2, isIntersecting: true }]);

    expect(onchange).toHaveBeenLastCalledWith("sec2");

    action.destroy();
  });

  it("prioritizes document order when multiple sections intersect", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    observerCallback([
      { target: sec2, isIntersecting: true },
      { target: sec1, isIntersecting: true },
    ]);

    expect(onchange).toHaveBeenLastCalledWith("sec1");

    action.destroy();
  });

  it("uses fallback active calculation when no sections intersect", () => {
    const onchange = vi.fn();
    vi.spyOn(sec1, "getBoundingClientRect").mockReturnValue({
      top: -10,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(sec2, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    observerCallback([{ target: sec1, isIntersecting: false }]);

    expect(onchange).toHaveBeenLastCalledWith("sec1");

    action.destroy();
  });

  it("returns null in fallback active calculation when all sections are below threshold", () => {
    const onchange = vi.fn();
    vi.spyOn(sec1, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(sec2, "getBoundingClientRect").mockReturnValue({
      top: 700,
      bottom: 800,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    expect(onchange).toHaveBeenLastCalledWith(null);

    action.destroy();
  });

  it("emits null when section IDs list is empty", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: [], onchange });

    expect(onchange).toHaveBeenCalledWith(null);

    action.destroy();
  });

  it("updates observed elements when options change", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: ["sec1"], onchange });

    expect(observedElements).toContain(sec1);
    expect(observedElements).not.toContain(sec2);

    action.update({ ids: ["sec1", "sec2"], onchange });

    expect(observedElements).toContain(sec1);
    expect(observedElements).toContain(sec2);

    action.destroy();
  });

  it("disconnects observer on action destroy", () => {
    const onchange = vi.fn();
    const action = scrollspy(nav, { ids: ["sec1", "sec2"], onchange });

    expect(disconnected).toBe(false);
    action.destroy();
    expect(disconnected).toBe(true);
  });
});
