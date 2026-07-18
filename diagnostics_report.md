# Forest Diagnostics Report

Generated on: 2026-07-18T19:15:40.287Z

| Check | Command | Status | Description |
|---|---|---|---|
| Biome Linter & Formatter | `npx @biomejs/biome check src` | ✅ PASS | Checks linting rules and code formatting |
| Svelte Check Native | `npx svelte-check-native --workspace .` | ✅ PASS | High-performance Rust-based type checker |
| Svelte Doctor | `npx svelte-doctor check` | ✅ PASS | Checks for security, dead code, and Svelte 5 patterns |
| Copy-Paste Detector (jscpd) | `npx jscpd src/lib` | ✅ PASS | Checks for duplicate blocks of code |
| Package Exports Linter (publint) | `npx publint` | ✅ PASS | Checks packaging format compatibility |

## Details

### Biome Linter & Formatter (✅ PASS)

```text
Checked 97 files in 158ms. No fixes applied.
Found 8 warnings.
```

### Svelte Check Native (✅ PASS)

```text
Loading svelte-check in workspace: /Users/andrebarlocher/Documents/Svelte/Forest
Getting Svelte diagnostics...

/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/molecules/ListRow.svelte:27:1
Warn: noninteractive element cannot have nonnegative tabIndex value
https://svelte.dev/e/a11y_no_noninteractive_tabindex (svelte)
26 | 
27 | <div
     ^^^^^^
28 |   class="list-row {className}"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/Dialog.svelte:41:3
Warn: Elements with the 'dialog' interactive role must have a tabindex value
https://svelte.dev/e/a11y_interactive_supports_focus (svelte)
40 |   <!-- Dialog box -->
41 |   <div
       ^^^^^^
42 |     class="dialog-wrapper"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/Drawer.svelte:32:3
Warn: Elements with the 'dialog' interactive role must have a tabindex value
https://svelte.dev/e/a11y_interactive_supports_focus (svelte)
31 |   <!-- Drawer panel (slides from right, has left wave seam) -->
32 |   <div
       ^^^^^^
33 |     class="drawer-panel {className}"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/CommandPalette.svelte:59:3
Warn: Elements with the 'dialog' interactive role must have a tabindex value
https://svelte.dev/e/a11y_interactive_supports_focus (svelte)
58 |   <!-- Palette container panel (descending from the top with bottom wave seam) -->
59 |   <div
       ^^^^^^
60 |     class="palette-panel {className}"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/CommandPalette.svelte:80:13
Warn: Avoid using autofocus
https://svelte.dev/e/a11y_autofocus (svelte)
79 |             bind:value={searchVal}
80 |             autofocus
                 ^^^^^^^^^
81 |           />


====================================
svelte-check-native found 0 errors and 5 warnings in 4 files
```

### Svelte Doctor (✅ PASS)

```text
svelte-doctor v0.3.3



  ⚠ CSS uses `!important` override (17)
    Remove `!important` and fix cascade ownership so styles remain predictable.
    src/lib/atoms/TableCell.svelte:62
    src/lib/organisms/Dialog.svelte:94,95,98,99
    src/lib/organisms/Drawer.svelte:90
    src/lib/organisms/Spine.svelte:310
    src/lib/templates/EditorView.svelte:294,295
    src/lib/templates/SpreadsheetView.svelte:358,359,443,448,454,455,474,538

  ⚠ Inline event handler allocates a new function reference (25)
    Pass a stable handler reference like `onclick={handleClick}` when no inline closure is required.
    src/lib/molecules/SegmentedControl.svelte:35
    src/lib/molecules/Tabs.svelte:37
    src/lib/organisms/CommandPalette.svelte:93
    src/lib/templates/EditorView.svelte:82,91,102,115,136,154,159,245
    src/lib/templates/SpreadsheetView.svelte:80,89,100,113,132,136,173,228,238,250,261,309
    src/routes/+page.svelte:95,101

  ⚠ Repeated allocation inside `$derived()` can churn memory and recomputation cost (5)
    Avoid allocating new arrays or objects in heavy `$derived()` blocks unless the allocation is required and bounded.
    src/lib/organisms/CommandPalette.svelte:31
    src/lib/templates/EditorView.svelte:62
    src/lib/templates/SpreadsheetView.svelte:40,41,44

  ⚠ Click handler on non-interactive element needs keyboard support (3)
    Add an `onkeydown` handler and `role="button"` + `tabindex="0"` for non-interactive elements with click handlers. Or better: use a `<button>` instead.
    src/lib/organisms/CommandPalette.svelte:51
    src/lib/organisms/Dialog.svelte:33
    src/lib/organisms/Drawer.svelte:24

  ⚠ Component has 312 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/Spine.svelte:1

  ⚠ $effect used to derive a single value — use $derived instead
    Replace `$effect(() => { x = expr })` with `const x = $derived(expr)` for better reactivity tracking and fewer re-runs.
    src/lib/templates/EditorView.svelte:57

  ⚠ Component has 337 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/EditorView.svelte:1

  ⚠ Component has 659 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/SpecimenView.svelte:1

  ⚠ Component has 472 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/SpreadsheetView.svelte:1

  ⚠ Dependency . appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/chunks/grWH-ndm.js:1

  ⚠ Dependency ../chunks appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/entry/app.CvrUKWAk.js:1

  ⚠ Dependency @sveltejs appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/exports.js:1

  ⚠ Dependency .. appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/internal.js:1

  ⚠ Dependency @sveltejs/kit appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/shared.js:1

  ⚠ Dependency @standard-schema appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/utils.js:1

  ⚠ Dependency ../.. appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/entries/pages/_error.svelte.js:1

  ⚠ Dependency $app appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/entries/pages/_error.svelte.js:1

  ⚠ Dependency ./chunks appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/env.js:1

  ⚠ Dependency ./nodes appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/manifest-full.js:1

  ⚠ Dependency ../entries appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/nodes/0.js:1


  ┌─────────────────────────────────────────────────┐
  │  Svelte Doctor  (svelte-doctor)           │
  │                                                 │
  │  Score: 46 / 100  Poor                          │
  │                                                 │
  │  ██████████████████░░░░░░░░░░░░░░░░░░░░░░       │
  │                                                 │
  │  ⚠ 66 warnings  21/166 files  1 fixable  1.7s   │
  └─────────────────────────────────────────────────┘
  Ignore suggestions: 11 diagnostics can likely be ignored.
  Potential bundle savings: 0KB.

  Category breakdown:
    Performance: 48 warnings  penalty 48.0
    Bundle Size: 11 warnings  penalty 7.7
    Architecture: 4 warnings  penalty 3.2
    Accessibility: 3 warnings  penalty 2.4

  Run svelte-doctor fix to auto-fix issues with an AI agent.
```

### Copy-Paste Detector (jscpd) (✅ PASS)

```text
[1mClone found (css)[22m
 - [1m[32matoms/Button.svelte:css[39m[22m [30:4 - 38:37] (9 lines, 74 tokens)
   molecules/EmptyState.svelte:css [93:11 - 101:37]
[1mClone found (css)[22m
 - [1m[32matoms/Button.svelte:css[39m[22m [38:36 - 45:4] (8 lines, 55 tokens)
   molecules/EmptyState.svelte:css [103:33 - 110:4]
[1mClone found (css)[22m
 - [1m[32matoms/Checkbox.svelte:css[39m[22m [36:3 - 52:4] (17 lines, 81 tokens)
   atoms/Radio.svelte:css [42:3 - 58:4]
[1mClone found (css)[22m
 - [1m[32matoms/Checkbox.svelte:css[39m[22m [36:3 - 52:4] (17 lines, 81 tokens)
   atoms/Switch.svelte:css [36:3 - 52:4]
[1mClone found (css)[22m
 - [1m[32matoms/Checkbox.svelte:css[39m[22m [52:10 - 65:19] (14 lines, 97 tokens)
   atoms/Radio.svelte:css [58:10 - 71:19]
[1mClone found (typescript)[22m
 - [1m[32matoms/Checkbox.svelte:typescript[39m[22m [2:3 - 15:9] (14 lines, 55 tokens)
   atoms/Switch.svelte:typescript [2:3 - 15:9]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [37:10 - 47:44] (11 lines, 119 tokens)
   atoms/Textarea.svelte:css [34:13 - 44:44]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [38:5 - 44:34] (7 lines, 79 tokens)
   atoms/Select.svelte:css [51:5 - 57:34]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [44:14 - 49:4] (6 lines, 54 tokens)
   atoms/Select.svelte:css [57:40 - 62:11]
[1mClone found (css)[22m
 - [1m[32mmolecules/DropdownMenu.svelte:css[39m[22m [46:15 - 52:21] (7 lines, 51 tokens)
   templates/SettingsTemplate.svelte:css [49:15 - 55:21]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/SegmentedControl.svelte:typescript[39m[22m [8:18 - 21:11] (14 lines, 53 tokens)
   molecules/Tabs.svelte:typescript [8:19 - 21:11]
[1mClone found (css)[22m
 - [1m[32mmolecules/Toast.svelte:css[39m[22m [81:5 - 89:49] (9 lines, 63 tokens)
   organisms/Drawer.svelte:css [102:5 - 110:49]
[1mClone found (css)[22m
 - [1m[32mtemplates/EditorView.svelte:css[39m[22m [261:3 - 318:7] (58 lines, 338 tokens)
   templates/SpreadsheetView.svelte:css [325:3 - 382:7]
[1mClone found (html)[22m
 - [1m[32mtemplates/EditorView.svelte:html[39m[22m [69:38 - 127:16] (59 lines, 319 tokens)
   templates/SpreadsheetView.svelte:html [67:27 - 125:16]
[1mClone found (html)[22m
 - [1m[32mtemplates/EditorView.svelte:html[39m[22m [245:13 - 377:9] (133 lines, 66 tokens)
   templates/SpreadsheetView.svelte:html [309:13 - 540:9]
[1mClone found (typescript)[22m
 - [1m[32mtemplates/EditorView.svelte:typescript[39m[22m [6:54 - 23:26] (18 lines, 73 tokens)
   templates/SpreadsheetView.svelte:typescript [5:48 - 22:26]
[90m┌────────────┬────────────────┬─────────────┬──────────────┬──────────────┬──────────────────┬───────────────────┐[39m
[90m│[39m[31m Format     [39m[90m│[39m[31m Files analyzed [39m[90m│[39m[31m Total lines [39m[90m│[39m[31m Total tokens [39m[90m│[39m[31m Clones found [39m[90m│[39m[31m Duplicated lines [39m[90m│[39m[31m Duplicated tokens [39m[90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m css        [90m│[39m 51             [90m│[39m 6196        [90m│[39m 21995        [90m│[39m 11           [90m│[39m 152 (2.45%)      [90m│[39m 1092 (4.96%)      [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m html       [90m│[39m 48             [90m│[39m 5969        [90m│[39m 10932        [90m│[39m 2            [90m│[39m 190 (3.18%)      [90m│[39m 385 (3.52%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m svelte     [90m│[39m 51             [90m│[39m 6113        [90m│[39m 25095        [90m│[39m 0            [90m│[39m 0 (0.00%)        [90m│[39m 0 (0.00%)         [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m typescript [90m│[39m 40             [90m│[39m 991         [90m│[39m 4772         [90m│[39m 3            [90m│[39m 43 (4.34%)       [90m│[39m 181 (3.79%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m [1mTotal:[22m     [90m│[39m 190            [90m│[39m 19269       [90m│[39m 62794        [90m│[39m 16           [90m│[39m 385 (2.00%)      [90m│[39m 1658 (2.64%)      [90m│[39m
[90m└────────────┴────────────────┴─────────────┴──────────────┴──────────────┴──────────────────┴───────────────────┘[39m
[90mFound 16 clones.[39m
[90mtime: 11.525ms[39m

[90m💡 Auto-refactor with AI: [1m[39mnpx skills add https://github.com/kucherenko/jscpd --skill dry-refactoring[90m[22m
[90m🎩 New: Gangsta Agents — discipline your AI coding → gangsta.page[39m
[90m💖 Support jscpd project → https://opencollective.com/jscpd[39m
```

### Package Exports Linter (publint) (✅ PASS)

```text
Running publint v0.3.21 for forest...
Packing files with `bun pack`...
Linting...
All good!
```

