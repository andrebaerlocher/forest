import fs from "node:fs";
import path from "node:path";
import { mount, unmount } from "svelte";
import { compile, compileModule } from "svelte/compiler";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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

  // Replace relative imports (e.g. .svelte, .svelte.js, .ts, .js)
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
    const instance = await mountComponent("src/lib/organisms/DataTable.svelte", {
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
    const instance = await mountComponent("src/lib/organisms/DataTable.svelte", {
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
    const instance = await mountComponent("src/lib/organisms/DataTable.svelte", {
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

    const instance = await mountComponent("src/lib/organisms/DataTable.svelte", {
      target: container,
      props: {
        columns,
        rows: largeRows,
        rowKey: "id",
        threshold: 50,
      },
    });

    const bodyRows = container.querySelectorAll("tbody tr");
    // Visible rows should be sliced (overscan buffer ~15 rows) rather than all 100 rows
    expect(bodyRows.length).toBeLessThan(100);

    const virtualSpacer = container.querySelector("tr.virtual-spacer, li.virtual-spacer");
    expect(virtualSpacer).not.toBeNull();

    unmount(instance);
  });
});
