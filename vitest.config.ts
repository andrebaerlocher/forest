/// <reference types="vitest/config" />
import path from "node:path";
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
  ],
  resolve: {
    conditions: ["browser"],
    alias: {
      $lib: path.resolve(__dirname, "./src/lib"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["tests/**/*.test.{ts,js,svelte.ts}", "src/**/*.test.{ts,js,svelte.ts}"],
  },
});
