import fs from "node:fs";
import path from "node:path";
import { mount, unmount } from "svelte";
import { compile, compileModule } from "svelte/compiler";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

declare const Bun: {
  Transpiler: new (options: {
    loader: string;
  }) => {
    transformSync: (code: string) => string;
  };
};

const componentCache = new Map<string, string>();

async function getCompiledBlobUrl(filePath: string): Promise<string> {
  let absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    if (fs.existsSync(absPath.replace(/\.js$/, ".ts"))) {
      absPath = absPath.replace(/\.js$/, ".ts");
    } else if (fs.existsSync(`${absPath}.ts`)) {
      absPath = `${absPath}.ts`;
    }
  }

  if (componentCache.has(absPath)) {
    return componentCache.get(absPath)!;
  }

  let code = fs.readFileSync(absPath, "utf8");
  const dir = path.dirname(absPath);

  // Replace relative imports
  const relativeImportRegex = /import\s+([\s\S]*?)\s+from\s+['"](\..*?)['"]/g;
  const relMatches = Array.from(code.matchAll(relativeImportRegex));

  for (const match of relMatches) {
    const fullImport = match[0];
    const importPath = match[2];
    const targetAbsPath = path.resolve(dir, importPath);
    if (importPath.endsWith(".svelte") || importPath.includes(".svelte.")) {
      const childBlobUrl = await getCompiledBlobUrl(targetAbsPath);
      code = code.replace(fullImport, fullImport.replace(importPath, childBlobUrl));
    } else {
      const fileUrl = `file://${targetAbsPath}`;
      code = code.replace(fullImport, fullImport.replace(importPath, fileUrl));
    }
  }

  // Replace $lib imports
  const libRegex = /import\s+([\s\S]*?)\s+from\s+['"]\$lib\/(.*?)['"]/g;
  const libMatches = Array.from(code.matchAll(libRegex));
  for (const match of libMatches) {
    const fullImport = match[0];
    const importPath = match[2];
    const targetAbsPath = path.resolve("src/lib", importPath);
    if (importPath.endsWith(".svelte") || importPath.includes(".svelte.")) {
      const childBlobUrl = await getCompiledBlobUrl(targetAbsPath);
      code = code.replace(fullImport, fullImport.replace(`$lib/${importPath}`, childBlobUrl));
    } else {
      const fileUrl = `file://${targetAbsPath}`;
      code = code.replace(fullImport, fullImport.replace(`$lib/${importPath}`, fileUrl));
    }
  }

  let jsCode: string;
  if (absPath.includes(".svelte.")) {
    const transpiler = new (globalThis as unknown as { Bun: typeof Bun }).Bun.Transpiler({
      loader: "ts",
    });
    const transpiled = transpiler.transformSync(code);
    const compiled = compileModule(transpiled, {
      filename: absPath,
      generate: "client",
      dev: false,
    });
    jsCode = compiled.js.code;
  } else {
    const compiled = compile(code, {
      filename: absPath,
      generate: "client",
      dev: false,
    });
    jsCode = compiled.js.code;
  }

  const blob = new Blob([jsCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  componentCache.set(absPath, url);
  return url;
}

async function mountComponent(
  relativePath: string,
  options: { target: HTMLElement; props?: Record<string, unknown> },
) {
  const url = await getCompiledBlobUrl(relativePath);
  const mod = await import(url);
  return mount(mod.default as Parameters<typeof mount>[0], options as Parameters<typeof mount>[1]);
}

describe("SplitPane component tests", () => {
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

  it("renders separator gutter with correct ARIA attributes", async () => {
    const instance = await mountComponent("src/lib/organisms/SplitPane.svelte", {
      target: container,
      props: {
        split: 40,
        min: 15,
        max: 85,
        direction: "horizontal",
      },
    });

    const gutter = container.querySelector("[role='separator']");
    expect(gutter).not.toBeNull();
    expect(gutter?.getAttribute("aria-valuenow")).toBe("40");
    expect(gutter?.getAttribute("aria-valuemin")).toBe("15");
    expect(gutter?.getAttribute("aria-valuemax")).toBe("85");
    expect(gutter?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(gutter?.getAttribute("tabindex")).toBe("0");

    unmount(instance);
  });

  it("adjusts split ratio on keyboard navigation", async () => {
    const onchange = vi.fn();
    const instance = await mountComponent("src/lib/organisms/SplitPane.svelte", {
      target: container,
      props: {
        split: 50,
        min: 10,
        max: 90,
        direction: "horizontal",
        onchange,
      },
    });

    const gutter = container.querySelector<HTMLElement>("[role='separator']");
    expect(gutter).not.toBeNull();

    if (gutter) {
      const arrowLeft = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true });
      gutter.dispatchEvent(arrowLeft);
    }

    expect(onchange).toHaveBeenCalledWith(49);
    unmount(instance);
  });

  it("removes pointer event listeners on unmount without throwing", async () => {
    const instance = await mountComponent("src/lib/organisms/SplitPane.svelte", {
      target: container,
      props: {
        split: 50,
      },
    });

    expect(() => unmount(instance)).not.toThrow();
  });
});
