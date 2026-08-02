// @ts-expect-error
import { JSDOM } from "jsdom";

if (typeof globalThis.window === "undefined" || !globalThis.document?.body) {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });

  const win = dom.window as unknown as Record<string, unknown>;
  const targets = [globalThis, typeof global !== "undefined" ? global : globalThis];

  targets.forEach((target: Record<string, unknown>) => {
    target.window = win;
    if (win.Window) target.Window = win.Window;
    if (win.EventTarget) target.EventTarget = win.EventTarget;
    if (win.document) target.document = win.document;
    if (win.Node) target.Node = win.Node;
    if (win.Text) target.Text = win.Text;
    if (win.Comment) target.Comment = win.Comment;
    if (win.DocumentFragment) target.DocumentFragment = win.DocumentFragment;
    if (win.Element) target.Element = win.Element;
    if (win.HTMLElement) target.HTMLElement = win.HTMLElement;
    if (win.SVGElement) target.SVGElement = win.SVGElement;
    if (win.SVGSVGElement) target.SVGSVGElement = win.SVGSVGElement;
    if (win.HTMLInputElement) target.HTMLInputElement = win.HTMLInputElement;
    if (win.HTMLButtonElement) target.HTMLButtonElement = win.HTMLButtonElement;
    if (win.HTMLTableCellElement) target.HTMLTableCellElement = win.HTMLTableCellElement;
    if (win.HTMLMediaElement) target.HTMLMediaElement = win.HTMLMediaElement;
    if (win.HTMLFormElement) target.HTMLFormElement = win.HTMLFormElement;
    if (win.HTMLIFrameElement) target.HTMLIFrameElement = win.HTMLIFrameElement;
    if (win.HTMLSelectElement) target.HTMLSelectElement = win.HTMLSelectElement;
    if (win.HTMLTextAreaElement) target.HTMLTextAreaElement = win.HTMLTextAreaElement;
    if (win.HTMLOptionElement) target.HTMLOptionElement = win.HTMLOptionElement;
    if (win.Event) target.Event = win.Event;
    if (win.KeyboardEvent) target.KeyboardEvent = win.KeyboardEvent;
    if (win.MouseEvent) target.MouseEvent = win.MouseEvent;
    if (win.PointerEvent) target.PointerEvent = win.PointerEvent;
    if (win.CustomEvent) target.CustomEvent = win.CustomEvent;
    if (win.MutationObserver) target.MutationObserver = win.MutationObserver;
    try {
      target.navigator = win.navigator;
    } catch {}
    if (win.getComputedStyle) target.getComputedStyle = win.getComputedStyle;
    if (win.requestAnimationFrame) target.requestAnimationFrame = win.requestAnimationFrame;
    if (win.cancelAnimationFrame) target.cancelAnimationFrame = win.cancelAnimationFrame;
  });
}

if (!globalThis.CSS) {
  (globalThis as unknown as Record<string, unknown>).CSS = {
    escape: (str: string) => String(str).replace(/([^\w-])/g, "\\$1"),
  };
}

function fakeMatchMedia(_query: string) {
  let matches = false;
  const listeners = new Set<(e: { matches: boolean }) => void>();
  return {
    get matches() {
      return matches;
    },
    set matches(val: boolean) {
      matches = val;
    },
    addEventListener(evt: string, fn: (e: { matches: boolean }) => void) {
      if (evt === "change") listeners.add(fn);
    },
    removeEventListener(evt: string, fn: (e: { matches: boolean }) => void) {
      if (evt === "change") listeners.delete(fn);
    },
    dispatchEvent() {
      listeners.forEach((fn) => {
        fn({ matches });
      });
    },
  };
}

if (!globalThis.window?.matchMedia) {
  if (globalThis.window) {
    (globalThis.window as unknown as Record<string, unknown>).matchMedia = fakeMatchMedia;
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  class FakeResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = FakeResizeObserver;
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  class FakeIntersectionObserver {
    callback: (...args: unknown[]) => void;
    observedElements: unknown[] = [];
    constructor(cb: (...args: unknown[]) => void) {
      this.callback = cb;
    }
    observe(el: unknown) {
      this.observedElements.push(el);
    }
    unobserve(el: unknown) {
      this.observedElements = this.observedElements.filter((e) => e !== el);
    }
    disconnect() {
      this.observedElements = [];
    }
    trigger(entries: Array<{ target: unknown; isIntersecting: boolean }>) {
      this.callback(entries);
    }
  }
  (globalThis as unknown as Record<string, unknown>).IntersectionObserver =
    FakeIntersectionObserver;
}

if (typeof globalThis.MutationObserver === "undefined") {
  class FakeMutationObserver {
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  (globalThis as unknown as Record<string, unknown>).MutationObserver = FakeMutationObserver;
  if (globalThis.window) {
    (globalThis.window as unknown as Record<string, unknown>).MutationObserver =
      FakeMutationObserver;
  }
}
