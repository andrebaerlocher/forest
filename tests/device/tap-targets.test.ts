/**
 * Runs only in the "device" Vitest project (see vitest.config.ts): a real
 * Chromium tab at 375x812 with touch emulation, not jsdom. jsdom has no
 * layout engine, so it structurally cannot see an undersized tap target —
 * this is the lane that can. RESPONSIVE.md, Phase 0/2.
 *
 * It started at 35 violations and is now at 0. Treat a regression here as a
 * real one: the report names every offender, its classes and its measured
 * size, so it doubles as the punch list. An element that genuinely must stay
 * under 44px opts out via data-tap-target-exempt with a written reason.
 */
import { mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/lib/styles/forest.css";
import CasesPage from "../../src/routes/cases2/+page.svelte";
import TapTargetFixture from "./fixtures/TapTargetFixture.svelte";
import { formatViolationsReport, isExempt, measureTapTargets } from "./tap-target-helpers.ts";

describe("device viewport is genuinely coarse/touch, not a silently-fine pointer", () => {
  it("matches (pointer: coarse) and (hover: none) at a 375x812 phone size", () => {
    // If this block ever fails, nothing below it can be trusted: a test
    // that silently runs with a fine pointer is worse than no test.
    expect(window.innerWidth).toBe(375);
    expect(window.innerHeight).toBe(812);
    expect(window.matchMedia("(pointer: coarse)").matches).toBe(true);
    expect(window.matchMedia("(pointer: fine)").matches).toBe(false);
    expect(window.matchMedia("(hover: none)").matches).toBe(true);
    expect(window.matchMedia("(hover: hover)").matches).toBe(false);
    expect(navigator.maxTouchPoints).toBeGreaterThan(0);
    expect("ontouchstart" in window).toBe(true);
  });
});

describe("tap-target opt-out contract", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("flags an undersized control with no opt-out, and honors one with a written reason", () => {
    const instance = mount(TapTargetFixture, { target: container });
    try {
      const tiny = container.querySelector(".tiny");
      const exempt = container.querySelector(".tiny-exempt");
      const emptyExempt = container.querySelector(".tiny-empty-exempt");
      expect(tiny).not.toBeNull();
      expect(exempt).not.toBeNull();
      expect(emptyExempt).not.toBeNull();

      expect(isExempt(tiny as Element)).toBe(false);
      expect(isExempt(exempt as Element)).toBe(true);
      // An empty attribute value is not a justification — it must not count.
      expect(isExempt(emptyExempt as Element)).toBe(false);

      const violations = measureTapTargets(container);
      // Svelte adds a scoping hash class (e.g. "tiny svelte-xyz123"), so
      // match on individual class tokens rather than the raw class string.
      const classTokens = violations.flatMap((v) => v.className.split(/\s+/));
      expect(classTokens).toContain("tiny");
      expect(classTokens).toContain("tiny-empty-exempt");
      expect(classTokens).not.toContain("tiny-exempt");
    } finally {
      unmount(instance);
    }
  });
});

describe("case study page tap targets at 375x812 (phone, coarse pointer)", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("every interactive element measures >=44px in both axes, except documented opt-outs", () => {
    const instance = mount(CasesPage, { target: container });
    try {
      // Query from `document`, not just `container`: floating UI (Drawer,
      // Popover, DropdownMenu, ...) can portal content elsewhere in the body.
      const violations = measureTapTargets(document);
      if (violations.length > 0) {
        throw new Error(formatViolationsReport(violations));
      }
    } finally {
      unmount(instance);
    }
  });
});
