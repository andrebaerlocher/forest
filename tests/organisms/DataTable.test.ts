import { mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import DataTable from "$lib/organisms/DataTable.svelte";

describe("DataTable component tests", () => {
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

  const columns = [
    { key: "name", label: "Name", primary: true, sortable: true },
    { key: "role", label: "Role" },
  ];

  const rows = [
    { id: "1", name: "Alice", role: "Engineer" },
    { id: "2", name: "Bob", role: "Designer" },
  ];

  it("renders table headers and row items", async () => {
    const instance = mount(DataTable, {
      target: container,
      props: {
        columns,
        rows,
        rowKey: "id",
      },
    });

    const headers = container.querySelectorAll("th");
    expect(headers.length).toBeGreaterThan(0);

    const items = container.querySelectorAll("tr, .data-table-card");
    expect(items.length).toBeGreaterThan(0);

    unmount(instance);
  });

  it("provides dynamic aria-label to row selection checkboxes when selectable", async () => {
    const instance = mount(DataTable, {
      target: container,
      props: {
        columns,
        rows,
        rowKey: "id",
        selectable: true,
      },
    });

    const checkboxes = container.querySelectorAll<HTMLInputElement>("input[type='checkbox']");
    const rowCheckboxes = Array.from(checkboxes).filter((cb) =>
      cb.getAttribute("aria-label")?.startsWith("Select row"),
    );
    expect(rowCheckboxes.length).toBe(2);
    expect(rowCheckboxes[0].getAttribute("aria-label")).toBe("Select row Alice");
    expect(rowCheckboxes[1].getAttribute("aria-label")).toBe("Select row Bob");

    unmount(instance);
  });

  it("renders empty state when rows array is empty", async () => {
    const instance = mount(DataTable, {
      target: container,
      props: {
        columns,
        rows: [],
        emptyTitle: "No records found",
      },
    });

    const emptyText = container.textContent;
    expect(emptyText).toContain("No records found");

    unmount(instance);
  });

  it("activates threshold virtualization for large row sets and renders virtual spacers", async () => {
    const largeRows = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      role: i % 2 === 0 ? "Engineer" : "Designer",
    }));

    const instance = mount(DataTable, {
      target: container,
      props: {
        columns,
        rows: largeRows,
        rowKey: "id",
        threshold: 50,
      },
    });

    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows.length).toBeLessThan(100);

    const virtualSpacer = container.querySelector("tr.virtual-spacer, li.virtual-spacer");
    expect(virtualSpacer).not.toBeNull();

    unmount(instance);
  });
});
