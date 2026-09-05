import { createRawSnippet, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import KanbanBoard from "$lib/organisms/KanbanBoard.svelte";

// mount() can't accept inline {#snippet} syntax, so this stands in for the
// run of <KanbanColumn> a real consumer passes as children.
const columnsSnippet = createRawSnippet(() => ({
  render: () =>
    '<div class="columns-stub"><div class="kanban-column">Backlog</div><div class="kanban-column">Done</div></div>',
}));

describe("KanbanBoard component tests", () => {
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

  it("renders the columns passed as children", () => {
    const instance = mount(KanbanBoard, {
      target: container,
      props: { children: columnsSnippet },
    });

    const columns = container.querySelectorAll(".kanban-column");
    expect(columns).toHaveLength(2);
    expect(columns[0].textContent).toBe("Backlog");
    expect(columns[1].textContent).toBe("Done");

    unmount(instance);
  });

  it("is the single scrolling element, labelled as a region", () => {
    const instance = mount(KanbanBoard, {
      target: container,
      props: { children: columnsSnippet, label: "Sprint board" },
    });

    // KanbanColumn carries no role of its own (KanbanColumn.svelte has a
    // plain <h3> heading, no landmark) — the board is the one labelled
    // region, and it is the same element that scrolls, following
    // CodeBlock's `.cs-codeblock-pre` rather than adding a wrapper.
    const board = container.querySelector(".kanban-board");
    expect(board).not.toBeNull();
    expect(board?.getAttribute("role")).toBe("region");
    expect(board?.getAttribute("aria-label")).toBe("Sprint board");
    expect(board?.querySelectorAll('[role="region"]')).toHaveLength(0);

    unmount(instance);
  });

  it("defaults the accessible name to 'Board'", () => {
    const instance = mount(KanbanBoard, {
      target: container,
      props: { children: columnsSnippet },
    });

    expect(container.querySelector(".kanban-board")?.getAttribute("aria-label")).toBe("Board");

    unmount(instance);
  });

  it("merges a caller class onto the scroll container and spreads restProps", () => {
    const instance = mount(KanbanBoard, {
      target: container,
      props: { children: columnsSnippet, class: "board-wide", "data-testid": "board" },
    });

    const board = container.querySelector(".kanban-board");
    expect(board?.classList.contains("board-wide")).toBe(true);
    expect(board?.getAttribute("data-testid")).toBe("board");

    unmount(instance);
  });

  // No isPhone()/matchMedia switch here on purpose: narrowing a column under
  // (pointer: coarse) is appearance, not DOM identity, so it stays pure CSS
  // on KanbanColumn (breakpoints.svelte.ts's rule) and this component adds
  // no JS-driven phone branch for the unit lane to exercise. The scroll-snap
  // and touch-action behaviour this component owns is only observable in a
  // real engine — that is what the `device` Vitest project is for.
});
