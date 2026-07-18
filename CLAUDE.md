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
- **Install dependencies**: `npm install`
- **Run dev preview app**: `npm run dev`
- **Run Storybook environment**: `npm run storybook`

### Build & Package
- **Build SvelteKit app**: `npm run build`
- **Package library (compile src/lib -> dist)**: `npm run prepack` (runs svelte-package + publint)

### Checks & Testing
- **Unified diagnostics**: `npm run diagnose` (runs all checks and outputs `diagnostics_report.md`)
- **Lint & format check**: `npm run lint` (`biome check src`)
- **Auto-format code**: `npm run format` (`biome format --write src`)
- **Svelte Native type check**: `npm run check:native` (`svelte-check-native --workspace .`)
- **Svelte Doctor check**: `npm run check:doctor` (`svelte-doctor check`)
- **Copy-Paste detection**: `npm run check:cpd` (`jscpd src/lib`)
- **Unit & Storybook tests**: `npm run test` or `vitest`

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
