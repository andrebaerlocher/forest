---
name: forest-diagnostics
description: Runs consolidated conformance checks (linting, type safety, code structure) for the Forest SvelteKit component library.
---

# Forest Diagnostics Skill

## Overview
This skill provides automated mechanisms to run code-quality checks on the Forest component library. It wraps Biome (linting/formatting), svelte-check-native (type safety), svelte-doctor (Svelte 5 compatibility), jscpd (duplicate detector), and publint (packaging exports linting).

## Quick Start

To run the unified check suite, execute:
```bash
npm run diagnose
```

## Workflow

### 1. Run Check Suite
Execute `npm run diagnose` in standard sandbox mode. The execution script will coordinate all tools and aggregate results.

### 2. Inspect Report
The diagnostics script generates a markdown report at `diagnostics_report.md` in the workspace root.
Open and read the report using the `view_file` tool to inspect the status of each check:
- Look for any `❌ FAIL` entries in the summary table.
- Read the detailed terminal outputs below the table in the report.

### 3. Resolve Failures
- **Biome Linter/Formatter**: If formatting or lint checks fail, run `npm run format` to auto-fix formatting errors, or manually edit files to satisfy lint rules.
- **Svelte Check Native**: If type-checking fails, correct Svelte property types or TypeScript compiler errors.
- **Svelte Doctor**: Address security warnings (e.g., unsafe `{@html}` blocks) or Svelte 5 runes migration issues.
- **jscpd**: If code duplication exceeds the 5% threshold, extract common patterns into reusable utility functions or base atoms.
- **publint**: If exports verification fails, ensure that package entry points in `package.json` correctly map to build files generated in `dist`.
