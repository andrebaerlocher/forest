# Forest Diagnostics Report

Generated on: 2026-08-02T05:28:18.878Z

| Check | Command | Status | Description |
|---|---|---|---|
| Biome Linter & Formatter | `npx @biomejs/biome check src` | ❌ FAIL | Checks linting rules and code formatting |
| Svelte Check Native | `npx svelte-check-native --workspace .` | ❌ FAIL | High-performance Rust-based type checker |
| Svelte Doctor | `npx svelte-doctor check` | ✅ PASS | Checks for security, dead code, and Svelte 5 patterns |
| Copy-Paste Detector (jscpd) | `npx jscpd src/lib` | ✅ PASS | Checks for duplicate blocks of code |
| Package Exports Linter (publint) | `npx publint --pack npm` | ✅ PASS | Checks packaging format compatibility |

## Details

### Biome Linter & Formatter (❌ FAIL)

```text
Checked 207 files in 246ms. No fixes applied.
Found 1 error.
Found 6 warnings.
```

### Svelte Check Native (❌ FAIL)

```text
Loading svelte-check in workspace: /Users/andrebarlocher/Documents/Svelte/Forest
Getting Svelte diagnostics...

/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/test_harness/GenericsAdversarialHarness.svelte:19:30
Error: Type 'AdversarialRow' does not satisfy the constraint 'Record<string, unknown>'. (js)
18 | 
19 |   const tableColumns: Column<AdversarialRow>[] = [
                                  ^^^^^^^^^^^^^^
20 |     { key: 'code', label: 'Item Code', primary: true, sortable: true },


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/test_harness/GenericsAdversarialHarness.svelte:136:3
Error: Type 'DataTableColumn<AdversarialRow>[]' is not assignable to type 'DataTableColumn<Record<string, unknown>>[]'. (js)
135 | <DataTable
136 |   columns={tableColumns}
        ^
137 |   rows={tableRows}


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/test_harness/GenericsAdversarialHarness.svelte:137:3
Error: Type 'AdversarialRow[]' is not assignable to type 'Record<string, unknown>[]'. (js)
136 |   columns={tableColumns}
137 |   rows={tableRows}
        ^
138 |   rowKey="id"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/test_harness/GenericsAdversarialHarness.svelte:142:3
Error: Type '(row: AdversarialRow) => void' is not assignable to type '(row: Record<string, unknown>) => void'. (js)
141 |   selectable={true}
142 |   onrowclick={handleRowClick}
        ^
143 | >


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/test_harness/GenericsAdversarialHarness.svelte:146:48
Error: 'row.metadata' is of type 'unknown'. (js)
145 |     {#if col.key === 'code'}
146 |       <strong class="custom-code">{row.code} ({row.metadata.category})</strong>
                                                     ^^^^^^^^^^^^
147 |     {:else if col.key === 'status'}


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/SplitPane.svelte:138:3
Warn: Non-interactive element `<div>` should not be assigned mouse or keyboard event listeners
https://svelte.dev/e/a11y_no_noninteractive_element_interactions (svelte)
137 |   <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
138 |   <div
        ^^^^^^
139 |     class="gutter"


/Users/andrebarlocher/Documents/Svelte/Forest/src/lib/organisms/TreeView.svelte:210:22
Warn: This reference only captures the initial value of `level`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally (svelte)
209 | 
210 |   const isRootNode = level === 0;
                           ^^^^^
211 |   if (isRootNode) {


====================================
svelte-check-native found 5 errors and 2 warnings in 3 files
```

### Svelte Doctor (✅ PASS)

```text
svelte-doctor v0.3.3



  ⚠ Repeated allocation inside `$derived()` can churn memory and recomputation cost (24)
    Avoid allocating new arrays or objects in heavy `$derived()` blocks unless the allocation is required and bounded.
    src/lib/atoms/Avatar.svelte:22
    src/lib/atoms/Skeleton.svelte:32
    src/lib/atoms/Sparkline.svelte:22
    src/lib/molecules/Combobox.svelte:40
    src/lib/molecules/DatePicker.svelte:51,56,65
    src/lib/molecules/TagInput.svelte:46
    src/lib/organisms/BenchmarkTable.svelte:26
    src/lib/organisms/CodeBlock.svelte:56
    src/lib/organisms/CodeBlockGroup.svelte:21
    src/lib/organisms/CommandPalette.svelte:34
    src/lib/organisms/DataTable.svelte:59,60
    src/lib/organisms/Menu.svelte:37
    src/lib/organisms/TableOfContents.svelte:33
    src/lib/templates/CaseStudyShell.svelte:50
    src/lib/templates/CrmView.svelte:96,102,115
    src/lib/templates/EditorView.svelte:66
    src/lib/templates/SpreadsheetView.svelte:44,45,48

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`display` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/BarMeter.svelte:24

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`inputId` reads no reactive state) (2)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/Slider.svelte:39
    src/lib/molecules/TagInput.svelte:43

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`labelId` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/atoms/Slider.svelte:40

  ⚠ CSS uses `!important` override (21)
    Remove `!important` and fix cascade ownership so styles remain predictable.
    src/lib/atoms/TableCell.svelte:69
    src/lib/organisms/Dialog.svelte:104,105,108,109
    src/lib/organisms/Drawer.svelte:135,140
    src/lib/organisms/Spine.svelte:386,441
    src/lib/templates/CrmView.svelte:346,347
    src/lib/templates/EditorView.svelte:313,314
    src/lib/templates/SpreadsheetView.svelte:384,385,492,499,521,522,541,605

  ⚠ Inline event handler allocates a new function reference (80)
    Pass a stable handler reference like `onclick={handleClick}` when no inline closure is required.
    src/lib/molecules/Accordion.svelte:84,85
    src/lib/molecules/Combobox.svelte:134,161,162,163
    src/lib/molecules/DatePicker.svelte:115,116,127,131,147
    src/lib/molecules/SegmentedControl.svelte:32
    src/lib/molecules/Tabs.svelte:34
    src/lib/molecules/TagInput.svelte:131,150,168,169,170
    src/lib/molecules/Tooltip.svelte:49,51
    src/lib/organisms/CommandPalette.svelte:115,116
    src/lib/organisms/DataTable.svelte:143,174,180,214,228,250,251,257
    src/lib/organisms/Figure.svelte:63,95
    src/lib/organisms/Menu.svelte:161,164,165
    src/lib/organisms/Spine.svelte:136
    src/lib/organisms/Stepper.svelte:59
    src/lib/organisms/TableOfContents.svelte:59
    src/lib/organisms/ToastRegion.svelte:27,28,29
    src/lib/organisms/TreeView.svelte:250,254,266
    src/lib/templates/CaseStudyShell.svelte:126,145,151
    src/lib/templates/CrmView.svelte:138,149,165,185,200,205,217,255
    src/lib/templates/EditorView.svelte:86,95,106,122,143,161,166,178,264
    src/lib/templates/SpreadsheetView.svelte:83,92,103,119,138,145,157,194,250,262,276,287,335
    src/lib/test_harness/GenericsAdversarialHarness.svelte:159,160
    src/routes/+page.svelte:107

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`role` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/Alert.svelte:26

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`resolvedLevel` reads no reactive state) (2)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/CaseStudyCard.svelte:31
    src/lib/organisms/Section.svelte:36

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`showDivider` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/molecules/ListRow.svelte:32

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`showHeader` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/CodeBlock.svelte:47

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`regionLabel` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/CodeBlock.svelte:48

  ⚠ Component has 465 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/DataTable.svelte:1

  ⚠ Block nesting depth is 4 (max: 3). (3)
    Extract nested sections into separate components to improve readability.
    src/lib/organisms/DataTable.svelte:152
    src/lib/organisms/Menu.svelte:174
    src/lib/organisms/TreeView.svelte:288

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`headingId` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/DecisionRecord.svelte:45

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`flyX` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Drawer.svelte:31

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`resolvedZoomable` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/Figure.svelte:32

  ⚠ {#each} block is missing a key expression
    Add a key expression like `{#each items as item (item.id)}` so Svelte can efficiently diff list updates instead of re-creating DOM nodes.
    src/lib/organisms/SelectTestWrapper.svelte:25

  ⚠ Component has 416 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/Spine.svelte:1

  ⚠ Component has 369 meaningful lines (limit: 300). Consider breaking it into smaller components.
    Large components are harder to maintain and test. Extract logical sections into child components or shared utilities.
    src/lib/organisms/TreeView.svelte:1

  ⚠ `$derived()` expression references no reactive state — should be a plain `const` (`isRoot` reads no reactive state)
    Replace `const x = $derived(value)` with `const x = value`, or ensure at least one dependency reads a $state variable.
    src/lib/organisms/TreeView.svelte:63

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

  ⚠ Unused export: getCompiledBlobUrl
    Remove the export or add it to a public API surface if it is intentional
    src/lib/test-component-loader.ts


  ┌─────────────────────────────────────────────────┐
  │  Svelte Doctor  (svelte-doctor)           │
  │                                                 │
  │  Score: 15 / 100  Critical                      │
  │                                                 │
  │  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
  │                                                 │
  │  ⚠ 153 warnings  41/350 files  1 fixable  1.3s  │
  └─────────────────────────────────────────────────┘
  Ignore suggestions: 0 diagnostics can likely be ignored.
  Potential bundle savings: 0KB.

  Category breakdown:
    Performance: 128 warnings  penalty 128.0
    State & Reactivity: 14 warnings  penalty 16.8
    Architecture: 10 warnings  penalty 8.0
    Dead Code: 1 warning  penalty 0.5

  Run svelte-doctor fix to auto-fix issues with an AI agent.
```

### Copy-Paste Detector (jscpd) (✅ PASS)

```text
[1mClone found (typescript)[22m
 - [1m[32mactions/focusTrap.test.ts[39m[22m [24:72 - 32:37] (9 lines, 56 tokens)
   actions/focusTrap.test.ts [40:62 - 48:37]
[1mClone found (typescript)[22m
 - [1m[32mactions/focusTrap.test.ts[39m[22m [40:60 - 48:39] (9 lines, 59 tokens)
   actions/focusTrap.test.ts [60:66 - 68:39]
[1mClone found (typescript)[22m
 - [1m[32mactions/focusTrap.test.ts[39m[22m [49:16 - 55:41] (7 lines, 53 tokens)
   actions/focusTrap.test.ts [91:50 - 97:41]
[1mClone found (typescript)[22m
 - [1m[32mactions/scrollspy.test.ts[39m[22m [107:18 - 117:11] (11 lines, 50 tokens)
   actions/scrollspy.test.ts [141:18 - 151:11]
[1mClone found (typescript)[22m
 - [1m[32mactions/scrollspy.test.ts[39m[22m [116:18 - 126:8] (11 lines, 50 tokens)
   actions/scrollspy.test.ts [139:18 - 149:8]
[1mClone found (typescript)[22m
 - [1m[32mactions/scrollspy.test.ts[39m[22m [118:18 - 128:72] (11 lines, 56 tokens)
   actions/scrollspy.test.ts [152:18 - 162:72]
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
 - [1m[32matoms/Slider.svelte:css[39m[22m [146:5 - 155:23] (10 lines, 88 tokens)
   atoms/Slider.svelte:css [156:5 - 165:23]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [1:1 - 31:10] (31 lines, 230 tokens)
   molecules/DropdownMenu.test.ts [1:1 - 31:10]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [17:34 - 24:35] (8 lines, 57 tokens)
   breakpoints.test.ts [23:42 - 30:31]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   molecules/Combobox.test.ts [12:65 - 26:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   molecules/DropdownMenu.test.ts [31:40 - 45:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   organisms/CommandPalette.test.ts [11:71 - 25:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 43:6] (13 lines, 63 tokens)
   organisms/DataTable.test.ts [103:37 - 115:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   organisms/Dialog.test.ts [5:63 - 19:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   organisms/SplitPane.test.ts [103:37 - 117:6]
[1mClone found (typescript)[22m
 - [1m[32matoms/Slider.test.ts[39m[22m [31:34 - 45:6] (15 lines, 65 tokens)
   organisms/TreeView.test.ts [21:65 - 35:6]
[1mClone found (typescript)[22m
 - [1m[32mbreakpoints.test.ts[39m[22m [15:1 - 27:4] (13 lines, 87 tokens)
   test-component-loader.ts [99:5 - 111:8]
[1mClone found (typescript)[22m
 - [1m[32mbreakpoints.test.ts[39m[22m [21:3 - 32:6] (12 lines, 85 tokens)
   stores/toaster.test.ts [17:24 - 27:6]
[1mClone found (typescript)[22m
 - [1m[32mbreakpoints.test.ts[39m[22m [80:15 - 87:59] (8 lines, 81 tokens)
   breakpoints.test.ts [97:15 - 104:59]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/Accordion.test.ts[39m[22m [99:50 - 110:96] (12 lines, 55 tokens)
   molecules/Accordion.test.ts [122:50 - 133:96]
[1mClone found (css)[22m
 - [1m[32mmolecules/Combobox.svelte:css[39m[22m [259:13 - 277:4] (19 lines, 124 tokens)
   molecules/TagInput.svelte:css [267:4 - 284:4]
[1mClone found (css)[22m
 - [1m[32mmolecules/Combobox.svelte:css[39m[22m [291:5 - 310:4] (20 lines, 133 tokens)
   molecules/TagInput.svelte:css [285:5 - 302:4]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/Combobox.test.ts[39m[22m [31:40 - 39:18] (9 lines, 53 tokens)
   molecules/Combobox.test.ts [57:27 - 66:18]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/Combobox.test.ts[39m[22m [31:40 - 41:12] (11 lines, 56 tokens)
   molecules/Combobox.test.ts [97:10 - 107:12]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/Combobox.test.ts[39m[22m [53:86 - 66:18] (14 lines, 78 tokens)
   molecules/Combobox.test.ts [115:45 - 127:18]
[1mClone found (css)[22m
 - [1m[32mmolecules/DropdownMenu.svelte:css[39m[22m [173:15 - 179:21] (7 lines, 51 tokens)
   templates/SettingsTemplate.svelte:css [49:15 - 55:21]
[1mClone found (typescript)[22m
 - [1m[32mmolecules/EditableTableCell.test.ts[39m[22m [69:25 - 79:76] (11 lines, 63 tokens)
   molecules/EditableTableCell.test.ts [96:28 - 106:76]
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
   organisms/DeepDive.svelte:css [165:26 - 173:9]
[1mClone found (html)[22m
 - [1m[32morganisms/DataTable.svelte:html[39m[22m [172:15 - 177:17] (6 lines, 83 tokens)
   organisms/DataTable.svelte:html [255:15 - 260:17]
[1mClone found (typescript)[22m
 - [1m[32morganisms/DataTable.test.ts[39m[22m [5:54 - 103:10] (99 lines, 679 tokens)
   organisms/SplitPane.test.ts [5:58 - 103:10]
[1mClone found (typescript)[22m
 - [1m[32morganisms/DataTable.test.ts[39m[22m [17:1 - 31:6] (15 lines, 106 tokens)
   test-component-loader.ts [17:8 - 31:6]
[1mClone found (typescript)[22m
 - [1m[32morganisms/DataTable.test.ts[39m[22m [71:5 - 88:8] (18 lines, 80 tokens)
   test-component-loader.ts [105:37 - 122:8]
[1mClone found (css)[22m
 - [1m[32morganisms/DeepDive.svelte:css[39m[22m [164:24 - 170:4] (7 lines, 61 tokens)
   organisms/TableOfContents.svelte:css [114:24 - 120:4]
[1mClone found (typescript)[22m
 - [1m[32morganisms/DeepDive.svelte:typescript[39m[22m [53:59 - 60:6] (8 lines, 53 tokens)
   organisms/Section.svelte:typescript [36:55 - 45:6]
[1mClone found (css)[22m
 - [1m[32morganisms/Drawer.svelte:css[39m[22m [114:16 - 124:4] (11 lines, 160 tokens)
   organisms/Spine.svelte:css [174:29 - 184:6]
[1mClone found (typescript)[22m
 - [1m[32morganisms/Menu.svelte:typescript[39m[22m [125:22 - 132:6] (8 lines, 53 tokens)
   organisms/Popover.svelte:typescript [60:20 - 67:6]
[1mClone found (typescript)[22m
 - [1m[32morganisms/SplitPane.test.ts[39m[22m [4:19 - 15:6] (12 lines, 57 tokens)
   stores/toaster.test.ts [4:10 - 15:6]
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
[1mClone found (typescript)[22m
 - [1m[32mtest-component-loader.ts[39m[22m [53:78 - 61:10] (9 lines, 50 tokens)
   test-component-loader.ts [74:14 - 82:10]
[90m┌────────────┬────────────────┬─────────────┬──────────────┬──────────────┬──────────────────┬───────────────────┐[39m
[90m│[39m[31m Format     [39m[90m│[39m[31m Files analyzed [39m[90m│[39m[31m Total lines [39m[90m│[39m[31m Total tokens [39m[90m│[39m[31m Clones found [39m[90m│[39m[31m Duplicated lines [39m[90m│[39m[31m Duplicated tokens [39m[90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m css        [90m│[39m 88             [90m│[39m 14122       [90m│[39m 57675        [90m│[39m 26           [90m│[39m 378 (2.68%)      [90m│[39m 3437 (5.96%)      [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m html       [90m│[39m 91             [90m│[39m 14380       [90m│[39m 24832        [90m│[39m 6            [90m│[39m 281 (1.95%)      [90m│[39m 724 (2.92%)       [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m svelte     [90m│[39m 94             [90m│[39m 14312       [90m│[39m 71400        [90m│[39m 0            [90m│[39m 0 (0.00%)        [90m│[39m 0 (0.00%)         [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m typescript [90m│[39m 110            [90m│[39m 7656        [90m│[39m 41648        [90m│[39m 34           [90m│[39m 486 (6.35%)      [90m│[39m 2939 (7.06%)      [90m│[39m
[90m├────────────┼────────────────┼─────────────┼──────────────┼──────────────┼──────────────────┼───────────────────┤[39m
[90m│[39m [1mTotal:[22m     [90m│[39m 383            [90m│[39m 50470       [90m│[39m 195555       [90m│[39m 66           [90m│[39m 1145 (2.27%)     [90m│[39m 7100 (3.63%)      [90m│[39m
[90m└────────────┴────────────────┴─────────────┴──────────────┴──────────────┴──────────────────┴───────────────────┘[39m
[90mFound 66 clones.[39m
[90mtime: 26.032ms[39m

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

