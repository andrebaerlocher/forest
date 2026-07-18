## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: storybook, mcp

---

# AGENTS.md — AI Agent Guidelines for Forest

This document details expectations, directory structure rules, and diagnostic workflows for AI coding agents operating in the Forest repository.

## Core Directives

### 1. Planning Workflow
- Always research codebase changes using read tools first.
- Stop and create or update `implementation_plan.md` (in the artifacts directory) before editing source code or running modifying commands for non-trivial changes.
- Await user approval before executing the plan.
- Update `task.md` to track implementation progress.
- Document completions in `walkthrough.md`.

### 2. Command Execution & Sandboxing
- Attempt all terminal commands in **Standard Sandbox Mode** first (`BypassSandbox: false`).
- If a command fails due to standard sandbox limits (e.g. npm packages, external downloads, git clone), reissue the command with `BypassSandbox: true` after user approval.

### 3. File Output Protocol (Token Conservation)
- Avoid verbose stdout logs. Commands that output >10 lines of text should be redirected to files or run via helper scripts that output summarized reports.
- Always run the consolidated diagnostics script (`npm run diagnose`) which outputs its result directly to `diagnostics_report.md`.

---

## Folder Taxonomy (Atomic Design)

All new components must reside under `src/lib/` in one of the following directories:

| Directory | Scope | Examples |
|---|---|---|
| `src/lib/atoms/` | Primitives, singular visual elements, base forms | `Button.svelte`, `Input.svelte`, `Wave.svelte` |
| `src/lib/molecules/` | Simple compositions of 2+ atoms, basic states | `FormField.svelte`, `Slip.svelte` |
| `src/lib/organisms/` | Complex, structural combinations of atoms/molecules | `LedgerTable.svelte`, `Spine.svelte` |
| `src/lib/templates/` | High-level page layout grids and shells | `Shell.svelte` |

---

## Code Quality Acceptance Criteria

Before declaring a task done, agents must verify:
1. **Zero compiler/type errors**: `svelte-check-native` passes clean.
2. **Svelte 5 compatibility**: `svelte-doctor` reports no security, performance, or deprecation issues.
3. **No lint or format issues**: `biome check` returns successfully with zero warnings.
4. **Minimal duplication**: `jscpd` detects duplicate blocks below a 5% overall threshold.
5. **Consolidated success**: `npm run diagnose` runs without errors, and the report file is updated.
