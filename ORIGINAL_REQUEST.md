# Original User Request

## 2026-08-01T19:02:22Z

Harden the Forest Svelte 5 component library according to hardening.md so that it meets all production-grade technical review standards for publication as a Bun-based npm component library and serves as a high-credibility portfolio showcase.

Working directory: /Users/andrebarlocher/Documents/Svelte/Forest
Integrity mode: development

## Requirements

### R1. Testing Infrastructure & Test Suite
- Fix the CLAUDE.md advertising discrepancy and align commands to use bun (bun test, bun run diagnose, etc.).
- Set up a working Vitest test runner configuration and bun test script.
- Add interaction tests (play functions in Storybook or Vitest tests) for keyboard-heavy components (Combobox, CommandPalette, Dialog, EditableTableCell, TreeView, Accordion).
- Add unit tests for non-component logic (src/lib/actions/focusTrap.ts, src/lib/stores/toaster.svelte.ts, src/lib/breakpoints.svelte.ts, src/lib/actions/scrollspy.ts).

### R2. Accessibility & Keyboard Navigation (A11y)
- DataTable: Desktop table rows keyboard focusable (tabindex) & selectable (onkeydown for Enter/Space).
- TreeView: Full WAI-ARIA treeview pattern with single roving tab stop and ArrowUp/ArrowDown/Home/End keyboard navigation.
- DropdownMenu: Implement full ARIA menu semantics (role="menu", role="menuitem", arrow key focus management, Escape to close, click-outside dismissal).
- Slider: Correct label-to-input association (for/id or aria-labelledby).
- SplitPane: Support touch/pointer events for dragging and Home/End key shortcuts on the separator.
- Storybook: Enable build enforcement in .storybook/preview.ts (a11y: { test: "error" }) after fixing component gaps.

### R3. Strict Type Discipline & Generics (Eliminate any)
- Actively remove : any across the entire codebase (src/lib).
- Replace [key: string]: any rest-props idioms with strict HTML attribute types or Record<string, unknown>.
- Fix all unconstrained value: any cases (Select.svelte, Radio.svelte, EditableTableCell.svelte) using generics or strict unions.
- Implement Svelte 5 generic props (generics="Row extends Record<string, unknown>") on DataTable.svelte and TreeView.svelte (TreeNodeData<T>) so row types, cell snippets, and callbacks are strongly typed.
- Only retain any as an absolute last resort if Svelte/TypeScript compiler constraints strictly force it.

### R4. Code Hygiene, Duplication & Diagnostics Triage
- Triage svelte-doctor warnings: remove inline CSS !important rules across components, refactor oversized components (>300 lines), and configure/triage inline handler warnings.
- Extract shared HTML/CSS template code between EditorView.svelte, SpreadsheetView.svelte, and CrmView.svelte to bring jscpd duplication metrics below 5%.
- Maintain consolidated diagnostics (bun run diagnose) passing cleanly with an updated diagnostics_report.md.

### R5. API Surface, Storybook Coverage & Documentation
- Audit src/lib/index.ts exports vs src/lib/ components; clearly document exported library APIs vs internal showcase components.
- Add missing Storybook stories for exported components (ContextualStrip, DetailPanel, FormSection, KanbanColumn, ToastRegion) and high-level templates.
- Rewrite README.md to highlight Forest's paper/ink design system, single---hue CSS custom property theming system, installation/usage instructions using bun, and quality posture.

### R6. DataTable Row Virtualization
- Implement efficient row virtualization / windowed rendering in DataTable for handling thousands of rows smoothly, serving as an engineering showpiece.

### R7. Release & CI Discipline
- Add GitHub Actions CI workflow (.github/workflows/ci.yml) to validate PRs and pushes with bun run check:native, bun run check:doctor, bun run check:cpd, bun test, and bun run prepack.
- Add CHANGELOG.md documenting historical and recent improvements.
- Standardize Bun-based versioning and release packaging checks.

## Acceptance Criteria

### Verification & Quality Checks
- [ ] bun run diagnose executes cleanly and generates an updated diagnostics_report.md.
- [ ] bun run check:native passes with 0 compiler or type errors.
- [ ] bun test executes unit and interaction test suites cleanly.
- [ ] bun run check:cpd duplication metric is below 5%.
- [ ] bun run check:doctor passes with triaged rules and no critical regressions.
- [ ] : any usage is eliminated or reduced to minimum last-resort cases.
- [ ] All exported components have story coverage in Storybook (bun run build-storybook succeeds).
- [ ] .github/workflows/ci.yml is syntactically valid and configured for Bun.
