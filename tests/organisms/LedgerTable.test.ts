import { createRawSnippet, mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import LedgerTable from "$lib/organisms/LedgerTable.svelte";

// Minimal snippets — mount() can't accept inline {#snippet} syntax, so these
// stand in for the real ones a consumer passes as props.
const headersSnippet = createRawSnippet(() => ({
  render: () => "<tr><th>Garden</th></tr>",
}));

const rowsSnippet = createRawSnippet(() => ({
  render: () => "<tr><td>Eastern ridge</td></tr>",
}));

const summarySnippet = createRawSnippet(() => ({
  render: () => "<tr><td>Sum</td></tr>",
}));

describe("LedgerTable component tests", () => {
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

  it("wraps the table in its own horizontal scroll region", () => {
    const instance = mount(LedgerTable, { target: container, props: {} });

    const scroller = container.querySelector(".ledger-scroll");
    expect(scroller).not.toBeNull();
    expect(scroller?.querySelector("table.ledger")).not.toBeNull();

    unmount(instance);
  });

  it("still renders headers, rows and summary through their snippets", () => {
    const instance = mount(LedgerTable, {
      target: container,
      props: {
        headers: headersSnippet,
        rows: rowsSnippet,
        summary: summarySnippet,
      },
    });

    expect(container.querySelector("thead")?.textContent).toContain("Garden");
    expect(container.querySelector("tbody")?.textContent).toContain("Eastern ridge");
    expect(container.querySelector("tfoot")?.textContent).toContain("Sum");

    unmount(instance);
  });
});
