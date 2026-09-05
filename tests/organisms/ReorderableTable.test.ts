import { createRawSnippet, mount, tick, unmount } from "svelte";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { TableReorder } from "$lib/domain.js";
import ReorderableTable from "$lib/organisms/ReorderableTable.svelte";

// Minimal snippets — mount() can't accept inline {#snippet} syntax, so these
// stand in for what a consumer passes as `footer`/`cardFooter` props. Same
// technique tests/organisms/LedgerTable.test.ts uses.
const cardFooterSnippet = createRawSnippet(() => ({
  render: () => '<div>Subtotal: <span class="num">1,920</span></div>',
}));

const tableFooterSnippet = createRawSnippet(() => ({
  render: () => "<tr><td>Subtotal: 1,920</td></tr>",
}));

interface Line {
  id: string;
  description: string;
  total: number;
}

describe("ReorderableTable component tests", () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    // jsdom implements no pointer capture; the component only ever asks the
    // handle to hold the pointer, so no-ops are faithful enough here.
    // jsdom's own setPointerCapture throws for an id it never issued, so these
    // replace it outright rather than filling a gap.
    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
    proto.setPointerCapture = () => {};
    proto.releasePointerCapture = () => {};
    proto.hasPointerCapture = () => false;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  const columns = [
    { key: "description", label: "Description", primary: true },
    { key: "total", label: "Total", type: "numeric" as const },
  ];

  const rows: Line[] = [
    { id: "a", description: "Consulting", total: 1200 },
    { id: "b", description: "Hosting", total: 240 },
    { id: "c", description: "Support", total: 480 },
  ];

  /** The first data cell of every row, top to bottom. */
  function order(): string[] {
    return Array.from(container.querySelectorAll("tbody tr")).map(
      (tr) => tr.querySelectorAll("td")[1]?.textContent?.trim() ?? "",
    );
  }

  const handles = () => Array.from(container.querySelectorAll<HTMLButtonElement>("button.handle"));

  function mountTable(props: Record<string, unknown> = {}) {
    const events: TableReorder<Line>[] = [];
    const instance = mount(ReorderableTable, {
      target: container,
      props: {
        columns,
        rows: [...rows],
        // `mount` can't infer the component's Row generic from a props bag,
        // so the callback arrives widened to `object`.
        onreorder: (e: TableReorder<object>) => {
          events.push(e as TableReorder<Line>);
        },
        ...props,
      },
    });
    return { instance, events };
  }

  /**
   * The row refs land on the first flush after mount, so anything that reads
   * geometry in the same tick would measure nothing. A real pointer never gets
   * there that fast; the test has to wait for what the browser gives for free.
   */
  async function mountAndSettle(props: Record<string, unknown> = {}) {
    const mounted = mountTable(props);
    await tick();
    return mounted;
  }

  async function press(handle: HTMLButtonElement, key: string) {
    handle.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    await tick();
  }

  it("renders every row with a labelled drag handle", () => {
    const { instance } = mountTable();

    expect(order()).toEqual(["Consulting", "Hosting", "Support"]);
    expect(handles().map((h) => h.getAttribute("aria-label"))).toEqual([
      "Reorder Consulting",
      "Reorder Hosting",
      "Reorder Support",
    ]);

    unmount(instance);
  });

  it("does not offer sorting — the order is the data", () => {
    const { instance } = mountTable();

    expect(container.querySelectorAll("th button").length).toBe(0);
    expect(container.querySelector("th[aria-sort]")).toBeNull();

    unmount(instance);
  });

  describe("keyboard reordering", () => {
    it("picks a row up on Space and marks the handle pressed", async () => {
      const { instance } = mountTable();

      await press(handles()[0], " ");

      expect(handles()[0].getAttribute("aria-pressed")).toBe("true");
      expect(container.querySelector("[aria-live]")?.textContent).toContain("Consulting");

      unmount(instance);
    });

    it("moves the grabbed row with the arrow keys", async () => {
      const { instance, events } = mountTable();

      await press(handles()[0], " ");
      await press(handles()[0], "ArrowDown");

      expect(order()).toEqual(["Hosting", "Consulting", "Support"]);
      expect(events).toHaveLength(1);
      expect(events[0].from).toBe(0);
      expect(events[0].to).toBe(1);
      expect(events[0].rows.map((r) => r.id)).toEqual(["b", "a", "c"]);

      unmount(instance);
    });

    it("keeps moving the same row across successive presses", async () => {
      const { instance } = mountTable();

      await press(handles()[0], " ");
      await press(handles()[1], "ArrowDown");
      await press(handles()[2], "ArrowDown");

      expect(order()).toEqual(["Hosting", "Support", "Consulting"]);

      unmount(instance);
    });

    /**
     * Moving a row relocates its DOM node, and a real browser blurs the
     * focused handle on the way out — jsdom does not, so the blur is sent by
     * hand here. Without the guard in the component, that blur drops the grab
     * and every arrow press after the first does nothing.
     */
    it("survives the blur that relocating the row causes", async () => {
      const { instance } = await mountAndSettle();

      await press(handles()[0], " ");

      // The move and the blur it provokes both land before the refocus
      // completes, so they are dispatched in one synchronous run here.
      const handle = handles()[0];
      handle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      handle.dispatchEvent(new FocusEvent("blur"));
      await tick();

      expect(handles()[1].getAttribute("aria-pressed")).toBe("true");

      await press(handles()[1], "ArrowDown");

      expect(order()).toEqual(["Hosting", "Support", "Consulting"]);

      unmount(instance);
    });

    it("refuses to move past either end", async () => {
      const { instance, events } = mountTable();

      await press(handles()[0], " ");
      await press(handles()[0], "ArrowUp");

      expect(order()).toEqual(["Consulting", "Hosting", "Support"]);
      expect(events).toHaveLength(0);

      unmount(instance);
    });

    it("restores the original order on Escape", async () => {
      const { instance } = mountTable();

      await press(handles()[0], " ");
      await press(handles()[1], "ArrowDown");
      expect(order()).toEqual(["Hosting", "Consulting", "Support"]);

      await press(handles()[1], "Escape");

      expect(order()).toEqual(["Consulting", "Hosting", "Support"]);
      expect(handles()[0].getAttribute("aria-pressed")).toBe("false");

      unmount(instance);
    });

    it("drops the row on a second Space", async () => {
      const { instance } = mountTable();

      await press(handles()[0], " ");
      await press(handles()[0], " ");

      expect(handles()[0].getAttribute("aria-pressed")).toBe("false");
      expect(container.querySelector("[aria-live]")?.textContent).toContain("Dropped");

      unmount(instance);
    });
  });

  describe("pointer reordering", () => {
    /**
     * jsdom has no layout, so every row reports offsetTop 0 and the stubbed
     * offsetHeight. That collapses the geometry to "any downward drag lands
     * last, any upward drag lands first" — enough to prove the drag wires up
     * and commits, not enough to prove the arithmetic. The keyboard cases
     * above cover the actual index maths.
     */
    function drag(handle: HTMLButtonElement, deltaY: number) {
      handle.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientY: 0 }));
      handle.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientY: deltaY }));
      handle.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientY: deltaY }));
    }

    it("commits a downward drag", async () => {
      const { instance, events } = await mountAndSettle();

      drag(handles()[0], 500);
      await tick();

      expect(order()).toEqual(["Hosting", "Support", "Consulting"]);
      expect(events[0].from).toBe(0);
      expect(events[0].to).toBe(2);

      unmount(instance);
    });

    it("commits an upward drag", async () => {
      const { instance, events } = await mountAndSettle();

      drag(handles()[2], -500);
      await tick();

      expect(order()).toEqual(["Support", "Consulting", "Hosting"]);
      expect(events[0].to).toBe(0);

      unmount(instance);
    });

    it("emits nothing when the row is dropped where it started", async () => {
      const { instance, events } = await mountAndSettle();

      drag(handles()[1], 0);
      await tick();

      expect(order()).toEqual(["Consulting", "Hosting", "Support"]);
      expect(events).toHaveLength(0);

      unmount(instance);
    });
  });

  describe("when reordering is off", () => {
    it("disables the handles on the disabled prop", () => {
      const { instance } = mountTable({ disabled: true });
      expect(handles().every((h) => h.disabled)).toBe(true);
      unmount(instance);
    });

    it("disables the handle when there is nothing to reorder against", () => {
      const { instance } = mountTable({ rows: [rows[0]] });
      expect(handles()[0].disabled).toBe(true);
      unmount(instance);
    });

    it("ignores a keypress on a disabled table", async () => {
      const { instance, events } = mountTable({ disabled: true });

      await press(handles()[0], " ");

      expect(handles()[0].getAttribute("aria-pressed")).toBe("false");
      expect(events).toHaveLength(0);

      unmount(instance);
    });
  });

  it("shows the empty state instead of a bare table", () => {
    const { instance } = mountTable({ rows: [] });

    expect(container.querySelectorAll("tbody tr").length).toBe(0);
    expect(container.querySelector(".table-state")).not.toBeNull();

    unmount(instance);
  });

  it("formats cells through the column formatter", () => {
    const { instance } = mountTable({
      columns: [
        { key: "description", label: "Description", primary: true },
        {
          key: "total",
          label: "Total",
          type: "numeric",
          format: (v: unknown) => `CHF ${Number(v).toFixed(2)}`,
        },
      ],
    });

    expect(container.querySelector("tbody tr")?.querySelectorAll("td")[2]?.textContent).toContain(
      "CHF 1200.00",
    );

    unmount(instance);
  });

  describe("card mode (phone)", () => {
    // isPhone() reads window.matchMedia(MQ.shell) inside an $effect; stubbing
    // the global (rather than jsdom's own matchMedia) is the same technique
    // tests/breakpoints.test.svelte.ts uses to flip it to true.
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

    const cards = () => Array.from(container.querySelectorAll<HTMLLIElement>(".row-card"));
    const moveButtons = (card: HTMLLIElement, label: string) =>
      Array.from(card.querySelectorAll<HTMLButtonElement>("button.move-btn")).find((b) =>
        b.getAttribute("aria-label")?.endsWith(label),
      );

    it("renders a card per row instead of the table", async () => {
      const { instance } = await mountAndSettle();

      expect(cards()).toHaveLength(3);
      expect(cards()[0].textContent).toContain("Consulting");

      unmount(instance);
    });

    it("moves a row with the down button and disables it at the last position", async () => {
      const { instance, events } = await mountAndSettle();

      const down = moveButtons(cards()[0], "down");
      down?.click();
      await tick();

      expect(order()).toEqual(["Hosting", "Consulting", "Support"]);
      expect(events).toHaveLength(1);
      expect(events[0].from).toBe(0);
      expect(events[0].to).toBe(1);

      // Consulting is now last; its own down button is disabled.
      const movedDown = moveButtons(cards()[2], "down");
      expect(movedDown?.disabled).toBe(true);

      unmount(instance);
    });

    it("moves a row with the up button and reuses the same move() as the keyboard path", async () => {
      const { instance } = await mountAndSettle();

      const up = moveButtons(cards()[2], "up");
      up?.click();
      await tick();

      expect(order()).toEqual(["Consulting", "Support", "Hosting"]);
      expect(container.querySelector("[aria-live]")?.textContent).toContain("Support");

      unmount(instance);
    });

    it("disables the first row's up button and the last row's down button", async () => {
      const { instance } = await mountAndSettle();

      expect(moveButtons(cards()[0], "up")?.disabled).toBe(true);
      expect(moveButtons(cards()[2], "down")?.disabled).toBe(true);
      expect(moveButtons(cards()[0], "down")?.disabled).toBe(false);
      expect(moveButtons(cards()[2], "up")?.disabled).toBe(false);

      unmount(instance);
    });

    it("labels each move button with the row it acts on", async () => {
      const { instance } = await mountAndSettle();

      expect(moveButtons(cards()[1], "up")?.getAttribute("aria-label")).toBe("Move Hosting up");
      expect(moveButtons(cards()[1], "down")?.getAttribute("aria-label")).toBe("Move Hosting down");

      unmount(instance);
    });

    it("disables both buttons when there is nothing to reorder against", async () => {
      const { instance } = await mountAndSettle({ rows: [rows[0]] });

      const card = cards()[0];
      expect(moveButtons(card, "up")?.disabled).toBe(true);
      expect(moveButtons(card, "down")?.disabled).toBe(true);

      unmount(instance);
    });

    describe("cardFooter", () => {
      it("renders the card-shaped totals as a sibling of the card list, not a card", async () => {
        const { instance } = await mountAndSettle({
          cardFooter: cardFooterSnippet,
        });

        const footer = container.querySelector(".card-footer");
        expect(footer?.textContent).toContain("Subtotal: 1,920");
        // Not another .row-card — a totals line isn't a reorderable row.
        expect(footer?.closest(".row-card")).toBeNull();
        expect(container.querySelectorAll(".row-card")).toHaveLength(3);

        unmount(instance);
      });

      it("renders nothing when cardFooter is not passed", async () => {
        const { instance } = await mountAndSettle();

        expect(container.querySelector(".card-footer")).toBeNull();

        unmount(instance);
      });

      it("stays hidden when there are no rows, same as the table footer", async () => {
        const { instance } = await mountAndSettle({
          rows: [],
          cardFooter: cardFooterSnippet,
        });

        expect(container.querySelector(".card-footer")).toBeNull();

        unmount(instance);
      });

      it("leaves footer-only consumers without totals on a phone, same as before this prop existed", async () => {
        const { instance } = await mountAndSettle({
          footer: tableFooterSnippet,
        });

        expect(container.querySelector(".card-footer")).toBeNull();
        // The table (and its tfoot) still exist in the DOM, just display:none
        // below the shell breakpoint — jsdom doesn't apply that media query,
        // so this only proves no card-mode fallback was invented, not that
        // the table is visually hidden (the CSS itself covers that).
        expect(container.querySelector("tfoot")).not.toBeNull();

        unmount(instance);
      });
    });
  });
});
