/**
 * Column value resolution, shared by every table that takes
 * `DataTableColumn` definitions.
 *
 * These live outside the components so DataTable and ReorderableTable read a
 * row the same way — a column that renders one way in a list must render the
 * same way in the editor.
 */
import type { DataTableColumn } from "../domain.js";

/** The stored value, before any column formatting. */
export function rawValue<Row extends object>(row: Row, col: DataTableColumn<Row>): unknown {
  return col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[col.key];
}

/** The display value: `rawValue` put through the column's formatter. */
export function cellValue<Row extends object>(row: Row, col: DataTableColumn<Row>): unknown {
  const raw = rawValue(row, col);
  return col.format ? col.format(raw, row) : raw;
}

/**
 * The row's identity. Falls back to `id`, then to the positional index — the
 * last of which is why callers should give unique keys for anything reorderable.
 */
export function rowId<Row extends object>(row: Row, key: string, index = 0): string | number {
  const record = row as Record<string, unknown>;
  const value = record[key] ?? record.id;
  return value !== undefined && value !== null ? (value as string | number) : index;
}

/** Whether a numeric column's value should take the negative treatment. */
export function isNegative<Row extends object>(row: Row, col: DataTableColumn<Row>): boolean {
  return col.type === "numeric" && Number(rawValue(row, col)) < 0;
}
