import fs from "node:fs";
import path from "node:path";
import { mount } from "svelte";
import { compile, compileModule } from "svelte/compiler";

const cacheDir = path.resolve("node_modules/.cache/svelte-test");

function ensureCacheDir() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
}

export async function getCompiledFilePath(filePath: string): Promise<string> {
  ensureCacheDir();
  let absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    if (fs.existsSync(absPath.replace(/\.js$/, ".ts"))) {
      absPath = absPath.replace(/\.js$/, ".ts");
    } else if (fs.existsSync(`${absPath}.ts`)) {
      absPath = `${absPath}.ts`;
    }
  }

  const relPath = path.relative(path.resolve("src"), absPath).replace(/[/\\]/g, "_");
  const cacheFilePath = path.join(cacheDir, `${relPath}.js`);

  const code = fs.readFileSync(absPath, "utf8");

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

  // Replace $lib imports with relative path from cacheFilePath to src/lib
  const libDir = path.resolve("src/lib");
  let relLib = path.relative(cacheDir, libDir).replace(/\\/g, "/");
  if (!relLib.startsWith(".")) relLib = `./${relLib}`;
  jsCode = jsCode.replace(
    /import\s+([\s\S]*?)\s+from\s+['"]\$lib\/(.*?)['"]/g,
    `import $1 from '${relLib}/$2'`,
  );

  // Replace relative imports from original component dir to cacheFilePath
  const compDir = path.dirname(absPath);
  let relCompDir = path.relative(cacheDir, compDir).replace(/\\/g, "/");
  if (!relCompDir.startsWith(".")) relCompDir = `./${relCompDir}`;
  jsCode = jsCode.replace(
    /import\s+([\s\S]*?)\s+from\s+['"](\..*?)['"]/g,
    `import $1 from '${relCompDir}/$2'`,
  );

  fs.writeFileSync(cacheFilePath, jsCode);
  return cacheFilePath;
}

export async function mountComponent(
  relativePath: string,
  options: { target: HTMLElement; props?: Record<string, unknown> },
) {
  const targetFile = await getCompiledFilePath(relativePath);
  const mod = await import(targetFile);
  return mount(mod.default as Parameters<typeof mount>[0], options as Parameters<typeof mount>[1]);
}
