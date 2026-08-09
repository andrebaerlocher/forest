## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: storybook, mcp

---

# CLAUDE.md — Forest Component Library

This handbook details the tech stack, critical commands, and guidelines for the Forest design system component library.

## Tech Stack
- **Framework**: SvelteKit 2+ (Svelte 5 Runes)
- **Preview & Docs**: Storybook 10
- **Linter & Formatter**: Biome
- **Duplication Checker**: jscpd
- **Diagnostics**: svelte-check-native & svelte-doctor
- **Testing**: Vitest & Playwright

## Critical Commands

### Setup & Run
- **Install dependencies**: `bun install`
- **Run dev preview app**: `bun run dev`
- **Run Storybook environment**: `bun run storybook`

### Build & Package
- **Build SvelteKit app**: `bun run build`
- **Package library (compile src/lib -> dist)**: `bun run prepack` (runs svelte-package + publint)

### Checks & Testing
- **Unified diagnostics**: `bun run diagnose` (runs all checks and outputs `diagnostics_report.md`)
- **Lint & format check**: `bun run lint` (`biome check src`)
- **Auto-format code**: `bun run format` (`biome format --write src`)
- **Svelte Native type check**: `bun run check:native` (`svelte-check-native --workspace .`)
- **Svelte Doctor check**: `bun run check:doctor` (`svelte-doctor check`)
- **Copy-Paste detection**: `bun run check:cpd` (`jscpd src/lib`)
- **Unit & Storybook tests**: `bun test` or `bun run test`

---

## Coding Conventions & Guidelines

### Svelte 5 Runes
- Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`) instead of legacy Svelte 4 reactivity syntax (`let` bindings, `$:`, `export let`).
- Declare component properties using TypeScript interfaces named `Props`.
- Avoid default exports for files except Svelte components.

### Styling & CSS (A Forest System)
- **OKLCH Colors**: Maintain ink ladder and paper materials using OKLCH colors. Never rotate the paper surfaces (`--canvas`, `--raised`) or accent/status colors. Theming is done solely by rotating `--hue` (e.g. indigo=282, pine=165).
- **Aesthetic integrity**:
  - No shadows at rest. Shadow (`--shadow-drag`) only exists during drag events or temporary drawer displays.
  - Transparent-border box model: Ensure borders are always present (e.g., `border: 1.5px solid transparent`) so adding state rings doesn't shift pixels.
  - Svelte transitions are strictly for transient entering/exiting elements (e.g., fly/fade). Persistent components move instantly or via CSS transitions.
- **Scrollbars**: Apply the thin/custom scrollbar styles to scrolling containers (`scrollbar-color: var(--scroll-thumb) transparent`).
