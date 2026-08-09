# Forest Diagnostics Report

Generated on: 2026-08-09T08:29:39.217Z

| Check | Command | Status | Description |
|---|---|---|---|
| Biome Linter & Formatter | `npx @biomejs/biome check src tests` | ✅ PASS | Checks linting rules and code formatting |
| Svelte Check Native | `npx svelte-check-native --workspace .` | ✅ PASS | High-performance Rust-based type checker |
| Svelte Doctor | `npx svelte-doctor check` | ✅ PASS | Checks for security, dead code, and Svelte 5 patterns |
| Copy-Paste Detector (jscpd) | `npx jscpd src/lib` | ✅ PASS | Checks for duplicate blocks of code |
| Package Exports Linter (publint) | `npx publint --pack npm` | ✅ PASS | Checks packaging format compatibility |

## Details

### Biome Linter & Formatter (✅ PASS)

```text
Checked 228 files in 283ms. No fixes applied.
Found 1 warning.
```

### Svelte Check Native (✅ PASS)

```text
Loading svelte-check in workspace: /Users/andrebarlocher/Documents/Svelte/Forest
Getting Svelte diagnostics...

/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/SplitPane.svelte:138:3
Warn: Non-interactive element `<div>` should not be assigned mouse or keyboard event listeners
https://svelte.dev/e/a11y_no_noninteractive_element_interactions (svelte)
137 |   <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
138 |   <div
        ^^^^^^
139 |     class="gutter"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/TreeView.svelte:210:7
Warn: This reference only captures the initial value of `level`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
209 | 
210 |   if (level === 0) {
            ^^^^^
211 |     setContext(TREE_CONTEXT_KEY, rootCtx);


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/TreeView.svelte:214:31
Warn: This reference only captures the initial value of `level`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
213 | 
214 |   const ctx: TreeContext<T> = level === 0 ? rootCtx : getContext<TreeContext<T>>(TREE_CONTEXT_KEY);
                                    ^^^^^
215 | 


====================================
svelte-check-native found 0 errors and 3 warnings in 2 files
```

### Svelte Doctor (✅ PASS)

```text
svelte-doctor v0.3.3



  ⚠ Repeated allocation inside `$derived()` can churn memory and recomputation cost (25)
    Avoid allocating new arrays or objects in heavy `$derived()` blocks unless the allocation is required and bounded.
    src/lib/atoms/Avatar.svelte:23
    src/lib/atoms/FormattedText.svelte:28
    src/lib/atoms/Skeleton.svelte:33
    src/lib/atoms/Sparkline.svelte:23
    src/lib/molecules/Combobox.svelte:40
    src/lib/molecules/DatePicker.svelte:52,57,66
    src/lib/molecules/TagInput.svelte:46
    src/lib/organisms/BenchmarkTable.svelte:26
    src/lib/organisms/CodeBlock.svelte:56
    src/lib/organisms/CodeBlockGroup.svelte:21
    src/lib/organisms/CommandPalette.svelte:34
    src/lib/organisms/DataTable.svelte:102,103
    src/lib/organisms/Menu.svelte:37
    src/lib/organisms/TableOfContents.svelte:33
    src/lib/templates/CaseStudyShell.svelte:50
    src/lib/templates/CrmView.svelte:96,102,115
    src/lib/templates/EditorView.svelte:66
    src/lib/templates/SpreadsheetView.svelte:44,45,48

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`display` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/BarMeter.svelte:25

  ⚠ Block nesting depth is 4 (max: 3). (5)
    Extract nested sections into separate components to improve readability.
    src/lib/atoms/FormattedText.svelte:45,53
    src/lib/organisms/DataTable.svelte:195
    src/lib/organisms/Menu.svelte:174
    src/lib/organisms/TreeView.svelte:287

  ⚠ Block nesting depth is 5 (max: 3). (2)
    Extract nested sections into separate components to improve readability.
    src/lib/atoms/FormattedText.svelte:46,54

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`inputId` reads no reactive state) (2)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/Slider.svelte:40
    src/lib/molecules/TagInput.svelte:43

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`labelId` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/Slider.svelte:41

  ⚠ CSS uses `!important` override (21)
    Remove `!important` and fix cascade ownership so styles remain predictable.
    src/lib/atoms/TableCell.svelte:69
    src/lib/organisms/Dialog.svelte:104,105,108,109
    src/lib/organisms/Drawer.svelte:135,140
    src/lib/organisms/Spine.svelte:388,443
    src/lib/templates/CrmView.svelte:346,347
    src/lib/templates/EditorView.svelte:313,314
    src/lib/templates/SpreadsheetView.svelte:384,385,492,499,521,522,541,605

  ⚠ Inline event handler allocates a new function reference (80)
    Pass a stable handler reference like `onclick={handleClick}` when no inline closure is required.
    src/lib/molecules/Accordion.svelte:84,85
    src/lib/molecules/Combobox.svelte:134,161,162,163
    src/lib/molecules/DatePicker.svelte:116,117,128,132,148
    src/lib/molecules/SegmentedControl.svelte:32
    src/lib/molecules/Tabs.svelte:34
    src/lib/molecules/TagInput.svelte:131,150,168,169,170
    src/lib/molecules/Tooltip.svelte:49,51
    src/lib/organisms/CommandPalette.svelte:119,120
    src/lib/organisms/DataTable.svelte:186,220,226,263,277,304,305,311
    src/lib/organisms/Figure.svelte:63,95
    src/lib/organisms/Menu.svelte:161,164,165
    src/lib/organisms/Section.svelte:64
    src/lib/organisms/Spine.svelte:136
    src/lib/organisms/Stepper.svelte:59
    src/lib/organisms/TableOfContents.svelte:59
    src/lib/organisms/ToastRegion.svelte:27,28,29
    src/lib/organisms/TreeView.svelte:249,253,265
    src/lib/templates/CaseStudyShell.svelte:103,154,160
    src/lib/templates/CrmView.svelte:138,149,165,185,200,205,217,255
    src/lib/templates/EditorView.svelte:86,95,106,122,143,161,166,178,264
    src/lib/templates/SpreadsheetView.svelte:83,92,103,119,138,145,157,194,250,262,276,287,335
    src/routes/+page.svelte:107
    src/routes/cases/+page.svelte:178

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`role` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/Alert.svelte:26

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`resolvedLevel` reads no reactive state) (2)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/CaseStudyCard.svelte:39
    src/lib/organisms/Section.svelte:41

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`showDivider` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/ListRow.svelte:32

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`showHeader` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/CodeBlock.svelte:47

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`regionLabel` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/CodeBlock.svelte:48

  ⚠ Component has 514 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/DataTable.svelte:1

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`paddingTop` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/DataTable.svelte:80

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`headingId` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/DecisionRecord.svelte:59

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`flyX` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Drawer.svelte:31

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`resolvedZoomable` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Figure.svelte:32

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`isOpen` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Section.svelte:52

  ⚠ Component has 416 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/Spine.svelte:1

  ⚠ Component has 368 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/TreeView.svelte:1

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`isRoot` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/TreeView.svelte:63

  ⚠ Component has 308 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/templates/CaseStudyShell.svelte:1

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

  ⚠ {#each} block is missing a key expression
    Add a key expression like `{#each items as item (item.id)}` so Svelte can efficiently diff list updates instead of re-creating DOM nodes.
    src/routes/cases/+page.svelte:209

  ⚠ Component has 340 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/routes/cases/+page.svelte:1

  ⚠ Dependency . appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/chunks/D9vOaKhb.js:1

  ⚠ Dependency ../chunks appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/client/_app/immutable/entry/app.CX-zfR3S.js:1

  ⚠ Dependency @sveltejs appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/exports.js:1

  ⚠ Dependency .. appears across multiple chunks
    Inspect Vite chunking and manualChunks config so shared dependencies are emitted once instead of duplicated.
    .svelte-kit/output/server/chunks/index-server.js:1

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
  │  Score: 12 / 100  Critical                      │
  │                                                 │
  │  █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
  │                                                 │
  │  ⚠ 172 warnings  50/422 files  1 fixable  2.0s  │
  └─────────────────────────────────────────────────┘
  Ignore suggestions: 11 diagnostics can likely be ignored.
  Potential bundle savings: 0KB.

  Category breakdown:
    Performance: 129 warnings  penalty 129.0
    State & Reactivity: 16 warnings  penalty 19.2
    Architecture: 16 warnings  penalty 12.8
    Bundle Size: 11 warnings  penalty 7.7

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
 - [1m[32matoms/Checkbox.svelte:typescript[39m[22m [2:3 - 15:9] (14 lines, 57 tokens)
   atoms/Switch.svelte:typescript [2:3 - 15:9]
[1mClone found (html)[22m
 - [1m[32matoms/FormattedText.svelte:html[39m[22m [44:12 - 50:11] (7 lines, 61 tokens)
   atoms/FormattedText.svelte:html [52:12 - 58:11]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [38:10 - 48:44] (11 lines, 119 tokens)
   atoms/Textarea.svelte:css [35:13 - 45:44]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [39:5 - 45:34] (7 lines, 79 tokens)
   atoms/Select.svelte:css [51:5 - 57:34]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [39:34 - 47:45] (9 lines, 89 tokens)
   molecules/DatePicker.svelte:css [172:39 - 179:55]
[1mClone found (css)[22m
 - [1m[32matoms/Input.svelte:css[39m[22m [45:14 - 50:4] (6 lines, 54 tokens)
   atoms/Select.svelte:css [57:40 - 62:11]
[1mClone found (css)[22m
 - [1m[32matoms/Select.svelte:css[39m[22m [50:21 - 57:34] (8 lines, 80 tokens)
   molecules/Combobox.svelte:css [193:16 - 200:34]
[1mClone found (css)[22m
 - [1m[32matoms/Slider.svelte:css[39m[22m [147:5 - 156:23] (10 lines, 88 tokens)
   atoms/Slider.svelte:css [157:5 - 166:23]
[1mClone found (css)[22m
 - [1m[32mmolecules/Combobox.svelte:css[39m[22m [259:13 - 277:4] (19 lines, 124 tokens)
   molecules/TagInput.svelte:css [267:4 - 284:4]
[1mClone found (css)[22m
 - [1m[32mmolecules/Combobox.svelte:css[39m[22m [291:5 - 310:4] (20 lines, 133 tokens)
   molecules/TagInput.svelte:css [285:5 - 302:4]
[1mClone found (css)[22m
 - [1m[32mmolecules/DropdownMenu.svelte:css[39m[22m [173:15 - 179:21] (7 lines, 51 tokens)
   templates/SettingsTemplate.svelte:css [49:15 - 55:21]
[1mClone found (css)[22m
 - [1m[32mmolecules/EmptyState.svelte:css[39m[22m [103:32 - 110:4] (8 lines, 56 tokens)
   molecules/ListRow.svelte:css [76:33 - 83:4]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/SegmentedControl.svelte:typescript[39m[22m [5:18 - 18:11] (14 lines, 53 tokens)
   molecules/Tabs.svelte:typescript [5:19 - 18:11]
[1mClone found (css)[22m
 - [1m[32morganisms/BenchmarkTable.svelte:css[39m[22m [133:49 - 143:4] (11 lines, 50 tokens)
   styles/forest.css [298:10 - 308:2]
[1mClone found (css)[22m
 - [1m[32morganisms/CodeBlock.svelte:css[39m[22m [157:36 - 167:9] (11 lines, 82 tokens)
   organisms/Figure.svelte:css [157:40 - 167:9]
[1mClone found (css)[22m
 - [1m[32morganisms/CodeBlock.svelte:css[39m[22m [159:20 - 167:9] (9 lines, 65 tokens)
   organisms/DeepDive.svelte:css [180:26 - 188:9]
[1mClone found (html)[22m
 - [1m[32morganisms/DataTable.svelte:html[39m[22m [218:15 - 223:17] (6 lines, 89 tokens)
   organisms/DataTable.svelte:html [309:15 - 314:17]
[1mClone found (css)[22m
 - [1m[32morganisms/DeepDive.svelte:css[39m[22m [179:24 - 185:4] (7 lines, 61 tokens)
   organisms/TableOfContents.svelte:css [122:24 - 128:4]
[1mClone found (typescript)[22m
 - [1m[32morganisms/DeepDive.svelte:typescript[39m[22m [68:69 - 75:6] (8 lines, 53 tokens)
   organisms/Section.svelte:typescript [41:55 - 50:6]
[1mClone found (css)[22m
 - [1m[32morganisms/Drawer.svelte:css[39m[22m [114:16 - 124:4] (11 lines, 160 tokens)
   organisms/Spine.svelte:css [347:29 - 357:6]
[1mClone found (typescript)[22m
 - [1m[32morganisms/Menu.svelte:typescript[39m[22m [125:22 - 132:6] (8 lines, 53 tokens)
   organisms/Popover.svelte:typescript [60:20 - 67:6]
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
[90m│[39m css        [90m│[39m 89             [90m│[39m 14520       [90m│[39m 60874        [90m│[39m 26           [90m│[39m 378 (2.60%)      [90m│[39m 3437 (5.65%)      [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m html       [90m│[39m 89             [90m│[39m 14323       [90m│[39m 24364        [90m│[39m 7            [90m│[39m 287 (2.00%)      [90m│[39m 791 (3.25%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m svelte     [90m│[39m 92             [90m│[39m 14425       [90m│[39m 73876        [90m│[39m 0            [90m│[39m 0 (0.00%)        [90m│[39m 0 (0.00%)         [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m typescript [90m│[39m 93             [90m│[39m 5427        [90m│[39m 27770        [90m│[39m 6            [90m│[39m 71 (1.31%)       [90m│[39m 347 (1.25%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m [1mTotal:[22m     [90m│[39m 363            [90m│[39m 48695       [90m│[39m 186884       [90m│[39m 39           [90m│[39m 736 (1.51%)      [90m│[39m 4575 (2.45%)      [90m│[39m
[90m└────────────┴────────────────┴─────────────┴──────────────┴──────────────┴──────────────────┴───────────────────┘[39m
[90mFound 39 clones.[39m
[90mtime: 30.827ms[39m

[90m💡 Auto-refactor with AI: [1m[39mnpx skills add https://github.com/kucherenko/jscpd --skill dry-refactoring[90m[22m
[90m🎩 New: Gangsta Agents — discipline your AI coding → gangsta.page[39m
[90m💖 Support jscpd project → https://opencollective.com/jscpd[39m
```

### Package Exports Linter (publint) (✅ PASS)

```text
Running publint v0.3.21 for forest...
Packing files with `npm pack`...
Linting...
All good!
```

