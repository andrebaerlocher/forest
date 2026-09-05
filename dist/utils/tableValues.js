/** The stored value, before any column formatting. */
export function rawValue(row, col) {
    return col.getValue ? col.getValue(row) : row[col.key];
}
/** The display value: `rawValue` put through the column's formatter. */
export function cellValue(row, col) {
    const raw = rawValue(row, col);
    return col.format ? col.format(raw, row) : raw;
}
/**
 * The row's identity. Falls back to `id`, then to the positional index — the
 * last of which is why callers should give unique keys for anything reorderable.
 */
export function rowId(row, key, index = 0) {
    const record = row;
    const value = record[key] ?? record.id;
    return value !== undefined && value !== null ? value : index;
}
/** Whether a numeric column's value should take the negative treatment. */
export function isNegative(row, col) {
    return col.type === "numeric" && Number(rawValue(row, col)) < 0;
}
