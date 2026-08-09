import { tick } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BP, MQ } from "$lib/breakpoints.js";
import { isCoarsePointer, isPhone, mediaQuery } from "$lib/breakpoints.svelte.js";
import { setupDOM } from "../src/test-support/test-dom.ts";

describe("breakpoints module", () => {
  let listeners: Set<(e: { matches: boolean }) => void>;
  let mockMatches: boolean;

  beforeEach(() => {
    setupDOM();
    listeners = new Set();
    mockMatches = false;

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: mockMatches,
      media: query,
      onchange: null,
      addListener: (fn: (e: { matches: boolean }) => void) => listeners.add(fn),
      removeListener: (fn: (e: { matches: boolean }) => void) => listeners.delete(fn),
      addEventListener: (_evt: string, fn: (e: { matches: boolean }) => void) => listeners.add(fn),
      removeEventListener: (_evt: string, fn: (e: { matches: boolean }) => void) =>
        listeners.delete(fn),
      dispatchEvent: () => true,
    }));
  });

  it("exports BP pixel numbers matching design tokens", () => {
    expect(BP.field).toBe(600);
    expect(BP.shell).toBe(760);
    expect(BP.split).toBe(1100);
    expect(BP.wide).toBe(1440);
  });

  it("exports MQ media query strings", () => {
    expect(MQ.shell).toBe("(max-width: 760px)");
    expect(MQ.shellUp).toBe("(min-width: 761px)");
    expect(MQ.split).toBe("(max-width: 1100px)");
    expect(MQ.splitUp).toBe("(min-width: 1101px)");
    expect(MQ.coarse).toBe("(pointer: coarse)");
  });

  it("mediaQuery returns reactive getter returning matchMedia state inside effect root", async () => {
    mockMatches = true;
    let res = false;
    const cleanup = $effect.root(() => {
      const isShell = mediaQuery(MQ.shell);
      $effect(() => {
        res = isShell.current;
      });
    });
    await tick();
    expect(res).toBe(true);
    cleanup();
  });

  it("isPhone returns reactive getter checking shell query inside effect root", async () => {
    mockMatches = true;
    let res = false;
    const cleanup = $effect.root(() => {
      const phone = isPhone();
      $effect(() => {
        res = phone.current;
      });
    });
    await tick();
    expect(res).toBe(true);
    cleanup();
  });

  it("isCoarsePointer returns reactive getter checking coarse query inside effect root", async () => {
    mockMatches = true;
    let res = false;
    const cleanup = $effect.root(() => {
      const coarse = isCoarsePointer();
      $effect(() => {
        res = coarse.current;
      });
    });
    await tick();
    expect(res).toBe(true);
    cleanup();
  });
});
