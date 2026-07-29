# Forest Diagnostics Report

Generated on: 2026-07-26T20:43:03.876Z

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
Checked 125 files in 95ms. No fixes applied.
Found 5 warnings.
```

### Svelte Check Native (✅ PASS)

```text
1785098584855 START "/Users/andrebarlocher/Documents/Svelte/Forest"
1785098584855 WARNING "src/lib/molecules/ListRow.svelte" 35:1 "noninteractive element cannot have nonnegative tabIndex value\nhttps://svelte.dev/e/a11y_no_noninteractive_tabindex"
1785098584855 COMPLETED 173 FILES 0 ERRORS 1 WARNINGS 1 FILES_WITH_PROBLEMS
```

### Svelte Doctor (✅ PASS)

```text
svelte-doctor v0.3.3



  ⚠ Repeated allocation inside `$derived()` can churn memory and recomputation cost (15)
    Avoid allocating new arrays or objects in heavy `$derived()` blocks unless the allocation is required and bounded.
    src/lib/atoms/Avatar.svelte:22
    src/lib/molecules/Combobox.svelte:40
    src/lib/molecules/DatePicker.svelte:51,56,65
    src/lib/organisms/CommandPalette.svelte:34
    src/lib/organisms/DataTable.svelte:59,60
    src/lib/templates/CrmView.svelte:96,102,115
    src/lib/templates/EditorView.svelte:66
    src/lib/templates/SpreadsheetView.svelte:44,45,48

  ⚠ CSS uses `!important` override (21)
    Remove `!important` and fix cascade ownership so styles remain predictable.
    src/lib/atoms/TableCell.svelte:69
    src/lib/organisms/Dialog.svelte:85,86,89,90
    src/lib/organisms/Drawer.svelte:135,140
    src/lib/organisms/Spine.svelte:386,441
    src/lib/templates/CrmView.svelte:346,347
    src/lib/templates/EditorView.svelte:313,314
    src/lib/templates/SpreadsheetView.svelte:384,385,492,499,521,522,541,605

  ⚠ Inline event handler allocates a new function reference (57)
    Pass a stable handler reference like `onclick={handleClick}` when no inline closure is required.
    src/lib/molecules/Combobox.svelte:134,161,162,163
    src/lib/molecules/DatePicker.svelte:115,116,127,131,147
    src/lib/molecules/SegmentedControl.svelte:32
    src/lib/molecules/Tabs.svelte:34
    src/lib/molecules/Tooltip.svelte:49,51
    src/lib/organisms/CommandPalette.svelte:115,116
    src/lib/organisms/DataTable.svelte:118,149,155,189,203,224,230
    src/lib/organisms/Spine.svelte:136
    src/lib/organisms/ToastRegion.svelte:27,28,29
    src/lib/templates/CrmView.svelte:138,149,165,185,200,205,217,255
    src/lib/templates/EditorView.svelte:86,95,106,122,143,161,166,178,264
    src/lib/templates/SpreadsheetView.svelte:83,92,103,119,138,145,157,194,250,262,276,287,335
    src/routes/+page.svelte:107

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`showDivider` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/ListRow.svelte:32

  ⚠ Component has 438 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/DataTable.svelte:1

  ⚠ Block nesting depth is 4 (max: 3).
    Extract nested sections into separate components to improve readability.
    src/lib/organisms/DataTable.svelte:127

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`flyX` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Drawer.svelte:31

  ⚠ Component has 416 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/Spine.svelte:1

  ⚠ Expensive work inside `$derived` can re-run frequently
    Precompute heavy parsing, sorting, regex construction, or long transform chains outside reactive derivations when possible.
    src/lib/templates/CrmView.svelte:102

  ⚠ Component has 437 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/CrmView.svelte:1

  ⚠ $effect used to derive a single value — use $derived instead
    Replace `$effect(() => { x = expr })` with `const x = $derived(expr)` for better reactivity tracking and fewer re-runs.
    src/lib/templates/EditorView.svelte:61

  ⚠ Component has 381 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/EditorView.svelte:1

  ⚠ Component has 750 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/SpecimenView.svelte:1

  ⚠ Component has 560 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/SpreadsheetView.svelte:1

  ⚠ Dependency . appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/chunks/DQqC4G4t.js:1

  ⚠ Dependency ../chunks appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/entry/app.Uuk_uNAs.js:1

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
  │  Score: 25 / 100  Poor                          │
  │                                                 │
  │  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
  │                                                 │
  │  ⚠ 115 warnings  29/194 files  1 fixable  2.0s  │
  └─────────────────────────────────────────────────┘
  Ignore suggestions: 11 diagnostics can likely be ignored.
  Potential bundle savings: 0KB.

  Category breakdown:
    Performance: 95 warnings  penalty 95.0
    Bundle Size: 11 warnings  penalty 7.7
    Architecture: 7 warnings  penalty 5.6
    State & Reactivity: 2 warnings  penalty 2.4

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
[1mClone found (css)[22m
 - [1m[32matoms/Checkbox.svelte:css[39m[22m [97:9 - 106:4] (10 lines, 150 tokens)
   atoms/Radio.svelte:css [101:9 - 110:4]
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
 - [1m[32matoms/Input.svelte:css[39m[22m [38:34 - 46:45] (9 lines, 89 tokens)
   molecules/DatePicker.svelte:css [171:39 - 178:55]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [44:14 - 49:4] (6 lines, 54 tokens)
   atoms/Select.svelte:css [57:40 - 62:11]
[1mClone found (css)[22m
 - [1m[32matoms/Select.svelte:css[39m[22m [50:21 - 57:34] (8 lines, 80 tokens)
   molecules/Combobox.svelte:css [193:16 - 200:34]
[1mClone found (css)[22m
 - [1m[32mmolecules/DropdownMenu.svelte:css[39m[22m [46:15 - 52:21] (7 lines, 51 tokens)
   templates/SettingsTemplate.svelte:css [49:15 - 55:21]
[1mClone found (css)[22m
 - [1m[32mmolecules/EmptyState.svelte:css[39m[22m [103:32 - 110:4] (8 lines, 56 tokens)
   molecules/ListRow.svelte:css [75:33 - 82:4]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/SegmentedControl.svelte:typescript[39m[22m [5:18 - 18:11] (14 lines, 53 tokens)
   molecules/Tabs.svelte:typescript [5:19 - 18:11]
[1mClone found (html)[22m
 - [1m[32morganisms/DataTable.svelte:html[39m[22m [147:15 - 152:17] (6 lines, 50 tokens)
   organisms/DataTable.svelte:html [228:15 - 233:17]
[1mClone found (css)[22m
 - [1m[32morganisms/Drawer.svelte:css[39m[22m [114:16 - 124:4] (11 lines, 160 tokens)
   organisms/Spine.svelte:css [174:29 - 184:6]
[1mClone found (css)[22m
 - [1m[32mtemplates/CrmView.svelte:css[39m[22m [322:3 - 368:4] (47 lines, 234 tokens)
   templates/EditorView.svelte:css [289:3 - 335:4]
[1mClone found (css)[22m
 - [1m[32mtemplates/CrmView.svelte:css[39m[22m [370:3 - 377:24] (8 lines, 58 tokens)
   templates/EditorView.svelte:css [338:3 - 345:24]
[1mClone found (css)[22m
 - [1m[32mtemplates/CrmView.svelte:css[39m[22m [451:3 - 485:4] (35 lines, 555 tokens)
   templates/EditorView.svelte:css [396:3 - 430:4]
[1mClone found (css)[22m
 - [1m[32mtemplates/CrmView.svelte:css[39m[22m [459:18 - 485:4] (27 lines, 425 tokens)
   templates/SpreadsheetView.svelte:css [612:17 - 638:4]
[1mClone found (html)[22m
 - [1m[32mtemplates/CrmView.svelte:html[39m[22m [135:65 - 148:19] (14 lines, 60 tokens)
   templates/EditorView.svelte:html [83:49 - 94:19]
[1mClone found (html)[22m
 - [1m[32mtemplates/CrmView.svelte:html[39m[22m [155:13 - 175:15] (21 lines, 92 tokens)
   templates/EditorView.svelte:html [112:13 - 132:15]
[1mClone found (html)[22m
 - [1m[32mtemplates/CrmView.svelte:html[39m[22m [199:70 - 214:10] (16 lines, 93 tokens)
   templates/EditorView.svelte:html [160:75 - 175:10]
[1mClone found (typescript)[22m
 - [1m[32mtemplates/CrmView.svelte:typescript[39m[22m [15:56 - 29:26] (15 lines, 58 tokens)
   templates/EditorView.svelte:typescript [9:58 - 23:26]
[1mClone found (css)[22m
 - [1m[32mtemplates/EditorView.svelte:css[39m[22m [280:3 - 337:7] (58 lines, 336 tokens)
   templates/SpreadsheetView.svelte:css [351:3 - 408:7]
[1mClone found (html)[22m
 - [1m[32mtemplates/EditorView.svelte:html[39m[22m [73:38 - 134:16] (62 lines, 330 tokens)
   templates/SpreadsheetView.svelte:html [70:27 - 131:16]
[1mClone found (html)[22m
 - [1m[32mtemplates/EditorView.svelte:html[39m[22m [264:13 - 431:9] (168 lines, 66 tokens)
   templates/SpreadsheetView.svelte:html [335:13 - 649:9]
[1mClone found (typescript)[22m
 - [1m[32mtemplates/EditorView.svelte:typescript[39m[22m [6:54 - 23:26] (18 lines, 73 tokens)
   templates/SpreadsheetView.svelte:typescript [6:48 - 23:26]
[90m┌────────────┬────────────────┬─────────────┬──────────────┬──────────────┬──────────────────┬───────────────────┐[39m
[90m│[39m[31m Format     [39m[90m│[39m[31m Files analyzed [39m[90m│[39m[31m Total lines [39m[90m│[39m[31m Total tokens [39m[90m│[39m[31m Clones found [39m[90m│[39m[31m Duplicated lines [39m[90m│[39m[31m Duplicated tokens [39m[90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m css        [90m│[39m 62             [90m│[39m 9539        [90m│[39m 44278        [90m│[39m 19           [90m│[39m 298 (3.12%)      [90m│[39m 2834 (6.40%)      [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m html       [90m│[39m 61             [90m│[39m 9263        [90m│[39m 16185        [90m│[39m 6            [90m│[39m 281 (3.03%)      [90m│[39m 691 (4.27%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m svelte     [90m│[39m 63             [90m│[39m 9338        [90m│[39m 47377        [90m│[39m 0            [90m│[39m 0 (0.00%)        [90m│[39m 0 (0.00%)         [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m typescript [90m│[39m 57             [90m│[39m 2460        [90m│[39m 12516        [90m│[39m 4            [90m│[39m 57 (2.32%)       [90m│[39m 239 (1.91%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m [1mTotal:[22m     [90m│[39m 243            [90m│[39m 30600       [90m│[39m 120356       [90m│[39m 29           [90m│[39m 636 (2.08%)      [90m│[39m 3764 (3.13%)      [90m│[39m
[90m└────────────┴────────────────┴─────────────┴──────────────┴──────────────┴──────────────────┴───────────────────┘[39m
[90mFound 29 clones.[39m
[90mtime: 15.181ms[39m

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

