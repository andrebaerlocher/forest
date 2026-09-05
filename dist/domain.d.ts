/**
 * Domain shapes — the objects a consuming app builds and hands to a component.
 *
 * This module deliberately imports nothing: components import from here, and
 * `types.ts` (which imports every component for `ComponentProps`) re-exports it.
 * Keeping it a leaf avoids a cycle between components and the type surface.
 */
/** A trail entry for Breadcrumb / AppHeader. */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}
/** An entry for Tabs and SegmentedControl. */
export interface SelectableItem {
    id: string;
    label: string;
}
/** A nav link for Spine / Shell in their legacy nav mode. */
export interface NavLink {
    href: string;
    label: string;
}
/** An option for Combobox. */
export interface ComboItem {
    id: string;
    label: string;
    meta?: string;
}
/** An entry for CommandPalette. */
export interface Command {
    id: string;
    label: string;
    shortcut?: string;
    /** Optional grouping label shown as a section heading */
    group?: string;
}
/** An entry for Menu. */
export interface MenuItemData {
    id: string;
    label: string;
    /** Renders as a non-focusable separator; `label` is ignored. */
    separator?: boolean;
    disabled?: boolean;
    shortcut?: string;
    danger?: boolean;
}
/**
 * A link in a Chain — one stage of an ordered pipeline (middleware, an
 * interceptor chain, a request path). Unlike StepItem it carries no progress
 * state: a chain describes what always runs, not where a reader has got to.
 */
export interface ChainStep {
    label: string;
    /** What this link does, in a handful of words. */
    detail?: string;
    /** Present for completeness, but not why this chain is on the page. */
    muted?: boolean;
}
/** A stage in a Stepper flow. */
export interface StepItem {
    id: string;
    label: string;
    /** Secondary line under the label. */
    detail?: string;
}
/**
 * A DataTable column definition.
 *
 * `Row extends object`, not `Record<string, unknown>` — the latter requires an
 * index signature, which a plain `interface Row { id: string }` does not
 * structurally have. Constraining to `object` lets ordinary interfaces satisfy
 * `Row` without the caller adding an index signature just to appease the
 * generic. Internal lookups (`row[col.key]`) still go through an explicit
 * `Record<string, unknown>` cast, since `col.key: string` isn't statically
 * known to be `keyof Row`.
 */
export interface DataTableColumn<Row extends object = Record<string, unknown>> {
    key: string;
    label: string;
    type?: "text" | "numeric";
    width?: string;
    sortable?: boolean;
    /** Wash this column — the ledger's "active column" treatment. */
    active?: boolean;
    /**
     * Card mode (below the shell breakpoint): this column is the card's title
     * and its tap target. Defaults to the first column.
     *
     * Its rendered content must NOT be interactive when `onrowclick` is set —
     * the title is wrapped in a <button>, and nesting a control inside a button
     * is invalid.
     */
    primary?: boolean;
    /** Optional custom value getter for computed or nested fields (e.g. row.user.name) */
    getValue?: (row: Row) => unknown;
    /** Optional value formatter function */
    format?: (value: unknown, row: Row) => string;
}
/** DataTable sort state. Third click on a header clears it to null. */
export interface DataTableSort {
    key: string;
    dir: "asc" | "desc";
}
/**
 * Emitted by ReorderableTable once a row has landed.
 *
 * `rows` is the whole list in its new order, so a consumer can persist the
 * order without re-deriving it from `from`/`to`.
 */
export interface TableReorder<Row = unknown> {
    from: number;
    to: number;
    rows: Row[];
}
/** Status ink shared by StatusPill, Toast and the toaster. */
export type Status = "neutral" | "success" | "warning" | "danger";
/** One number in a metrics strip. */
export interface MetricItem {
    label: string;
    value: string;
    detail?: string;
}
/** A table-of-contents entry, registered by an anchored section or passed in. */
export interface TocEntry {
    id: string;
    label: string;
    /** Heading level, used for the indent depth in the rendered outline. */
    level: number;
}
/** One row of a latency or throughput breakdown. */
export interface BenchmarkRow {
    label: string;
    value: number;
    /** Overrides the table's shared unit for this row. */
    unit?: string;
    detail?: string;
    /** Pre-formatted display value, when `value` alone reads badly. */
    formatted?: string;
}
/**
 * One row of an evaluation table — deliberately open, since the metric columns
 * differ per study (κ and α for agreement, QWK for scoring, and so on). Kept
 * here to document the shape DataTable expects for this use.
 */
export interface EvalMetricRow {
    [column: string]: string | number;
}
/** One grouped entry in a stack manifest. */
export interface TechStackGroup {
    category: string;
    items: string[];
    /** A hard constraint this group had to meet, e.g. "p99 < 200µs". */
    constraint?: string;
}
/**
 * One file in a code walkthrough.
 *
 * Note there is no `html` field: highlighted output is passed to CodeBlock as a
 * snippet, so no raw markup ever travels through this data shape.
 */
export interface CodeFile {
    id: string;
    filename: string;
    language?: string;
    /** Raw source, rendered as plain escaped text. */
    code?: string;
    lineNumbers?: boolean;
    highlightLines?: number[];
    startLine?: number;
}
/** An option weighed and rejected in a decision record. */
export interface RejectedAlternative {
    option: string;
    rejectedBecause: string;
}
/** Lifecycle of an architecture decision record. */
export type DecisionStatus = "proposed" | "accepted" | "final" | "rejected" | "superseded" | "deprecated";
/** One card in a case study index. */
export interface CaseStudySummaryData {
    slug: string;
    href: string;
    title: string;
    standfirst: string;
    tags: string[];
    /** A single headline number — the index stays restrained on purpose. */
    metric?: MetricItem;
}
