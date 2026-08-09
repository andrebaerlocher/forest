# Changelog

All notable changes to the **Forest** Svelte 5 component library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Status Variants for DecisionRecord & StatusPill**: Added `variant` prop (`solid`, `dashed`, `strong`) to `StatusPill`. Extended `DecisionStatus` in `domain.ts` with `final` and `rejected` states, visually distinguishing `accepted` (dashed border) from `final` (strong solid border).
- **Inline Markdown Formatting (`FormattedText`)**: Added `FormattedText` atom supporting lightweight inline markdown formatting (bold, italic, code snippets, links) across DecisionRecord and case study content.
- **Local TOC Scoping in `DeepDive`**: Integrated `createTocRegistry` into `DeepDive` so nested `Section` elements automatically populate the module's internal jump list without leaking into page-level navigation.

## [0.1.0] - 2026-08-02

### Added
- **DataTable Threshold Windowing Virtualization**: Added hybrid virtualization (`virtualize`, `threshold`, `rowHeight`, `viewportHeight` props) with `paddingTop` and `paddingBottom` spacers for handling 10,000+ rows efficiently.
- **Storybook Stories**: Added CSF story coverage for `ContextualStrip`, `DetailPanel`, `FormSection`, `KanbanColumn`, and `ToastRegion`.
- **Testing Infrastructure**: Created 77 unit and interaction DOM tests across 15 test files with fast Bun test execution.
- **GitHub Actions CI Workflow**: Added `.github/workflows/ci.yml` using Bun for automated quality gate verification (`check:native`, `check:doctor`, `check:cpd`, `bun test`, `publint`).

### Changed
- **Svelte 5 Runic & Generic Props**:
  - `DataTable.svelte`: Strongly typed rows with `generics="Row extends object = Record<string, unknown>"`.
  - `TreeView.svelte`: Added generic payload support (`TreeNodeData<T>`) and resolved Svelte 5 HTML element attribute event collisions using `Omit<HTMLAttributes<HTMLUListElement>, 'onselect' | 'ontoggle'>`.
- **Accessibility (A11y)**:
  - WAI-ARIA treeview pattern with roving `tabindex` and ArrowUp/ArrowDown/Home/End keyboard navigation.
  - DropdownMenu ARIA menu semantics (`role="menu"`, `role="menuitem"`), focus management, and Escape key dismissal.
  - DataTable row focusability (`tabindex`) and keyboard selection (`Enter`/`Space`).

### Fixed
- Replaced `: any` annotations across components and test environments with strict types or generics.
- Resolved code formatting and linting issues with Biome.
