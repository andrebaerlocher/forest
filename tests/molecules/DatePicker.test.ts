import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import DatePicker from "$lib/molecules/DatePicker.svelte";

describe("DatePicker component tests", () => {
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

  const field = () =>
    container.querySelector<HTMLInputElement>("input.date-input") as HTMLInputElement;

  async function type(text: string) {
    const input = field();
    input.focus();
    await tick();
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.blur();
    await tick();
  }

  function mountPicker(props: Record<string, unknown> = {}) {
    const changes: string[] = [];
    const instance = mount(DatePicker, {
      target: container,
      props: { onchange: (v: string) => changes.push(v), ...props },
    });
    return { instance, changes };
  }

  describe("Swiss display format", () => {
    it("shows an ISO value as a Swiss date", () => {
      const { instance } = mountPicker({ value: "2026-08-14" });

      expect(field().value).toBe("14.08.2026");

      unmount(instance);
    });

    it("derives the placeholder from the locale", () => {
      const { instance } = mountPicker({ value: "" });
      expect(field().placeholder).toBe("DD.MM.YYYY");
      unmount(instance);

      const other = mountPicker({ value: "", locale: "en-GB" });
      expect(field().placeholder).toBe("DD/MM/YYYY");
      unmount(other.instance);
    });

    it("follows the locale's own field order", () => {
      const { instance } = mountPicker({ value: "2026-08-14", locale: "en-GB" });
      expect(field().value).toBe("14/08/2026");
      unmount(instance);
    });

    it("keeps the bound value in ISO whatever the display format", async () => {
      const { instance, changes } = mountPicker({ value: "" });

      await type("25.12.2026");

      expect(changes).toEqual(["2026-12-25"]);

      unmount(instance);
    });
  });

  describe("typed entry", () => {
    it("accepts a date typed without separators", async () => {
      const { instance, changes } = mountPicker({ value: "" });
      await type("25122026");
      expect(changes).toEqual(["2026-12-25"]);
      unmount(instance);
    });

    it("expands a two-digit year", async () => {
      const { instance, changes } = mountPicker({ value: "" });
      await type("25.12.26");
      expect(changes).toEqual(["2026-12-25"]);
      unmount(instance);
    });

    it("accepts whatever separator was typed", async () => {
      const { instance, changes } = mountPicker({ value: "" });
      await type("25/12/2026");
      expect(changes).toEqual(["2026-12-25"]);
      unmount(instance);
    });

    it("still accepts an ISO string", async () => {
      const { instance, changes } = mountPicker({ value: "" });
      await type("2026-12-25");
      expect(changes).toEqual(["2026-12-25"]);
      unmount(instance);
    });

    it("clears on an empty field", async () => {
      const { instance, changes } = mountPicker({ value: "2026-08-14" });
      await type("");
      expect(changes).toEqual([""]);
      unmount(instance);
    });

    it("flags a date that does not exist and keeps the text to be corrected", async () => {
      const { instance, changes } = mountPicker({ value: "" });

      await type("31.02.2026");

      expect(changes).toEqual([]);
      expect(field().getAttribute("aria-invalid")).toBe("true");
      expect(field().value).toBe("31.02.2026");

      unmount(instance);
    });

    it("flags nonsense the same way", async () => {
      const { instance, changes } = mountPicker({ value: "" });
      await type("hello");
      expect(changes).toEqual([]);
      expect(field().getAttribute("aria-invalid")).toBe("true");
      unmount(instance);
    });
  });

  describe("calendar", () => {
    it("labels the weekdays unambiguously in German", async () => {
      const { instance } = mountPicker({ value: "2026-08-14" });

      field().focus();
      await tick();

      const weekdays = Array.from(container.querySelectorAll(".weekday")).map((el) =>
        el.textContent?.trim(),
      );
      // narrow would give M/D/M/D — Montag and Mittwoch collide
      expect(weekdays).toEqual(["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]);

      unmount(instance);
    });

    it("starts the week on Monday", async () => {
      const { instance } = mountPicker({ value: "2026-08-14" });

      field().focus();
      await tick();

      // 1 August 2026 is a Saturday, so Monday-first leaves five leading pads
      expect(container.querySelectorAll(".day-pad").length).toBe(5);

      unmount(instance);
    });

    it("names the month in the locale", async () => {
      const { instance } = mountPicker({ value: "2026-08-14" });

      field().focus();
      await tick();

      expect(container.querySelector(".month-label")?.textContent?.trim()).toBe("August 2026");

      unmount(instance);
    });

    it("emits ISO when a day is picked", async () => {
      const { instance, changes } = mountPicker({ value: "2026-08-14" });

      field().focus();
      await tick();

      const day15 = Array.from(container.querySelectorAll<HTMLButtonElement>("button.day")).find(
        (b) => b.textContent?.trim() === "15",
      );
      day15?.click();
      await tick();

      expect(changes).toEqual(["2026-08-15"]);
      expect(field().value).toBe("15.08.2026");

      unmount(instance);
    });
  });
});
