# Implementation Plan

1. Audit all mathematical expressions passed to FormattedText on the cases page and identify JavaScript escaping issues.
2. Preserve LaTeX backslashes in the page template literals and add parser regression tests for the observed math forms, including math nested in strong text.
3. Run focused tests, Svelte diagnostics, lint/doctor/duplication checks, and the consolidated diagnose script; document results.
