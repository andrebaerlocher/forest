# Hardening Forest for Technical Review

Forest is not the headline exhibit in the portfolio — it's the substrate the portfolio site is built on, and a credibility signal for AI/ML, architecture, and full-stack roles. This document answers one question: **what would it take for this library to hold up when a reviewer clicks through and pokes at it?**

It's a roadmap, not a scorecard. Every claim below was checked against the repo as it stands today (`git log` shows `9c4a41d` as HEAD, with a handful of modified/untracked files — noted where relevant, since some of them change the numbers). Where my count differs from what the brief assumed, I say so and use what I actually found.

## Executive summary

Ranked by *credibility impact* — what a reviewer notices first — against *effort* to close.

| # | Gap | Impact | Effort | Why it ranks here |
|---|---|---|---|---|
| 1 | Testing infra advertised but absent | Very high | A few days (infra) → sustained (coverage) | `CLAUDE.md` claims `npm run test` works. It doesn't exist. This is the single fastest way to lose credibility — a claim a reviewer can falsify in 30 seconds. |
| 2 | Keyboard/a11y gaps in flagship components | High | Afternoon each, few days total | `DataTable` row clicks and `TreeView` navigation are exactly the things a reviewer tries first. The gaps are narrow and fixable, which is the good news. |
| 3 | No generics on `DataTable`/`TreeView` | High (for architecture-minded reviewers) | A few days | Zero generics anywhere in the codebase is conspicuous in a TS library. This is the highest-leverage single change for signaling type-system fluency. |
| 4 | `svelte-doctor` score (20–23/100, "Critical") | Medium-high | Mixed — some fixes are an afternoon, the full triage is a sustained project | The number itself is alarming out of context; most of the underlying warnings are stylistic. Shipping the report without a defensible score is worse than not shipping it. |
| 5 | Template-layer duplication (`CrmView`/`EditorView`/`SpreadsheetView`) | Medium | A few days | Stands out precisely *because* atoms/molecules/organisms are clean (0% duplication). Contrast makes it worse than the raw numbers suggest. |
| 6 | Missing stories + unexported templates | Medium | Afternoon (stories) / a few days (decide + fix exports) | Reviewers browse Storybook. Gaps there are visible; the export question is an architecture decision hiding as an oversight. |
| 7 | README is unedited scaffolding | Medium | Afternoon | First thing anyone opens. Currently pure `sv create` boilerplate — costs nothing to fix, so leaving it is a bigger tell than the gap itself. |
| 8 | No virtualization / `ResizeObserver` | Medium (ceiling, not urgent) | Sustained project | Real capability gap for a library shipping a spreadsheet and CRM template, but not something a reviewer stumbles into by clicking around — it shows up under load. Also the best *engineering showpiece* if built. |
| 9 | No CI, no CHANGELOG, version `0.0.1` | Low-medium | Afternoon (CI) / ongoing discipline | Table stakes, cheap to fix, low reviewer-facing cost per gap — but they compound with #1 into a "process didn't mature" impression. |

Fastest path to a materially better first impression: fix #1's advertising problem (an afternoon — either add the script or edit `CLAUDE.md`), close the `DataTable`/`TreeView` keyboard gaps (#2, an afternoon each), and rewrite the README (#7, an afternoon). That's roughly two days of work covering the three things a reviewer is most likely to actually exercise.

---

## 1. Testing — the largest credibility gap

**Current state.** `vitest`, `@vitest/browser-playwright`, `playwright`, and `@storybook/addon-vitest` are all present in `package.json` `devDependencies`. There is no `test` script in `package.json` — the full script list is `dev`, `build`, `preview`, `prepare`, `prepack`, `check`, `check:watch`, `storybook`, `build-storybook`, `lint`, `format`, `check:native`, `check:doctor`, `check:cpd`, `diagnose`. `grep -r` for `*.test.*` / `*.spec.*` under `src/` returns nothing. `grep -rl "play:" src/stories` matches only `.mdx`/doc-comment false positives (`PaperTexture.stories.svelte`, `SealButton.stories.svelte`, `StatusPill.stories.svelte`, `Radio.stories.svelte`, `Tooltip.stories.svelte`, `ModeToggle.stories.svelte`, `Kbd.stories.svelte`, `Spine.stories.svelte`, `Divider.stories.svelte`, `Avatar.stories.svelte`, `Configure.mdx`) — none of these are actual Storybook `play` interaction functions; there are zero `play` functions in the story files. Meanwhile `CLAUDE.md`, checked into the repo, states: "**Unit & Storybook tests**: `npm run test` or `vitest`."

**Why it matters.** A reviewer who reads `CLAUDE.md` — which is written specifically to be read by an AI agent or an engineer orienting quickly — and then runs `npm run test` gets a hard failure. Advertising a test suite that doesn't exist costs more than having no tests at all: it reads as either carelessness or the docs being AI-generated aspirationally rather than maintained. Zero tests, stated plainly, is a normal state for a young component library. Zero tests plus a false claim is a red flag.

**What to do.**
1. Immediate (minutes): either add a `test` script that runs `vitest`, or edit the `CLAUDE.md` line to reflect reality. Do this regardless of what else gets built — it's the cheapest fix in this entire document.
2. An afternoon: wire `@storybook/addon-vitest` properly (it's installed but nothing consumes it) and add a handful of Storybook interaction tests (`play` functions) for the keyboard-heavy components: `Combobox`, `CommandPalette`, `Dialog`, `EditableTableCell`, `TreeView`, `Accordion`. These are also the components most likely to be manually poked at by a reviewer, so tests here double as documentation of intended keyboard behavior.
3. A few days: unit tests for the non-component logic, which is cheap to test in isolation and currently has zero coverage: `src/lib/actions/focusTrap.ts`, `src/lib/stores/toaster.svelte.ts`, `src/lib/breakpoints.svelte.ts`, and the newly added (currently untracked) `src/lib/actions/scrollspy.ts` and `src/lib/caseStudyToc.svelte.ts`.
4. Don't target 100% coverage — that invites low-value tests on presentational atoms. A realistic target is coverage on interaction logic and state management (the files in step 3, plus the keyboard paths in step 2), with atoms and pure-presentational molecules left untested or covered incidentally through Storybook snapshots.

## 2. Accessibility gaps in the flagship components

**Current state**, verified against source:

| Component | Gap | Verified detail |
|---|---|---|
| `src/lib/organisms/DataTable.svelte` | Desktop table rows unreachable by keyboard | `<tr onclick={() => onrowclick?.(row)}>` (line 221–224) has no `tabindex` or `onkeydown`. Card mode (line 155) uses a real `<button>` and works correctly. |
| `src/lib/organisms/TreeView.svelte` | No roving tabindex, no arrow navigation | Every row gets `tabindex={node.disabled ? -1 : 0}` (line 99) — every node is a separate Tab stop, not a single stop with internal arrow-key movement. `handleKeyDown` (line 62) only handles Enter/Space (select) and ArrowRight/ArrowLeft (expand/collapse) — no ArrowUp/ArrowDown, no Home/End, no type-ahead. This is a real gap against the [WAI-ARIA APG tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/), which specifies a single tab stop with arrow-key roving focus. |
| `src/lib/molecules/DropdownMenu.svelte` | Not a menu, just a positioned div | No `role="menu"`, no `role="menuitem"` on children, no arrow-key handling, no type-ahead, no click-outside dismissal. It's `{#if open}<div transition:fly>{@render children()}</div>{/if}` — a styled, positioned container and nothing more. |
| `src/lib/organisms/SplitPane.svelte` | Mouse-only drag, no keyboard extremes | Drag is wired via `onmousedown` → `window.addEventListener("mousemove"/"mouseup")`; no `pointerdown`/touch handling. `onkeydown={handleKeyDown}` exists on the separator (arrow-key resize), but there's no Home/End to jump to min/max. |
| `src/lib/atoms/Slider.svelte` | Label not associated with input | `label` renders as a bare `<span class="slider-label">`; the `<input type="range">` has no matching `id`, and there's no `for`/`aria-labelledby` connecting them. A screen reader gets an unlabeled slider. |
| `.storybook/preview.ts` | a11y checks don't fail builds | `a11y: { test: "todo" }` — violations are reported in the Storybook UI but never fail CI or the story build. |

**Why it matters.** These are exactly the components a technical reviewer tries first — click a table row, arrow through a tree, tab through a form. Ship one broken keyboard path and the "accessible design system" claim collapses regardless of what's correct elsewhere.

**What's already strong, for contrast.** This isn't a uniformly weak area:
- `src/lib/molecules/Combobox.svelte` is a textbook `role="combobox"` + `aria-activedescendant` implementation (confirmed at lines 125 and 129) — keyboard-driven, no DOM focus movement, exactly per spec.
- `Dialog`, `Drawer`, and `CommandPalette` all share `src/lib/actions/focusTrap.ts` — one well-factored action handling Tab-trapping, autofocus, and focus restoration, rather than three ad hoc implementations. Reusing a single action across three surfaces is a good architectural signal on its own.
- `src/lib/molecules/Accordion.svelte` has real roving focus between triggers: `handleKeyDown` (line 51) moves programmatic focus between `.accordion-trigger` buttons on ArrowUp/ArrowDown.
- `DataTable` does handle `aria-sort` on sortable headers (line 200, via an `ariaSort()` helper) and announces sort changes through an `aria-live="polite"` region (line 111) — the sorting story is more accessible than the row-click story.

**What to do.**
1. Afternoon: give `DataTable` desktop rows `tabindex={onrowclick ? 0 : undefined}` and an `onkeydown` handler for Enter/Space, mirroring what card mode already gets for free via `<button>`.
2. Afternoon: fix `Slider`'s label association (`id` + `for`, or `aria-labelledby`).
3. A few days: rebuild `TreeView` to a single roving tab stop (track "active" node id in state, set `tabindex={id === activeId ? 0 : -1}` on all rows) and add ArrowUp/ArrowDown/Home/End. Type-ahead is a nice-to-have, not blocking.
4. A few days: give `DropdownMenu` real menu semantics — `role="menu"`/`menuitem"`, arrow-key navigation, Escape-to-close, click-outside. This is the largest single a11y gap in the list since it currently has none of the expected behavior.
5. Afternoon: add touch handling to `SplitPane`'s drag (pointer events instead of mouse-only) and Home/End on the separator.
6. Only after 1–4 are done: flip `.storybook/preview.ts`'s `a11y.test` from `"todo"` to `"error"`. Doing it earlier just turns CI red on known, already-triaged issues and trains everyone to ignore the signal.

## 3. Type discipline

**Current state.** A `grep -rn ": any" src/lib` run returns **52 occurrences across 51 files** (the brief's estimate of "~37 across ~33 files" undercounts what's actually there — possibly measured before recent additions like `Slider.svelte`, `TreeView.svelte`, `Accordion.svelte`, `SplitPane.svelte`, `BarMeter.svelte`, `Sparkline.svelte`, all currently untracked in `git status`). Of those 52, **48 are the `[key: string]: any` rest-props idiom** on a `Props` interface (e.g. `src/lib/atoms/Button.svelte:10`, `src/lib/molecules/Combobox.svelte:15`) — this is a defensible, common Svelte pattern for spreading arbitrary HTML attributes onto a root element, but it's currently undocumented as a deliberate convention rather than looking like untyped laziness.

The remaining **4 are genuinely untyped data**, not rest-props: `value: any` in `src/lib/molecules/EditableTableCell.svelte:6` (`// Bindable!`), `value?: any` in `src/lib/atoms/Select.svelte:5`, and `group: any` / `value: any` in `src/lib/atoms/Radio.svelte:5-6`. Beyond the literal `: any` grep, `src/lib/organisms/DataTable.svelte` uses `Record<string, any>` three times (`rows?: Array<Record<string, any>>` at line 12, `onrowclick?: (row: Record<string, any>) => void` at line 22, `cell?: Snippet<[Record<string, any>, Column]>` at line 24) — a pattern a naive `: any` grep won't even catch, so the genuinely-untyped surface is slightly larger than the raw count suggests.

**No generics exist anywhere in the codebase** (`grep -rl "generics=" src/lib` returns nothing) — confirmed. `DataTable` and `TreeView` are the two components where this is most visible: both take arbitrary row/node shapes and type them as `Record<string, any>` / an untyped node interface rather than being generic over the caller's type.

**Why it matters.** For an architecture-minded reviewer, this is the single highest-leverage change in the whole document. A design system with `DataTable<Row>` typed end-to-end — where `cell` snippets, `onrowclick`, and column accessors are all inferred from the row type — reads as senior TypeScript work. `Record<string, any>` reads as "TypeScript was bolted on."

**What to do.**
1. Document the rest-props idiom explicitly (a code comment convention or a line in the README/CLAUDE.md) so the 48 occurrences read as a chosen pattern, not 48 unaddressed lint suppressions.
2. Fix the 4 genuinely-untyped `value: any` cases — `Select`, `Radio`, `EditableTableCell` — with a generic or a narrower union, whichever the calling code needs.
3. A few days: make `DataTable` generic. In Svelte 5 this uses the `generics` attribute on the script tag:

   ```svelte
   <script lang="ts" generics="Row extends Record<string, unknown>">
     interface Props {
       rows?: Row[];
       columns?: Column<Row>[];
       onrowclick?: (row: Row) => void;
       cell?: Snippet<[Row, Column<Row>]>;
       rowKey?: keyof Row;
       [key: string]: any; // still fine for the rest-props spread
     }
     let { rows = [], columns, onrowclick, cell, rowKey, ...restProps }: Props = $props();
   </script>
   ```

   Callers then get `<DataTable rows={typedRows} columns={typedCols} onrowclick={(row) => ...} />` with `row` inferred as their concrete type inside the snippet and callback — no cast, no `any` at the call site.
4. Same treatment for `TreeView`'s `TreeNodeData` — make the exported interface generic over an optional `data` payload, or make the whole component generic over node type the same way.

## 4. `svelte-doctor` score

**Current state.** The committed `diagnostics_report.md` (generated `2026-08-01T12:41:12.696Z`, i.e. the same day as this document) reports **23/100, "Critical"**, with 121 warnings across 32/204 files. Re-running `npx svelte-doctor check` live right now (after the untracked additions — `Slider`, `TreeView`, `SplitPane`, `Accordion`, `BarMeter`, `Sparkline`, `BenchmarkTable`, `TableOfContents`, `Section`, `CaseStudyShell`, etc.) gives **20/100**, 132 warnings across 39/220 files — the score has drifted *down* since the report was generated, because new components carry the same unaddressed patterns. This is itself evidence for recommendation #2 below: the in-repo report is already stale relative to the working tree.

Reported category breakdown (from the committed report): Performance 100 warnings/penalty 100.0, Bundle Size 11/7.7, Architecture 8/6.4, State & Reactivity 2/2.4. The specific warning counts:
- **Inline event handler allocates a new function reference: 62 occurrences** — e.g. `src/lib/organisms/DataTable.svelte:118,149,155,189,203,224,230`, `src/lib/templates/SpreadsheetView.svelte` (13 occurrences alone).
- **Repeated allocation inside `$derived()`: 15 occurrences** — e.g. `src/lib/organisms/CommandPalette.svelte:34`, `src/lib/templates/CrmView.svelte:96,102,115`.
- **CSS `!important` override: 21 occurrences** — concentrated in `src/lib/organisms/Dialog.svelte`, `Drawer.svelte`, `Spine.svelte`, and the `CrmView`/`EditorView`/`SpreadsheetView` templates.
- **8 components over the 300-line budget** — I count **7** distinct oversized-component warnings in the committed report, not 8: `src/lib/templates/SpecimenView.svelte` (750 lines), `src/lib/templates/SpreadsheetView.svelte` (560), `src/lib/organisms/DataTable.svelte` (438), `src/lib/templates/CrmView.svelte` (437), `src/lib/organisms/Spine.svelte` (416), `src/lib/templates/EditorView.svelte` (381), and `src/lib/templates/CaseStudyTemplate.svelte` (323) — this last one wasn't mentioned in the brief but is present in the report at line 127.

**Why it matters.** A raw "23/100, Critical" score, read out of context, looks disqualifying. Read with the breakdown, most of the penalty is one rule (inline handlers, 62 hits, all "Performance") applied uniformly to a component library where inline closures in templates are often the more readable option than named handlers. Some of these warnings are real (the 300-line components genuinely hurt maintainability; the `!important` overrides genuinely fight the cascade). Shipping the diagnostics report in-repo — `diagnostics_report.md` is tracked and regenerable via `npm run diagnose` — is a maturity signal, but only once the score reflects a considered judgment rather than an unexamined 20/100.

**What to do.**
1. Triage per category, not per warning. For "inline handler allocates new function" (62 hits, the largest category): decide as a team-of-one whether this rule applies to a component library at all — Svelte re-creates these closures cheaply and the alternative (extracting every inline arrow to a named function) often reduces readability for one-line handlers. If the decision is "doesn't apply here," say so in a comment or a `svelte-doctor` config override, don't just leave it red.
2. Fix the categories that are unambiguously real: the 21 `!important` overrides (cascade problems compound) and the 7 oversized components (these are also driving the jscpd duplication in §5 — breaking up `CrmView`/`EditorView`/`SpreadsheetView` addresses both at once).
3. Re-run `npm run diagnose` after each pass and commit the refreshed `diagnostics_report.md` — right now it's already 3 points and ~20 files stale relative to the working tree.
4. Once the remaining score reflects genuine, considered debt rather than an unreviewed rule dump, the number becomes defensible to show a reviewer. A "61/100, here's what's left and why" is a far stronger artifact than either hiding the report or shipping a 20 with no annotation.

## 5. Duplication in the template layer

**Current state.** `jscpd` (both the committed report and a fresh re-run) shows **0% duplication in the `svelte` format** across the whole of `src/lib` — the component files themselves, including all of atoms/molecules/organisms, have zero detected clones. Duplication is concentrated in the `css` and `html` blocks jscpd extracts from the largest templates, specifically between `CrmView.svelte`/`EditorView.svelte` and `EditorView.svelte`/`SpreadsheetView.svelte`:
- A **168-line HTML clone** between `templates/EditorView.svelte` (lines 264–431) and `templates/SpreadsheetView.svelte` (lines 335–649).
- A 62-line HTML clone and a 58-line CSS clone between the same two files.
- Multiple smaller CSS/HTML/TS clones between `CrmView.svelte` and `EditorView.svelte` (14–47 lines each).

Aggregate numbers (committed report): css 21 clones/2.93% duplicated lines, html 6 clones/2.69%, svelte 0 clones/0%, typescript 4 clones/2.04%.

**Why it matters.** The atoms/molecules/organisms layers being clean is a real asset — it means the duplication isn't a systemic discipline problem, it's localized to three large templates that were probably built by copying one and adapting it. That localization actually makes this look worse to a careful reviewer, not better: the discipline clearly exists elsewhere in the codebase, so its absence here reads as "this part was rushed" rather than "the author doesn't know better."

**What to do.**
1. A few days: extract the shared 168-line block (and the smaller ones) from `EditorView`/`SpreadsheetView` into a shared organism — likely something like a generic "toolbar + content-pane + status-bar" shell that both templates compose, parameterized by their differing content.
2. Same treatment for the `CrmView`/`EditorView` overlap — the smaller clones there suggest a shared header/filter-bar pattern.
3. Re-run `npm run check:cpd` after extraction and confirm the `html`/`css` percentages drop toward the `svelte` format's 0% baseline.

## 6. Coverage and API-surface decisions

**Current state.** `src/lib` contains **83 `.svelte` files** (not ~68 — I recounted twice to confirm), and `src/stories` contains **49 `*.stories.svelte` files**, all of which map 1:1 to an existing component (no orphaned stories). That leaves **34 components without a story**, including exactly the ones flagged in the brief — `ContextualStrip`, `DetailPanel`, `FormSection`, `KanbanColumn`, `ToastRegion` — plus every template-level component (`AppShell`, `CrmView`, `DashboardTemplate`, `EditorView`, `ListDetailTemplate`, `SettingsTemplate`, `Shell`, `SpecimenView`, `SpreadsheetView`) and several of the newest case-study pieces (`CaseStudyCard`, `CaseStudyIndex`, `CaseStudyShell`, `DeepDive`, `TableOfContents`, `Section`, `BenchmarkTable`, `DecisionRecord`). The largest assemblies are indeed the least documented, as the brief states.

Separately, `src/lib/index.ts` exports **64 components** via `export { default as ... }`, out of 83 total `.svelte` files — **19 are not exported**. This is a broader set than just the four templates named in the brief: `CrmView`, `EditorView`, `SpecimenView`, `SpreadsheetView` are indeed unexported, but so are `Standfirst`, `PullQuote`, `Callout`, `MetricGrid`, `StackManifest`, `Sparkline`, `BarMeter`, `CaseStudyShell`, `BenchmarkTable`, `DecisionRecord`, `TableOfContents`, `Section`, `CaseStudyIndex`, `DeepDive`, and `CaseStudyCard` — largely the newer case-study layer, currently untracked in `git status`, which hasn't been wired into the public API yet.

**Why it matters.** `svelte-package` compiles the entirety of `src/lib` into `dist` regardless of what `index.ts` exports, so unexported components still ship in the package bundle — they're just unreachable from `import { X } from 'forest'`. That's fine if intentional (demo-only components used by `src/routes` for the showcase app), but right now it looks like an oversight rather than a decision, especially now that it's 19 files rather than 4.

**What to do.**
1. Make the export boundary a deliberate decision, file by file: is each of the 19 (a) library API that should be exported, (b) demo/showcase-only and should move to `src/routes/` so it stops shipping in `dist`, or (c) a work-in-progress that's intentionally unexported for now (plausible for several of the newest case-study files given they're still untracked)? Document the answer somewhere — even a one-line comment block in `index.ts` grouping "public" vs "internal" would do it.
2. Afternoon-scale, per component: write stories for `ContextualStrip`, `DetailPanel`, `FormSection`, `KanbanColumn`, `ToastRegion` — these are exported (library API) but undocumented, which is the worse combination of the two gaps.
3. A few days: stories for the template layer, once §5's extraction work stabilizes their shape (no point documenting a template you're about to refactor).

## 7. README

**Current state.** Read in full — it is near-unedited `sv create` scaffolding. It has generic sections ("Using it in an app", "Creating a project", "Developing", "Building", "Publishing") mixing real Forest-specific content (the `forest/styles/forest.css` import, the `--hue` theming line, `ToastRegion`/`toaster`, the `focusTrap` action, the `.on-ink` scope note) with boilerplate `sv create`/`npx sv create my-app` instructions that don't apply to someone consuming the published library. There's no description of what Forest *is*, no screenshots, no Storybook link, and no accessibility/testing posture statement.

**Why it matters.** It's the first thing anyone opens, costs nothing to fix relative to everything else in this document, and currently undersells what's actually distinctive — the paper/ink material system and the single-`--hue` theming approach are described well in scattered places (source comments, the existing "Using it in an app" section) but never assembled into a coherent pitch.

**What to do (an afternoon).**
1. Open with what Forest is and who it's for — the paper/ink surface metaphor and the "theme by rotating one CSS custom property" philosophy, which is genuinely distinctive and deserves to be the lead, not a buried paragraph.
2. Keep the good existing content (styles import, `--hue`/`data-mode`/`data-density`, `focusTrap`, `.on-ink`) and cut the generic `sv create` sections that don't apply to a consumer of the published package.
3. Add a live Storybook link (once one exists — see below), a couple of screenshots, and install/usage instructions.
4. Add an explicit, honest posture statement on testing and accessibility — pointing at this document or summarizing its state — rather than silence, which currently reads as "untested" by default assumption.

## 8. Architecture gaps

**Current state.** Confirmed: prior to the current (untracked) case-study work, there was no `setContext`/`getContext` usage anywhere in `src/lib` — no compound-component pattern existed. The only two files using context today are `src/lib/headingLevel.ts` and `src/lib/caseStudyToc.svelte.ts`, both part of the new, not-yet-committed case-study layer (wired through `CaseStudyShell.svelte`, `Section.svelte`, `DeepDive.svelte`, and `CaseStudyIndex.svelte`). So this gap is already being closed, just not yet merged/exported (see §6).

Separately, confirmed: **no `ResizeObserver` usage anywhere in `src/lib`**, and no virtualization of any kind (`grep -rli "virtual" src/lib` returns nothing). `DataTable` and `TreeView` both render every row unconditionally — there's no windowing, no `IntersectionObserver`-based lazy rendering, nothing.

**Why it matters.** For a library that ships a spreadsheet template (`SpreadsheetView`) and a CRM template (`CrmView`), rendering every row is a real ceiling, not a theoretical one — these are exactly the surfaces most likely to be shown with realistic (i.e., large) datasets in a portfolio demo. It's also, of the gaps in this document, the one most likely to read as a genuine engineering achievement if closed: virtualization is legible, it's hard to fake, and it's the kind of thing that separates "styled a table" from "built a table."

**What to do.**
1. Treat the context/compound-component pattern as done-in-progress — once the case-study components are exported (§6), this gap closes itself. Worth a one-line mention that the pattern now exists, as a positive data point.
2. Virtualization is a sustained project, not an afternoon fix: pick `DataTable` first (higher-traffic component), implement windowed rendering (either hand-rolled with a scroll-position `$derived` and a rendered-range slice, or via a small dependency), and validate it against a few-thousand-row dataset in a story. `TreeView` virtualization is harder (variable-depth, expand/collapse) and can follow once the `DataTable` pattern is proven.
3. This is the single highest-value addition in this document if the goal is a legible showpiece for an AI/ML- and architecture-minded reviewer — it's worth prioritizing above some of the smaller a11y/type fixes if time is scarce, precisely because it's demonstrable rather than just correct.

## 9. Release discipline

**Current state.** `package.json` version is `0.0.1`. No `CHANGELOG` file exists at the repo root. No `.github/workflows` directory exists — there is no CI configuration at all. `prepack` runs `svelte-kit sync && svelte-package && publint` (confirmed in `package.json`), which is a reasonable packaging gate, but nothing invokes it automatically — it only runs on `npm pack`/`npm publish` or when someone remembers to run it by hand.

**Why it matters.** None of this is visible until a reviewer looks for it specifically (clones the repo, checks for Actions, checks git tags) — but when they do look, "no CI" on a library making testing/accessibility/architecture claims elsewhere undercuts those claims. It's cheap to fix relative to its effect on how "shipped" the project feels.

**What to do.**
1. An afternoon: add a minimal GitHub Actions workflow that runs `npm run diagnose` and `npm run prepack` on push/PR. Given §1 and §4, wire in `npm run test` and `npm run lint` too once they're meaningful gates rather than empty ones.
2. Adopt either Changesets or plain semver discipline (bump on every meaningful merge, tag releases) — either is fine, but pick one and note the choice in `CONTRIBUTING`-equivalent docs so it isn't ad hoc.
3. Start a `CHANGELOG.md` now, even retroactively summarizing what's shipped since `53566aa`/`9c4a41d` — an empty changelog going forward is much easier to justify than reconstructing history later.

---

## Claims I could not verify or that differ from the brief

- **"~37 `: any` occurrences across ~33 files"** — I measured **52 occurrences across 51 files** with the same `grep -rn ": any" src/lib` command. The gap is likely explained by recently added, currently-untracked components (`Slider.svelte`, `TreeView.svelte`, `Accordion.svelte`, `SplitPane.svelte`, `BarMeter.svelte`, `Sparkline.svelte`, etc.) not present when the original count was taken. I used my own measured numbers throughout §3.
- **"~49 story files for ~68 components"** — story count (49) matches; component count does not. `find src/lib -name "*.svelte" | wc -l` returns **83**, confirmed on two separate runs. I used 83 throughout §6.
- **"8 components over a 300-line budget"** — the committed `diagnostics_report.md` contains **7** distinct "Component has N meaningful lines (limit: 300)" warnings, not 8 (`SpecimenView` 750, `SpreadsheetView` 560, `DataTable` 438, `CrmView` 437, `Spine` 416, `EditorView` 381, and `CaseStudyTemplate` 323 — the last wasn't named in the brief). I could not find an 8th; if one exists it isn't in the report as currently committed.
- **"Reported as 23/100"** — confirmed, that's what's in the committed `diagnostics_report.md`. I additionally re-ran `svelte-doctor` live and got 20/100 (132 warnings, 39/220 files) — the working tree has drifted from the committed report since it was generated, which I've noted in §4 as evidence the report needs to be kept current, not as a correction of the brief.

Everything else in the brief — the DataTable/TreeView/DropdownMenu/SplitPane/Slider accessibility specifics, the `a11y: { test: 'todo' }` setting, the Combobox/Dialog/Drawer/CommandPalette/Accordion/DataTable strengths, the jscpd duplication figures and the 168-line clone, the four unexported templates (a subset of the 19 I found), the README's scaffolding state, the pre-existing absence of `setContext`/`getContext` and of virtualization/`ResizeObserver`, and the release-discipline facts (version, no CHANGELOG, no CI, `prepack` script) — checked out exactly as described.
