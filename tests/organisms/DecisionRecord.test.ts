import { mount, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import DecisionRecord from "$lib/organisms/DecisionRecord.svelte";

describe("DecisionRecord component", () => {
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

  it("renders only consequences when gains/costs are not provided", () => {
    const instance = mount(DecisionRecord, {
      target: container,
      props: {
        id: "adr-1",
        title: "Test Decision",
        context: "Context text",
        decision: "Decision text",
        consequences: ["Neutral consequence 1", "Neutral consequence 2"],
      },
    });

    const ledger = container.querySelector(".ledger");
    expect(ledger).toBeNull();

    const consequencesList = container.querySelector(".consequences");
    expect(consequencesList).not.toBeNull();
    expect(consequencesList?.querySelectorAll("li").length).toBe(2);

    unmount(instance);
  });

  it("renders only gains and costs when consequences are not provided", () => {
    const instance = mount(DecisionRecord, {
      target: container,
      props: {
        id: "adr-2",
        title: "Test Decision 2",
        context: "Context text",
        decision: "Decision text",
        gains: ["Gain item 1"],
        costs: ["Cost item 1"],
      },
    });

    const ledger = container.querySelector(".ledger");
    expect(ledger).not.toBeNull();
    expect(container.querySelector(".ledger-list.gain")).not.toBeNull();
    expect(container.querySelector(".ledger-list.cost")).not.toBeNull();

    const consequencesList = container.querySelector(".consequences");
    expect(consequencesList).toBeNull();

    unmount(instance);
  });

  it("renders consequences as a Neutral column in ledger when gains/costs and consequences are both provided", () => {
    const instance = mount(DecisionRecord, {
      target: container,
      props: {
        id: "adr-3",
        title: "PostgreSQL vs. Polyglot",
        context: "Context text",
        decision: "Single Postgres DB",
        gains: ["Massive Reduktion der Komplexität"],
        costs: ["Keine Graph-Query-Sprache"],
        consequences: [
          "Nutzung nativer Postgres-Features reicht aus",
          "Load-Testing in Produktion vor Auslagerung",
        ],
      },
    });

    const ledger = container.querySelector(".ledger");
    expect(ledger).not.toBeNull();
    expect(container.querySelector(".ledger-list.gain")).not.toBeNull();
    expect(container.querySelector(".ledger-list.cost")).not.toBeNull();

    const neutralLabel = container.querySelector(".ledger-label.neutral");
    expect(neutralLabel).not.toBeNull();
    expect(neutralLabel?.textContent).toBe("Neutral");

    const neutralList = container.querySelector(".ledger-list.neutral");
    expect(neutralList).not.toBeNull();
    expect(neutralList?.querySelectorAll("li").length).toBe(2);

    unmount(instance);
  });
});
