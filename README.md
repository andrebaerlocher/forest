# A Forest — Component Library

![Svelte 5](https://img.shields.io/badge/Svelte-v5-FF3E00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Package%20Manager-fbf0df?logo=bun&logoColor=black)
![Storybook](https://img.shields.io/badge/Storybook-v10-FF4785?logo=storybook&logoColor=white)
![Biome](https://img.shields.io/badge/Code%20Style-Biome-60A5FA?logo=biome&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, unstyled Svelte 5 component library built with CSS design tokens, built-in accessibility focus management, and an Atomic Design architecture.

---

## Key Features

- **Svelte 5 Native**: Built from the ground up leveraging Svelte 5 runes, snippets, and type-safe exports.
- **Atomic Design Architecture**: Cleanly categorized components (`atoms`, `molecules`, `organisms`, `templates`).
- **Single-Number Theming**: Rotate `--hue` on `:root` (e.g. indigo 282, pine 165, oxblood 20, slate 250) to instantly transform the theme.
- **Accessible Focus Management**: Built-in `focusTrap` action for dialogs, drawers, command palettes, and custom surfaces.
- **Toast Queue System**: Push toasts from anywhere using `toaster` and render them cleanly with `ToastRegion`.
- **Dark / Ink Paper Scopes**: Scope dark surfaces with `.on-ink` (or `PaperTexture`) to flip canvas tokens automatically.

---

## Component Architecture (Atomic Design)

Components inside `src/lib/` are structured according to Atomic Design principles:

| Directory            | Scope                                 | Examples                                       |
| -------------------- | ------------------------------------- | ---------------------------------------------- |
| `src/lib/atoms/`     | Primitives & singular visual elements | `Button.svelte`, `Input.svelte`, `Wave.svelte` |
| `src/lib/molecules/` | Simple compositions of 2+ atoms       | `FormField.svelte`, `Slip.svelte`              |
| `src/lib/organisms/` | Complex structural combinations       | `LedgerTable.svelte`, `Spine.svelte`           |
| `src/lib/templates/` | High-level page layout grids & shells | `Shell.svelte`                                 |

---

## Installation & Setup

### 1. Install the Package

```sh
bun add forest
# or via npm / pnpm / yarn:
# npm install forest
```

### 2. Import CSS Design Tokens

The components rely on token stylesheet CSS variables (`--hue`, `--ink-*`, `--wave-mask-*`). Import it once at your application root:

```js
import "forest/styles/forest.css";
```

### 3. Using Components & Types

Import components directly from the package root:

```js
import { DataTable, Combobox, StatusPill } from "forest";
```

Prop types and domain shapes are exported alongside components so they never drift:

```ts
import type { DataTableProps, DataTableColumn, Command, Status } from "forest";
```

---

## Usage Examples

### Toast System

Toasts queue automatically rather than replacing one another. Place `<ToastRegion />` once in your layout and trigger toasts anywhere:

```svelte
<script>
  import { ToastRegion, toaster } from 'forest';
</script>

<ToastRegion />

<button onclick={() => toaster.success('Saved to the ledger')}>
  Save Entry
</button>
```

### Focus Management & Accessibility

Surfaces like `Dialog`, `Drawer`, and `CommandPalette` automatically trap `Tab` navigation while open and return focus to the trigger element when closed.

You can also use the exported `focusTrap` action on custom surfaces:

```svelte
<script>
  import { focusTrap } from 'forest';
</script>

<div use:focusTrap>
  <input type="text" placeholder="Search..." />
  <button>Submit</button>
</div>
```

### Theming & Ink Scopes

Customize theme hues and modes directly on `:root`:

```css
:root {
  --hue: 165; /* Pine: 165, Indigo: 282, Oxblood: 20, Slate: 250 */
}
```

Set dark/light mode and density on the same element:

```html
<html data-mode="dark" data-density="compact"></html>
```

Any component placed on dark paper (e.g. `Spine`, `Drawer`, `CommandPalette`) automatically flips canvas tokens when inside an `.on-ink` scope or `PaperTexture` component.

---

## Local Development & Scripts

| Command            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `bun dev`          | Starts the Vite development showcase server            |
| `bun storybook`    | Launches Storybook component workspace on port `6006`  |
| `bun run check`    | Runs Svelte compiler and TypeScript type checks        |
| `bun run lint`     | Runs Biome linter across `src/`                        |
| `bun run format`   | Formats code with Biome                                |
| `bun run test`     | Runs unit test suite via Vitest                        |
| `bun run diagnose` | Runs consolidated project quality & conformance checks |
| `bun run build`    | Builds package distribution outputs (`dist/`)          |

> Note: Template initialization details and `sv create` setup commands are archived in [BOILERPLATE.md](file:///Users/andrebarlocher/Documents/Svelte/Forest/BOILERPLATE.md).

---

## License

This project is licensed under the [MIT License](LICENSE).
