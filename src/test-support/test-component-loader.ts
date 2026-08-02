import fs from "node:fs";
import path from "node:path";
import { mount } from "svelte";
import { compile, compileModule } from "svelte/compiler";

declare const Bun: {
  Transpiler: new (options: {
    loader: string;
  }) => {
    transformSync: (code: string) => string;
  };
};

const componentCache = new Map<string, Promise<string>>();
const svelteClientPath = path.resolve("node_modules/svelte/src/index-client.js");

export async function getCompiledBlobUrl(filePath: string): Promise<string> {
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

  let resolveUrl!: (url: string) => void;
  const promise = new Promise<string>((resolve) => {
    resolveUrl = resolve;
  });
  componentCache.set(absPath, promise);

  let code = fs.readFileSync(absPath, "utf8");
  const dir = path.dirname(absPath);

  const importRegex = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null = importRegex.exec(code);
  const replacements: Array<{ full: string; replacement: string }> = [];

  while (match !== null) {
    const [fullImport, importClause, importPath] = match;
    if (importPath === "svelte") {
      replacements.push({
        full: fullImport,
        replacement: `import ${importClause} from ${JSON.stringify(svelteClientPath)};`,
      });
    } else if (importPath.startsWith(".")) {
      const targetAbsPath = path.resolve(dir, importPath);
      if (importPath.endsWith(".svelte") || importPath.includes(".svelte.")) {
        let resolvedTarget = targetAbsPath;
        if (
          !fs.existsSync(resolvedTarget) &&
          resolvedTarget.endsWith(".js") &&
          fs.existsSync(resolvedTarget.replace(/\.js$/, ".ts"))
        ) {
          resolvedTarget = resolvedTarget.replace(/\.js$/, ".ts");
        }
        if (resolvedTarget === absPath) {
          replacements.push({
            full: fullImport,
            replacement: `// self reference`,
          });
        } else {
          const childBlobUrl = await getCompiledBlobUrl(resolvedTarget);
          replacements.push({
            full: fullImport,
            replacement: `import ${importClause} from ${JSON.stringify(childBlobUrl)};`,
          });
        }
      } else {
        let resolvedTarget = targetAbsPath;
        if (
          !fs.existsSync(resolvedTarget) &&
          resolvedTarget.endsWith(".js") &&
          fs.existsSync(resolvedTarget.replace(/\.js$/, ".ts"))
        ) {
          resolvedTarget = resolvedTarget.replace(/\.js$/, ".ts");
        }
        const fileUrl = `file://${resolvedTarget}`;
        replacements.push({
          full: fullImport,
          replacement: `import ${importClause} from ${JSON.stringify(fileUrl)};`,
        });
      }
    }
    match = importRegex.exec(code);
  }

  for (const { full, replacement } of replacements) {
    code = code.replace(full, replacement);
  }

  let jsCode: string;
  if (absPath.includes(".svelte.")) {
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
    jsCode = compiled.js.code;
  } else {
    const compiled = compile(code, {
      filename: absPath,
      generate: "client",
      dev: false,
    });
    jsCode = compiled.js.code;
  }

  const componentName = path.basename(absPath, ".svelte");
  if (code.includes("// self reference")) {
    jsCode += `\nvar ${componentName} = ${componentName}_1 || ${componentName};\n`;
  }

  const blob = new Blob([jsCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  resolveUrl(url);
  return url;
}

export async function mountComponent(
  relativePath: string,
  options: { target: HTMLElement; props?: Record<string, unknown> },
) {
  const absPath = path.resolve(relativePath);
  const url = await getCompiledBlobUrl(absPath);
  const mod = await import(url);
  return mount(mod.default as Parameters<typeof mount>[0], options as Parameters<typeof mount>[1]);
}
