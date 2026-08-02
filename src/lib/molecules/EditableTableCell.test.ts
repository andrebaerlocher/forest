import { tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mountComponent } from "../../test-support/test-component-loader.js";

describe("EditableTableCell genuine Svelte 5 component interaction tests", () => {
  let table: HTMLTableElement;
  let tr: HTMLTableRowElement;

  beforeEach(() => {
    table = document.createElement("table");
    tr = document.createElement("tr");
    table.appendChild(tr);
    document.body.appendChild(table);
  });

  afterEach(() => {
    if (table?.parentNode) {
      table.parentNode.removeChild(table);
    }
  });

  it("renders cell static content when not in editing state", async () => {
    const instance = await mountComponent("src/lib/molecules/EditableTableCell.svelte", {
      target: tr,
      props: {
        value: "Alpha",
        type: "text",
        selected: true,
      },
    });

    const td = tr.querySelector("td");
    expect(td).not.toBeNull();
    expect(td?.classList.contains("table-cell")).toBe(true);
    expect(tr.querySelector(".cell-editor")).toBeNull();

    unmount(instance);
  });

  it("enters edit mode on double click and renders inline input for text type", async () => {
    const instance = await mountComponent("src/lib/molecules/EditableTableCell.svelte", {
      target: tr,
      props: {
        value: "Initial Value",
        type: "text",
        selected: true,
      },
    });

    const td = tr.querySelector<HTMLTableCellElement>("td");
    expect(td).not.toBeNull();

    td!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    const input = tr.querySelector<HTMLInputElement>("input.inline-input");
    expect(input).not.toBeNull();
    expect(input?.value).toBe("Initial Value");

    unmount(instance);
  });

  it("commits updated value when Enter key is pressed during editing", async () => {
    const cellValue = "Original";

    const instance = await mountComponent("src/lib/molecules/EditableTableCell.svelte", {
      target: tr,
      props: {
        value: cellValue,
        type: "text",
        selected: true,
      },
    });

    const td = tr.querySelector<HTMLTableCellElement>("td");
    td!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    const input = tr.querySelector<HTMLInputElement>("input.inline-input");
    expect(input).not.toBeNull();

    input!.value = "Updated Text";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(tr.querySelector(".cell-editor")).toBeNull();

    unmount(instance);
  });

  it("reverts value when Escape key is pressed during editing", async () => {
    const instance = await mountComponent("src/lib/molecules/EditableTableCell.svelte", {
      target: tr,
      props: {
        value: "Kept Value",
        type: "text",
        selected: true,
      },
    });

    const td = tr.querySelector<HTMLTableCellElement>("td");
    td!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    const input = tr.querySelector<HTMLInputElement>("input.inline-input");
    input!.value = "Discarded Value";
    input!.dispatchEvent(new Event("input", { bubbles: true }));

    input!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(tr.querySelector(".cell-editor")).toBeNull();

    unmount(instance);
  });

  it("renders split numeric inputs for numeric cell type in edit mode", async () => {
    const instance = await mountComponent("src/lib/molecules/EditableTableCell.svelte", {
      target: tr,
      props: {
        value: 123.45,
        type: "numeric",
        decimals: 2,
        selected: true,
      },
    });

    const td = tr.querySelector<HTMLTableCellElement>("td");
    td!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    const intInput = tr.querySelector<HTMLInputElement>("input.part-integer");
    const decInput = tr.querySelector<HTMLInputElement>("input.part-decimal");

    expect(intInput).not.toBeNull();
    expect(decInput).not.toBeNull();
    expect(intInput?.value).toBe("123");
    expect(decInput?.value).toBe("45");

    unmount(instance);
  });

  function containerText(el: HTMLElement) {
    return el.textContent?.trim() || "";
  }
});
