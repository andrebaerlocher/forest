import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Stepper from "$lib/organisms/Stepper.svelte";

describe("Stepper genuine Svelte 5 component interaction tests", () => {
  let container: HTMLDivElement;

  const testSteps = [
    { id: "poc", label: "PoC: Sommer\n'24", detail: "Phase 1" },
    { id: "proto", label: "Prototyp:\nHerbst/Winter\n'24", detail: "Phase 2" },
    { id: "start", label: "Projektstart:\nJanuar '25" },
    { id: "golive", label: "Go-Live: Sommer\n'27" },
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

  it("renders stepper landmark and all steps", async () => {
    const instance = mount(Stepper, {
      target: container,
      props: {
        steps: testSteps,
        activeId: "start",
        completedIds: ["poc", "proto"],
      },
    });

    const nav = container.querySelector("nav.stepper");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("Progress");
    expect(nav?.getAttribute("data-orientation")).toBe("horizontal");

    const steps = container.querySelectorAll(".stepper-step");
    expect(steps.length).toBe(4);

    expect(steps[0].classList.contains("state-complete")).toBe(true);
    expect(steps[1].classList.contains("state-complete")).toBe(true);
    expect(steps[2].classList.contains("state-current")).toBe(true);
    expect(steps[3].classList.contains("state-upcoming")).toBe(true);

    unmount(instance);
  });

  it("renders correct number of connectors (steps.length - 1)", async () => {
    const instance = mount(Stepper, {
      target: container,
      props: {
        steps: testSteps,
        activeId: "poc",
      },
    });

    const connectors = container.querySelectorAll(".stepper-connector");
    expect(connectors.length).toBe(3);

    unmount(instance);
  });

  it("supports interactive step clicking when onstepclick is provided", async () => {
    const onstepclick = vi.fn();

    const instance = mount(Stepper, {
      target: container,
      props: {
        steps: testSteps,
        activeId: "poc",
        onstepclick,
      },
    });

    const buttons = container.querySelectorAll<HTMLButtonElement>("button.stepper-content");
    expect(buttons.length).toBe(4);

    buttons[2].click();
    await tick();

    expect(onstepclick).toHaveBeenCalledWith("start");

    unmount(instance);
  });

  it("renders vertical orientation when requested", async () => {
    const instance = mount(Stepper, {
      target: container,
      props: {
        steps: testSteps,
        activeId: "poc",
        orientation: "vertical",
      },
    });

    const nav = container.querySelector("nav.stepper");
    expect(nav?.getAttribute("data-orientation")).toBe("vertical");

    unmount(instance);
  });
});
