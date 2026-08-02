import fs from "node:fs";
import path from "node:path";
import { mount, unmount } from "svelte";
import { compile, compileModule } from "svelte/compiler";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupDOM } from "../test-support/test-dom.ts";
import { BP, MQ } from "./breakpoints.js";

const absPath = path.resolve("src/lib/breakpoints.svelte.ts");
let code = fs.readFileSync(absPath, "utf8");
code = code.replace(
  /from\s+['"]\.\/breakpoints\.js['"]/g,
  `from "file://${path.resolve("src/lib/breakpoints.js")}"`,
);
const transpiler = new (
  globalThis as unknown as {
    Bun: {
      Transpiler: new (opts: { loader: string }) => { transformSync: (code: string) => string };
    };
  }
).Bun.Transpiler({ loader: "ts" });
const transpiled = transpiler.transformSync(code);
const compiled = compileModule(transpiled, {
  filename: absPath,
  generate: "client",
  dev: false,
});
const blob = new Blob([compiled.js.code], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
const mod = await import(url);

const { mediaQuery, isPhone, isCoarsePointer } = mod;

describe("breakpoints module", () => {
  let listeners: Set<(e: { matches: boolean }) => void>;
  let mockMatches: boolean;

  beforeEach(() => {
    setupDOM();
    listeners = new Set();
    mockMatches = false;

    (globalThis as unknown as Record<string, { matchMedia: unknown }>).window.matchMedia = vi
      .fn()
      .mockImplementation((query: string) => ({
        get matches() {
          return mockMatches;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (evt: string, fn: (e: { matches: boolean }) => void) => {
          if (evt === "change") listeners.add(fn);
        },
        removeEventListener: (evt: string, fn: (e: { matches: boolean }) => void) => {
          if (evt === "change") listeners.delete(fn);
        },
        dispatchEvent: vi.fn(),
      }));
  });

  it("exports accurate BP numerical values and MQ query strings", () => {
    expect(BP.field).toBe(600);
    expect(BP.shell).toBe(760);
    expect(BP.split).toBe(1100);
    expect(BP.wide).toBe(1440);

    expect(MQ.shell).toBe("(max-width: 760px)");
    expect(MQ.shellUp).toBe("(min-width: 761px)");
    expect(MQ.split).toBe("(max-width: 1100px)");
    expect(MQ.splitUp).toBe("(min-width: 1101px)");
    expect(MQ.coarse).toBe("(pointer: coarse)");
  });

  it("mediaQuery initializes with current = false for SSR/hydration safety", async () => {
    const dummySvelte = `<script>
      import { mediaQuery } from "${url}";
      export let mq = mediaQuery("(max-width: 760px)");
    </script>`;
    const compiledDummy = compile(dummySvelte, { generate: "client" });
    const dummyBlob = new Blob([compiledDummy.js.code], { type: "application/javascript" });
    const dummyUrl = URL.createObjectURL(dummyBlob);
    const dummyMod = await import(dummyUrl);

    const div = document.createElement("div");
    const inst = mount(dummyMod.default, { target: div });
    expect(inst).toBeDefined();
    unmount(inst);
  });

  it("isPhone and isCoarsePointer helper functions invoke matchMedia with correct MQ", async () => {
    const dummySvelte = `<script>
      import { isPhone, isCoarsePointer } from "${url}";
      export let phone = isPhone();
      export let coarse = isCoarsePointer();
    </script>`;
    const compiledDummy = compile(dummySvelte, { generate: "client" });
    const dummyBlob = new Blob([compiledDummy.js.code], { type: "application/javascript" });
    const dummyUrl = URL.createObjectURL(dummyBlob);
    const dummyMod = await import(dummyUrl);

    const div = document.createElement("div");
    const inst = mount(dummyMod.default, { target: div });
    await new Promise((r) => setTimeout(r, 10));
    expect(
      (globalThis as unknown as Record<string, { matchMedia: unknown }>).window.matchMedia,
    ).toHaveBeenCalledWith(MQ.shell);
    expect(
      (globalThis as unknown as Record<string, { matchMedia: unknown }>).window.matchMedia,
    ).toHaveBeenCalledWith(MQ.coarse);
    unmount(inst);
  });
});
