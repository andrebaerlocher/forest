/// <reference types="vitest/config" />
import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Two lanes, on purpose (see RESPONSIVE.md, "Verification — the lesson you
// already recorded"):
//
//   "unit"   — jsdom. Fast, but structurally blind to layout: it cannot see
//              an undersized tap target, a 100vh overflow, or a popover
//              behind a keyboard, because jsdom does not lay anything out.
//   "device" — a real Chromium tab (via the already-installed
//              @vitest/browser-playwright), pinned to a 375x812 phone
//              viewport with touch emulation, so `(pointer: coarse)` and
//              `(hover: none)` genuinely match instead of being stubbed.
//
// `extends: true` inherits the root config below (plugins, resolve/alias)
// so both projects share the same Svelte compile + $lib alias setup.
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
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./src/test-setup.ts"],
          include: ["tests/**/*.test.{ts,js,svelte.ts}", "src/**/*.test.{ts,js,svelte.ts}"],
          exclude: ["tests/device/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "device",
          include: ["tests/device/**/*.test.{ts,js}"],
          browser: {
            enabled: true,
            headless: true,
            ui: false,
            screenshotFailures: false,
            provider: playwright(),
            // `viewport` sizes Vitest's own tester frame (what `window.innerWidth`
            // reports inside the test); `contextOptions.viewport` sizes the
            // underlying Playwright BrowserContext/page. Both must say 375x812
            // — setting only one leaves the other at its own default (414x896).
            instances: [
              {
                browser: "chromium",
                viewport: { width: 375, height: 812 },
                provider: playwright({
                  contextOptions: {
                    viewport: { width: 375, height: 812 },
                    hasTouch: true,
                    isMobile: true,
                  },
                }),
              },
            ],
          },
        },
      },
    ],
  },
});
