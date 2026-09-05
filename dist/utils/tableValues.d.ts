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
export declare function rawValue<Row extends object>(row: Row, col: DataTableColumn<Row>): unknown;
/** The display value: `rawValue` put through the column's formatter. */
export declare function cellValue<Row extends object>(row: Row, col: DataTableColumn<Row>): unknown;
/**
 * The row's identity. Falls back to `id`, then to the positional index — the
 * last of which is why callers should give unique keys for anything reorderable.
 */
export declare function rowId<Row extends object>(row: Row, key: string, index?: number): string | number;
/** Whether a numeric column's value should take the negative treatment. */
export declare function isNegative<Row extends object>(row: Row, col: DataTableColumn<Row>): boolean;
