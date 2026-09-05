import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BenchmarkRow } from "$lib/domain.js";
import BenchmarkTable from "$lib/organisms/BenchmarkTable.svelte";

describe("BenchmarkTable component tests", () => {
  let container: HTMLDivElement;

  const rows: BenchmarkRow[] = [
    { label: "Database query", value: 42 },
    { label: "Recommendation scoring", value: 89 },
    { label: "Serialization", value: 18, detail: "gzip" },
  ];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("renders the ledger with one row per benchmark", () => {
    const instance = mount(BenchmarkTable, {
      target: container,
      props: { rows, unit: "µs" },
    });

    expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(container.textContent).toContain("42µs");

    unmount(instance);
  });

  it("renders a total row in the ledger's tfoot", () => {
    const instance = mount(BenchmarkTable, {
      target: container,
      props: { rows, unit: "µs", total: { label: "Total", value: 149 } },
    });

    expect(container.querySelector("tfoot tr.sum")?.textContent).toContain("149µs");

    unmount(instance);
  });

  describe("card mode (phone)", () => {
    // isPhone() reads window.matchMedia(MQ.shell) inside an $effect; stubbing
    // the global is the same technique tests/breakpoints.test.svelte.ts uses
    // to flip it to true.
    beforeEach(() => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }));
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("stacks each row into a card, label above value", async () => {
      const instance = mount(BenchmarkTable, {
        target: container,
        props: { rows, unit: "µs" },
      });
      await tick();

      const cards = container.querySelectorAll(".benchmark-card");
      expect(cards).toHaveLength(3);
      expect(cards[0].querySelector(".card-title")?.textContent).toContain("Database query");
      expect(cards[0].querySelector(".card-value")?.textContent).toContain("42µs");

      unmount(instance);
    });

    it("keeps a row's detail with its card", async () => {
      const instance = mount(BenchmarkTable, {
        target: container,
        props: { rows, unit: "µs" },
      });
      await tick();

      const cards = container.querySelectorAll(".benchmark-card");
      expect(cards[2].querySelector(".detail")?.textContent).toBe("gzip");

      unmount(instance);
    });

    it("renders the total as its own marked card", async () => {
      const instance = mount(BenchmarkTable, {
        target: container,
        props: { rows, unit: "µs", total: { label: "Total", value: 149 } },
      });
      await tick();

      const total = container.querySelector(".benchmark-card.total-card");
      expect(total?.querySelector(".card-title")?.textContent).toContain("Total");
      expect(total?.querySelector(".card-value")?.textContent).toContain("149µs");

      unmount(instance);
    });

    it("hides the underlying ledger's scroll wrapper rather than unmounting it", async () => {
      const instance = mount(BenchmarkTable, {
        target: container,
        props: { rows, unit: "µs" },
      });
      await tick();

      // Exactly one copy of the data exists as a table; CSS (not tested
      // here) hides it at the shell breakpoint so it never doubles up in
      // the accessibility tree alongside the cards.
      expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
      expect(container.querySelectorAll(".benchmark-card")).toHaveLength(3);

      unmount(instance);
    });
  });
});
