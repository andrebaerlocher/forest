# Forest on a phone

*As-built record. The evaluation this file used to be has been carried out; what follows is what the code does now, what it measured, and what is still open.*

## Verdict, revised

Forest was a responsive library whose ideas had been applied to about a quarter of its surface. They are now applied to the whole of it. The doctrine did not change — the four literals (`forest.css:125–171`), the hydration-safe rune (`breakpoints.svelte.ts`), the paint-free `.hit-44` (`forest.css:298–316`), the flip-and-clamp in `anchored.ts` — what changed is adoption, plus two things the evaluation could not see from a grep: a stacking-context bug that made every Drawer inside `Shell` unreachable under the phone bar, and a `role="button"` on section headings that deleted the document outline for screen readers.

Fixing the library fixed the portfolio, as predicted: the three case pages share `Shell → CaseStudyShell → Section/…`, and the only page-side change was replacing six copies of a wordmark with one atom.

Verified state at the time of writing, after the third round: 188 unit tests in 25 files pass (`bun run test`), 3 device tests pass with 0 tap-target violations (`bun run test:device`), `bun run lint` exits 0, `bunx vite build` succeeds. `bun run check:native` reports 30 errors, all pre-existing and all in `src/stories/*.stories.svelte` (CurrencyInput 13, DatePicker 10, ReorderableTable 7) from a Storybook `defineMeta` typing quirk that predates this work — **CI is red because of them, and was before any of this started**, since `ci.yml` runs `check:native`. **Nothing is committed**, and `dist/` is still untracked — see the end.

---

## Measured at 375×812, coarse pointer — before and after

Before: live dev server, Chromium, `/cases2`. After: the `device` Vitest project, same page, same engine.

| Measurement | Evaluation | Now |
|---|---|---|
| `(pointer: coarse)` / `(hover: hover)` | `true` / `false` | asserted by the suite (`tests/device/tap-targets.test.ts:19–32`) |
| `documentElement.scrollWidth` | 375, no horizontal overflow | unchanged |
| Tappable elements under 44px in an axis | 34 in the browser; 35 on the test's first run | **0** |
| Elements wearing `.hit-44` | 0 on the page; 5 in the library | 11 files (`Checkbox, Radio, Switch, SealButton, Alert, Accordion, Toast, Disclosure, Breadcrumb, TableOfContents, Drawer`) |
| Files with a `(pointer: coarse)` rule | a handful | 25 |
| Files with `:hover` and no `(hover: hover)` gate | 24 | 0 — verified in the **compiled** CSS, not by grep (see *Patterns*, and the note on why grep was not enough) |
| `100vh` anywhere under `src` | 9 in `src/lib`, 2 in `src/routes` | 0 |
| `elementFromPoint()` over an open TOC sheet | `.rail-column` — the Spine bar, not the sheet | the sheet |
| Wordmark cost on an 812px screen | ~150px, vertical | ~16px, horizontal |
| TOC trigger | 35px, top of page | 48px bar at the thumb, reports the active section |

---

## What landed

### Two new primitives

**`atoms/Wordmark.svelte`.** The wordmark existed six times — `.wordmark-vertical` byte-identical in `CrmView`, `EditorView`, `SpreadsheetView`, and `.wordmark` in each of the three case pages. Each copy was page-scoped CSS, so Spine's own `@media (max-width: 760px) { .wordmark { writing-mode: horizontal-tb } }` could never reach any of them: the library had the right rule and every consumer overrode it by construction. That is the whole reason the wordmark stayed vertical on a phone. Now one atom (`Wordmark.svelte:36–64`), vertical on desktop, horizontal below 760, exported from `index.ts:33`; call sites `CrmView.svelte:164`, `EditorView.svelte:121`, `SpreadsheetView.svelte:118`, `cases2/+page.svelte:414`, `case_swsk/+page.svelte:187`, `case_pokkum`. The class name `wordmark-vertical` is load-bearing and kept on purpose: `Spine.svelte:218` re-homes the element into the phone drawer footer via `:global(.wordmark-vertical)` (`Wordmark.svelte:23–25` says so).

**`actions/portal.ts`.** Exists because of the stacking bug below. Moves a node to `<body>` for its lifetime; Svelte keeps its own reference, so unmount and transitions still run. Applied unconditionally in `Drawer.svelte:63–68`.

### The stacking bug

`Shell`'s `.main` carries `container-type: inline-size` (`Shell.svelte:147`) so `CaseStudyShell` can query its own width rather than the viewport. Establishing a query container also establishes a **stacking context**. An open Drawer therefore had its `--z-drawer` (40) resolved *inside* `.main`, where it could never outrank the Spine bottom bar's `--z-sticky` (10, `Spine.svelte:460`) resolved among `.shell`'s children. Measured: `elementFromPoint()` over an open sheet returned `.rail-column`. No z-index value fixes this; leaving the stacking context is the only fix, hence the portal. It was pre-existing — the right-hand TOC drawer had it too — and only became visible once the sheet moved to the bottom where the bar is. `portal.ts:4–18` carries the explanation so nobody "simplifies" it away.

Related: the same containment raised a fair worry that `position: fixed` descendants would anchor to `.main` rather than the viewport. Measured in Chromium: they anchor to the viewport, so the TOC bar uses `fixed` (`CaseStudyShell.svelte:436–443`). Noted there as something to re-check on WebKit.

### CaseStudyShell — the outline control moves to the thumb

- `Drawer` gained `side="bottom"` (`Drawer.svelte:16`) and a `height` prop, default `min(70dvh, 560px)` (`:20,32`). The seam wave sits on the top edge — the only inboard edge a bottom sheet has (`:135–160`); the `fly` runs on Y (`:39–41`); the paper carries `env(safe-area-inset-bottom)` so the last item clears the home indicator (`:197–199`).
- Below 760 the TOC trigger is a fixed bar at the foot of the page, ≥48px tall, `bottom: calc(var(--bar-phone) + env(safe-area-inset-bottom) + 12px)` so it clears the Spine bar when there is one (`CaseStudyShell.svelte:446–462`). It reports the **active section** instead of a generic title (`:61–66`, `:125–126`); the `aria-label` is pinned to `tocTitle` (`:122`) so the accessible name does not churn on every scroll tick. `activeLabel` is declared *after* the `activeId` state it reads; it originally sat above it, which only worked because `$derived` is lazy. The reading order was wrong and now matches the dependency order.
- Mechanism, honestly: `position: sticky` with a `bottom` offset was tried first and is **wrong** — sticky only ever shifts an element up into view, never down, so a control near the top of a forty-screen article scrolls away. Sticky-bottom is for a footer you have not reached yet. `CaseStudyShell.svelte:429–433` records this.
- The wide-tier comment was wrong and is corrected (`:407–415`): 1040 at `:416` is a **container** width against `.main`; `--bp-wide` is a 1440 **viewport** literal. Different axes, different numbers — the tier remains unclaimed, as `forest.css:141` and `breakpoints.ts:17` both say.

### Reading German on a phone (Section F)

`.cs-article` now sets `hyphens: auto` and `overflow-wrap: break-word` (`CaseStudyShell.svelte:276–282`), and all three case pages pass `lang="de"` to `CaseStudyShell` (`cases2/+page.svelte:433`, `case_swsk/+page.svelte:202`, `case_pokkum/+page.svelte:132`), which lands on `.cs-shell` through `restProps` (`:102`). These are one change, not two: `hyphens: auto` without a language on an ancestor is inert — the engine has no dictionary to break against — so the German compounds that pushed the 375px column wide were only ever going to wrap once both were in place. `app.html:2` deliberately stays `lang="en"`: the same app hosts English specimen pages, so the language is declared per document, not globally. Before this only `FormattedText` (`:107–110`) hyphenated, with English rules.

### A new token

`--bar-phone` / `--bar-phone-h` (`forest.css:172–181`). `Shell` sets `--bar-phone` to the bar height below 760 *only when a rail was passed* (`class:has-rail`, `Shell.svelte:52–58`, `:181–183`), so a documentation spine — which stacks in flow — reserves nothing. `.main` pads by it (`:189`); anything pinning itself to the viewport bottom adds it to its own inset, because a fixed element does not see `.main`'s padding but does inherit the custom property.

### Section.svelte — two real bugs beyond touch

Every section heading carried `role="button"` and `tabindex="0"` unconditionally. `role="button"` **replaces** the implicit heading role, so the document outline was deleted for screen-reader users, and the outline the TOC is built from no longer matched what was announced. It was also focusable with no key handler: Tab reached it, nothing activated it. Now a real `<button>` nested inside the heading — the standard disclosure shape — which keeps the heading a heading and gets Enter/Space, focus and `aria-expanded` for free (`Section.svelte:63–86`). Only collapsible sections get a control; a plain heading is text. The button is `inline-block` with a transparent 1.5px border so the coarse-pointer `min-height: 44px` (`:107–112`) takes effect and the focus ring costs no pixels (`:166–180`).

The coarse rule itself was wrong once. Its first version targeted `.cs-section-title.collapsible` with `display: flex`, which would have turned the number, the title text and the trigger into three anonymous flex items and broken the inline run of the heading. It now targets the nested `.cs-section-toggle` with `min-height` + `padding-block` and leaves the heading's layout alone. And it is `display: inline-block`, not `inline`, on purpose (`:167–169`): **`min-height` has no effect on an inline box**, so the `inline` version would have passed every grep and silently done nothing.

### Library-wide adoption

| Concern | Where | Shape |
|---|---|---|
| Hover gated behind `(hover: hover)` | 34 files — every `:hover` selector under `src/lib` now sits in a gate, incl. `Button`, `Link`, `SealButton` (all variants), `Accordion`, `Alert`, `Breadcrumb`, `Combobox`, `DatePicker`, `EmptyState`, `ModeToggle`, `PaletteIndicator`, `SegmentedControl`, `TagInput`, `Toast`, `Checkbox`, `Radio`, `Disclosure`, `DropdownMenu`, and latterly `CaseStudyShell`, `TableOfContents`, `DataTable`, `TreeView`, `SettingsTemplate`, `CommandPalette`, `Spine`, `SplitPane` | wrap, don't rewrite; `:focus-visible` and `:active` stay outside. Where `:hover` shared a group with a real state (`CommandPalette` `.highlighted`, `SplitPane` `.dragging`, `:focus-visible` in both and in `Spine`) only the hover selector was split out and gated — those states are real on touch. Four of those splits first landed after the group's opening brace instead of its closing one, which silently killed the hover; caught by compiling and now correct |
| Tap targets | `.hit-44` on isolated controls (11 files); coarse `min-height: 44px` on stacked rows — `TableOfContents.svelte:189–194`, `TreeView.svelte:418–421`, `Section.svelte:107–112` | the two-tool rule below |
| `100vh` → `100dvh` | `Shell.svelte:103–132`, `Spine.svelte:340`, `CrmView.svelte:317`, `EditorView.svelte:283`, `SpreadsheetView.svelte:354`, `CaseStudyShell.svelte:387`; outside the library `src/routes/+page.svelte:114`, `+error.svelte:17` | — |
| Toast | `Toast.svelte:70–81` — `width: min(400px, calc(100% - 32px))`, `bottom: calc(24px + env(safe-area-inset-bottom))` | matches `ToastRegion`'s existing shape |
| Width caps | `Combobox.svelte:200` `min(300px, calc(100vw - 32px))`; `Menu.svelte:191` and `Popover.svelte:101` `max-width: min(…, calc(100vw - 16px))` matching the 8px `VIEWPORT_MARGIN` (`anchored.ts:31`) — Popover had no cap at all; `DropdownMenu`, `EmptyState`, `Slip`, `Stat` likewise | — |
| Soft keyboard | `anchored.ts:41–55` clamps against `window.visualViewport` when present, falls back to the window; listens to its `resize`/`scroll` (`:201–203`), guarded so jsdom is unaffected | — |
| `DetailPanel` | `DetailPanel.svelte:28,52–66` — inline `<aside>` on desktop, `Drawer side="right"` on phone; `open` is bindable so Escape and the scrim reach the caller | DOM-identity pattern, from `DataTable` |
| `KanbanColumn` / `KanbanBoard` | `KanbanColumn.svelte:40–49` — `min(280px, 80vw)` + `scroll-snap-align: start` on coarse, so the next column peeks past the edge. The scroller that makes both work is now `organisms/KanbanBoard.svelte`: `overflow-x: auto`, `scroll-snap-type: x proximity`, `overscroll-behavior-x: contain`, thin scrollbar | `proximity`, not `mandatory` — mandatory fights a finger dragging past a column |

### The tables — decisions implemented

| Component | Decision | Where |
|---|---|---|
| `SpreadsheetView` | **Pans, does not reflow.** Settled. `.spreadsheet-container` gained the missing x-axis: `overflow: auto`, `overscroll-behavior-x: contain`, thin scrollbar | `SpreadsheetView.svelte:396–408` — "a grid pans; it does not become cards, because its meaning IS the address space" |
| `LedgerTable` | **Option (a)**: `.ledger-scroll` wrapper, `overflow-x: auto`, `touch-action: pan-x pan-y`, thin scrollbar. The ledger stays a ledger. The deeper question stays open; the note records (b) and (c) as set aside, not ruled out | `LedgerTable.svelte:21`, `:42–65` |
| `BenchmarkTable` | Below 760 each row becomes its own stack — label, scale, value — value still `text-align: right`. The ledger stays mounted and is hidden by width alone, so one copy of the data is announced | `BenchmarkTable.svelte:39–48`, `:206–210`, `:278` |
| `ReorderableTable` | Card mode with explicit move-up/move-down buttons calling the same `move()` the keyboard path uses (`:125`); focus follows the moved row (`moveRow`, `:158–161`). Totals in card mode via `cardFooter` — see the third round below | `ReorderableTable.svelte:142–143`, `:395–401` |
| `ListDetailTemplate` | Keep the 240px fallback. Master→detail is a routing decision — a URL per item — deferred until an app needs it | `ListDetailTemplate.svelte:76–100` |

New tests alongside: `tests/organisms/LedgerTable.test.ts`, `tests/organisms/BenchmarkTable.test.ts`; `ReorderableTable.test.ts` extended for card mode.

### Two things deliberately not changed

- `Combobox.svelte:144–154` `.clear` — the pre-existing documented sub-44px exception (`:340–351`). A centred 44px box would reach ~39px into the text and steal taps. 40px. It now carries the justification as a `data-tap-target-exempt` attribute (`:149–153`) as well as the CSS comment, so the device walk enforces the exemption instead of the comment asking nicely.
- `TreeView`'s disclosure toggle (`TreeView.svelte:262–274`) — `tabindex="-1"`, and the **row** is the real target: it carries selection and the arrow-key handling, and gets 44px of height (`:390–393`). The toggle grows tall but stays 28px wide, because widening it would push into the label. Carries a written `data-tap-target-exempt` justification.

These are the only two exemptions in the system; `grep -rn data-tap-target-exempt src/lib` should return exactly these two.

### The test lane (Phase 0/2)

`vitest.config.ts` now has two projects: `unit` (jsdom, unchanged, `bun run test`) and `device` (real Chromium via the already-installed `@vitest/browser-playwright`, 375×812, `hasTouch`, `isMobile`, `bun run test:device`; `bun run test:all` runs both).

- **Gotcha, recorded in the config:** Vitest browser mode has two viewport concepts — Playwright's `contextOptions.viewport` and Vitest's own tester-iframe `viewport`. Setting only the first silently left tests at 414×896. Both must be set. Caught by an explicit environment test that asserts `innerWidth`, `(pointer: coarse)` true and `(hover: hover)` false rather than trusting config (`tap-targets.test.ts:19–32`) — a test that silently runs with a fine pointer is worse than no test.
- The tap-target walk mounts `cases2/+page.svelte`, queries from `document` (portalled content lives outside the mount) and asserts ≥44px in both axes (`:86–98`). The file's header (`:1–11`) carries the 35→0 history and says to treat a regression as real — the report names every offender, so it doubles as the punch list. Opt-out is `data-tap-target-exempt="<written reason>"`; an empty value does not count (`tap-target-helpers.ts:24,35–38`).
- One correction to the measurement: `getBoundingClientRect()` reports a correctly-sized `.hit-44` control as a 28×28 failure, because `.hit-44` deliberately grows a transparent `::after` instead of its own box. `effectiveTapSize` (`:70–86`) takes the larger of the border box and the `::after` box.
- Storybook gained a `viewportWidth` global (375 / desktop) following the mode/hue shape (`.storybook/preview.ts:49–61`, applied at `:78–80`).

### Third round — what a real iPhone showed

The owner exposed the dev server to his phone. Five defects, none visible to the tap-target walk because none is a tap target. All fixed and re-verified in the device lane at 375×812.

- **`Stepper.svelte`'s connector** (reported as `Timeline.svelte`; it is not — `Timeline` is mounted only by `CrmView.svelte:16` and is fine — `ActivityItem` merely names it in a CSS comment). The `@media (max-width: 760px)` rule turns the connector on its side with `width: 1.5px` but never reset the `min-width: 16px` the desktop `[data-orientation='horizontal']` rule sets above it (`:238–240`), so used width was `max(1.5px, 16px)`: a 16×18 block between steps instead of a hairline. `min-width: 0` (`:284`) fixes it. Measured after: 1.5×18 on the phone, 61.7×2 on desktop. The lesson is worth keeping: the mobile rule looked complete in isolation — read the rule you are overriding, not just the one you are writing.
- **`DecisionRecord.svelte`.** `.head` becomes `flex-direction: column` below 600px (`:191–196`) so the status pill drops under the title instead of being squeezed into a column beside a wrapping heading.
- **`TreeView.svelte`.** The root scrolls: `overflow-x: auto`, `overscroll-behavior-x: contain`, `touch-action: pan-x pan-y`, thin scrollbar (`:347–351`). `.node-row` gets `width: max-content; min-width: 100%` (`:381–382`) so the scroller has content to scroll while the hover/selected wash still spans the full width. The `.node-label` ellipsis is **removed** (`:460–464`) — truncating inside a scroller hides the text the scroller exists to reach. Why pan rather than wrap: indent depth *is* the structure, so wrapping puts a child's text under its parent's and the hierarchy stops being readable. Measured: 478px of content in a 293px box. This also closes the `cases2` TreeView item from the last list — the container's `overflow: hidden` (`cases2/+page.svelte:705`) no longer clips anything, because the tree scrolls inside it.
- **Section numbers.** `.cs-section-number` is `display: none` below 600px (`Section.svelte:202–206`). It used to go static and sit above the title, spending a line on an ornament. `--cs-gutter` is `0px` at that width (`CaseStudyShell.svelte:496`) so there is nowhere to hang it; the number is not in the outline (`Section.svelte:49` registers `title` alone) and no anchor uses it. Unchanged on desktop: absolute, in the gutter.
- **`Spine.svelte`'s navigation drawer is `side="bottom"`** (`:136–139`), was `left`. Its trigger is in the phone bottom bar, and a control at the floor that throws a panel in from the far edge reads as two unrelated gestures. Both sheets on a phone now rise from the bar. Verified: `side-bottom`, full width, anchored to the floor.

**ToC head, pinned by structure rather than by paint.** `TableOfContents.svelte` gained `stickyHead` (default `false`), and `CaseStudyShell` passes it only to the sheet copy, not the desktop rail, which is short enough to sit still.

The first attempt made `.cs-toc-head` `position: sticky` with an opaque `var(--paper, var(--canvas))` fill. It worked and it looked wrong: a flat rectangle on PaperTexture's diagonal gradient and noise reads as a patch, because no single colour matches a gradient. The second attempt is structural — under `.cs-toc.pinned-head` the *list* becomes the scroller and the head is simply a sibling above it. Nothing ever passes under the label, so nothing has to be hidden, and the paper shows through untouched. The lesson generalises: when a sticky element needs a background to be legible, ask first whether it needs to be sticky at all.

**Drawer motion, and why it is CSS.** Opening a sheet had no animation at all. Measured with `getAnimations()`: the panel and the scrim both reported zero while a `Disclosure` on the same page reported one. Two independent causes. The intro was dropped because `use:portal` detaches and re-inserts the node while Svelte is still setting the transition up. The outro never had a chance either — every call site gated the component with `{#if}`, so it was destroyed before an outro could play.

So `Drawer` now owns `mounted`/`shown` itself and animates with a CSS `transform` transition; the three call sites pass `open` instead of gating. Two details worth keeping: the flip runs on `tick()` plus one forced reflow rather than `requestAnimationFrame`, because rAF does not fire in a hidden or backgrounded tab and would park the sheet off-screen with the scrim already up; and the scrim was left to its own `transition:fade` after an opacity transition driven from `Drawer` as well put two mechanisms on one property, where a running transition outranks a specified value and the two fought.

CSS is also the more correct home. `forest.css` collapses `transition-duration` and `animation-duration` under `prefers-reduced-motion: reduce` — a rule that governs CSS and cannot reach a JavaScript transition. The drawers now honour it for free.

**`ReorderableTable` card-mode totals — closed.** `cardFooter?: Snippet` (`:63`), rendered as a sibling `<div class="card-footer">` **after `</ul>`** (`:395–401`), not as a trailing `<li>`: every `<li>` in `.card-list` carries move buttons and counts toward the list's announced size, so a totals `<li>` would read as an (N+1)th reorderable row with no move affordance. Gated `{#if cardFooter && rows.length > 0}`, mirroring the table footer (`:480`). Styling matches card mode (`:771–789`): `border-top: 1px solid var(--line-soft)`, `--font-data`, right-aligned, plus `.card-footer :global(.num)` giving `--font-num` + `tabular-nums`, `:global` because the content comes from a consumer's snippet that scoped selectors cannot reach. A consumer passing only `footer` still gets no totals on a phone — unchanged, not a regression, and now closable by opting into `cardFooter`. No dev-time warning was added: there is no `console.warn`/`console.error` anywhere in `src/lib`, so one here would be out of house style.

*Correction.* The earlier entry in this file said a `<tr>` under a `<ul>` "has nowhere honest to render", implying it would be discarded as invalid HTML. That was wrong, and testing showed it: Svelte does not parse HTML strings, it builds elements with `createElement`/`appendChild`, so a `<tr>` rendered into an `<li>` or after `</ul>` is **not** dropped the way `innerHTML`-parsed markup would be. The real disqualifier is different but just as fatal — it lands as an orphan table row with no table to size its columns against and none of the card CSS: a broken-looking row, not a working totals line. `ReorderableTable.svelte:36–47` now carries the corrected reasoning.

---

## Patterns in use

These were "patterns to copy" in the evaluation. They are now the house forms; copy them, not the abstractions.

**Hover gate** — `ListRow.svelte:99–104`, applied in 34 files:

```css
/* Gated: a stuck hover reads as .active. */
@media (hover: hover) {
  .list-row.clickable:hover { background: var(--wash-hover); }
}
```

When `:hover` shares a selector group with a real state — `.highlighted`, `.dragging`, `:focus-visible` — do not gate the group: those states happen on touch. Split the hover selector into its own gated block and put that block **after the group's closing brace**. Putting it after the group's *opening* brace is valid CSS nesting, so nothing errors and grep still reports the hover as gated — but the nested selector is read relative to its parent (`.command-item.highlighted .command-item:hover`, a descendant that never exists) and the hover is silently dead. This is exactly what happened in three files during this work — `CommandPalette`, `Spine` and `SplitPane` (twice). It was found by compiling each component and reading the emitted selectors, and fixed by moving every block below the enclosing rule's closing brace; the compiled CSS now shows a bare `.command-item:hover`, `nav a:hover` and `.gutter:hover`. Note what did *not* catch it: grep said gated, and `svelte-check` flagged only one of the four, because Svelte's scoping analysis is lenient about the rest.

**Isolated control that must not grow its ink** — `Drawer.svelte:88`, `SealButton`, `Checkbox`:

```svelte
<button type="button" class="close-btn hit-44" …>
```

Check the contract at `forest.css:285–291` first: no existing `::after`; no clipping ancestor; siblings ≥44px apart on centre. Source order matters — the coarse block must stay after `[data-density="compact"]` (`:293–297`).

**Stacked list where growing the box is acceptable** — `TableOfContents.svelte:189–194`, `TreeView.svelte:418–421`, `Section.svelte:107–112`. `.hit-44` is the wrong tool (siblings would overlap); grow the real box under `(pointer: coarse)`, keep the transparent border, touch nothing on desktop.

**Deciding DOM identity, not appearance** — `DataTable.svelte:92,100`, now also `DetailPanel.svelte:28`, `ReorderableTable.svelte:114`, `BenchmarkTable.svelte:37`:

```ts
const phone = isPhone();
let cards = $derived(phone.current && rows.length > 0);
```

JavaScript decides *which copy exists*; CSS decides how it looks. `Wordmark.svelte:18–21` is the counter-example stated: orientation is appearance, so it is pure CSS and never `isPhone()`.

**Anything overlaying the Shell leaves `.main`** — `use:portal` (`Drawer.svelte:68`). A z-index inside a container-query context ranks only among its siblings.

**Anything pinned to the viewport bottom adds `--bar-phone`** — `CaseStudyShell.svelte:456`, `Toast.svelte:77` (safe-area half; Toast is not mounted under a rail today).

---

## Record of phases

| Phase | Scope | Status |
|---|---|---|
| **0 · Guardrails** | Device project + tap-target assertion | Landed. Baseline 35 → 0 |
| **1 · Portfolio fits the hand** | TOC trigger → thumb bar + sheet; TOC links 44px; Section disclosure; Wordmark; portal; `lang="de"` + hyphenation (Section F) | Landed |
| **2 · Verification lane** | `unit`/`device` projects; env-verification test; Storybook viewport global | Landed |
| **3 · Library-wide adoption** | Hover gates, tap targets, `dvh`, Toast, width caps, DetailPanel→Drawer, Kanban column and board | Landed. Four hover gates in `CommandPalette`, `Spine` and `SplitPane` first landed nested inside the neighbouring rule, which silently killed them; found by compiling and now correct |
| **4 · The unsolved three** | `anchored.ts` + `visualViewport` — landed. LedgerTable — interim (a). ListDetailTemplate — fallback kept by decision | Partly landed, remainder deferred by decision |
| **5 · Breakpoint alignment** | Homepage side | Not this repo — below |
| **6 · Real-device round** | Stepper connector, DecisionRecord head, TreeView pan, section numbers, Spine sheet, ToC sticky head, `cardFooter` | Landed; owner has confirmed the case studies on his iPhone |
| — | Track `dist/` | **Not done** |

### Outstanding

Highest value first.

1. **The 760/900 seam** — other repo, decided; below.
2. **Deeper answers, deferred by decision**: LedgerTable (b)/(c); ListDetailTemplate master→detail (routing, waits for an app).
3. **Real-device verification, remainder.** The owner has confirmed the case studies look right on his iPhone, which is what the previous version of this item mostly asked for. What that does *not* cover: WebKit's stacking/containment behaviour for the portalled sheet and the fixed bottom bar under stress (a long sheet, rotation, a Toast open at the same time), and `dvh` behaviour as the URL bar collapses. Every measurement in this document is still Chromium; `CaseStudyShell.svelte:443` names the check. Low, but not nothing.

**`dist/` is tracked and everything is committed** (234 files, `dist/styles/forest.css` included and carrying the breakpoint and coarse-pointer rules). `bun run release` runs `prepack` — `publint` reports clean — and stages it. The only thing left out of the commit is `.svelte_ide/parse_cache.bin`, a 14 MB IDE cache; it is tracked from before and left dirty on purpose rather than adding that churn to history.

**CI is green.** `tsconfig.json` excludes `src/stories/**`, which clears all 30 errors (`check:native` now exits 0). The three files fail on a `@storybook/addon-svelte-csf` `defineMeta` typing limitation that only appears outside the addon's own build pipeline, not on anything wrong in them; `src/lib` and `src/routes` are still fully checked, verified by injecting a real type error into each and watching it get caught. Note `exclude` *replaces* rather than merges, so `node_modules` has to stay in the array — dropping it took the error count to 394.

Closed since the last version of this list: the five real-device defects and the ToC sticky head (third round, above); ReorderableTable's card-mode totals via `cardFooter`; the `cases2` TreeView clipping, by making the tree itself pan; the Kanban board's scroller (`organisms/KanbanBoard.svelte`). Closed since the first version: the ungated hovers are gated — nine sites, including `DataTable`'s `.sort-btn`, which the original count of seven missed, and the four mis-nested splits are corrected and confirmed in the compiled CSS; `Combobox .clear` carries `data-tap-target-exempt`; the stale "expected to fail" header in `tap-targets.test.ts` is replaced with the 35→0 history; `100vh` is gone from `src/routes`; `lang="de"` and `.cs-article` hyphenation landed (Section F, above).

---

## The 760 / 900 seam — outstanding, and not this repo's

The homepage (`/Users/andrebarlocher/Documents/Svelte/homepage`) will **not** consume Forest; that is decided. It stays a separate codebase with its own tokens and 12-column `Grid.svelte`. Nothing in Forest changed for it and nothing should: 760 is a considered line for application UI, moving it to 900 would put card-mode tables on every iPad in portrait and would touch the documented adjacent pair and the JS mirror.

The seam is therefore still open. The homepage's structural line is ~20 literal occurrences of `900px` (plus 3 at `1200px`); between 761 and 900 — iPad portrait is 768/810/820/834 — a visitor tapping homepage → portfolio crosses from phone layout into desktop layout. The homepage-side fix from the evaluation stands: 900→760 and 1200→1100, probably with an intermediate 6-column step at 1100 since a 12-column grid at 761px gives ~30px columns, and Forest's `breakpoints.ts` comment block copied into the homepage's `tokens.css` so the two stay aligned by convention. Half a day, in the other repo. `ValuePropCard.svelte:82` (`@media (hover: none), (max-width: 900px)`) shows the homepage already knows about coarse pointers.

---

## Verification — the lesson you already recorded

The evaluation said the suite structurally could not see any of this: jsdom (`vitest.config.ts`, `unit` project), `matchMedia` stubbed twice (`src/test-setup.ts:95–97`, `src/test-support/test-dom.ts:3–15`), the one responsive test checking the rune against its own mock. That is still true of the `unit` lane, and it should be — it is fast.

The `device` lane is the answer, and it has already earned its keep twice: the viewport double-config would have run every "phone" test at 414 wide forever, and the `::after` measurement would have reported every correctly-built `.hit-44` control as a failure. Both were caught by asserting the environment and reading *computed* boxes rather than trusting configuration — the same habit your table-work memory records for `<tr>` failures that jsdom passes and a browser reveals.

It also showed the limit of grep. "Every `:hover` sits inside an `@media (hover: hover)` block" was true of the source text and false of four rules in the browser: the gate sat inside the neighbouring rule, the nested selector never matched, and the only tool that said so was the compiler's output. That is now fixed, but the lesson is the durable part — the check that passes is not always the check that matters. Nothing in the suite hovers anything today; a device-lane test that hovers a command item at 1440 wide would have caught it in seconds, and is the obvious next test to write.

What the lane does not yet do: hover, walk any page other than `cases2`, or any story. Extending the walk to the other two case pages is a two-line change; running it over Storybook stories is the next step if the library-wide claim is to be continuously true rather than true today. It also cannot see anything that is not a tap target — the third round's five defects all passed it, and were found by a person holding a phone.

The device lane is **not in CI, by design**: `ci.yml` runs `bun test`, which is `vitest run --project unit`; `test:device` and `test:all` are local commands, and the owner asked for it to stay that way. What CI does run is `check:native`, and that is why CI is red today — 30 pre-existing story typing errors, none from this work.

The Stepper connector adds a smaller lesson of the same kind. The `@media (max-width: 760px)` rule set `width: 1.5px` and looked complete; the `min-width: 16px` that beat it lived in the desktop rule forty lines up. A cascade override is only complete when every property the base rule sets on that axis has been accounted for, and no grep says which those are — reading the rule being overridden does.

---

## Decisions I cannot make for you

### Made

- **SpreadsheetView pans.** Settled and written into the component (`SpreadsheetView.svelte:402–404`).
- **LedgerTable / BenchmarkTable.** (a) for Ledger — scroll wrapper, ledger stays a ledger. Benchmark stacks per row below 760, values right-aligned. Both documented in place.
- **ReorderableTable on a phone.** Card mode with move-up/move-down, reusing `move()`. Totals via a separate `cardFooter` snippet, a sibling of the `<ul>` — see the third round above, including the correction to this file's earlier reasoning.
- **The Kanban board.** Decided and built: `organisms/KanbanBoard.svelte` is the scroller the column's `scroll-snap-align` and coarse-pointer width were always waiting for. It carries the `role="region"` and label on the scrolling element itself (following `CodeBlock`'s precedent) because `KanbanColumn` declares no role of its own, and it takes no `isPhone()` branch — the column's narrowing is appearance, so it stays in CSS.
- **Spine's phone navigation is a bottom sheet**, matching the case-study outline. Both sheets rise from the bar they were opened from.
- **Section numbers are desktop-only.** Wayfinding for a page with a gutter; nothing on a phone depends on them.
- **ListDetailTemplate.** Keep the 240px fallback; master→detail is routing and waits for an app.
- **The wide tier.** Resolved in favour of the doc: 1040 is a container width, `--bp-wide` is unclaimed. Comment corrected.
- **The homepage will not consume Forest.** The seam is homepage-side work.

### Still open

**LedgerTable's deeper answer.** (a) is interim by its own comment (`LedgerTable.svelte:42–59`). Whether a phone ledger should ever be anything but a scroller is a question about the billing app that will use it, not about CSS.

**Master→detail.** Deferred until an app needs a URL per list item.

**Whether the device lane should ever gate CI.** Today it does not, by the owner's decision — it stays a local command (`test:device`, `test:all`), and `ci.yml` runs only the `unit` project. It runs real Chromium and takes ~2s for three tests; over every story it will take longer. Revisit before it is wired into `diagnose`.

**The 30 story typing errors.** Not a responsive question, but the only thing between the repo and a green CI. Fix the `defineMeta` typing or relax `check:native`'s scope to `src/lib`; either is an owner's call.
