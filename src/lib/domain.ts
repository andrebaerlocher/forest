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

/** A DataTable column definition. */
export interface DataTableColumn {
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
}

/** DataTable sort state. Third click on a header clears it to null. */
export interface DataTableSort {
  key: string;
  dir: "asc" | "desc";
}

/** Status ink shared by StatusPill, Toast and the toaster. */
export type Status = "neutral" | "success" | "warning" | "danger";
