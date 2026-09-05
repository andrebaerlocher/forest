import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DataTableColumn as Column, TableReorder } from '../domain.js';
declare function $$render<Row extends object = Record<string, unknown>>(): {
    props: HTMLAttributes<HTMLDivElement> & {
        columns?: Column<Row>[];
        /** Bindable — a completed reorder writes the new order straight back. */
        rows?: Row[];
        /** Field used as the row identity. Must be unique, or rows jump on reorder. */
        rowKey?: string;
        disabled?: boolean;
        /** Names the row in the handle's label and in the live announcements. */
        rowLabel?: (row: Row, index: number) => string;
        onreorder?: (event: TableReorder<Row>) => void;
        /** Per-cell render override; falls back to the column's formatted value. */
        cell?: Snippet<[Row, Column<Row>]>;
        /** Trailing per-row controls — a delete button, a row menu. */
        rowActions?: Snippet<[Row, number]>;
        /**
         * A <tr> (or several) for the totals, rendered in the table's <tfoot>.
         * Table-shaped: `footer`'s whole contract is producing <tr>/<td>, and
         * those elements only have a layout to sit in inside a table's row
         * groups. Below the shell breakpoint the table itself is `display: none`
         * (see `cards` and the card media query below) and the phone card list is
         * a <ul>, not a table — so `footer` never appears there. One snippet
         * can't cover both: a <tr> rendered into a <li> or after </ul> still
         * lands in the DOM (Svelte builds elements directly, it doesn't parse
         * HTML text, so nothing gets silently dropped the way it would via
         * `innerHTML`), but it arrives as an orphan table-row with no table to
         * size its columns against and none of the card styling below — a
         * broken-looking row, not a real totals line. See `cardFooter`.
         */
        footer?: Snippet;
        /**
         * Free-form block content for the totals line at the end of the phone
         * card list — `footer`'s card-shaped counterpart, needed for exactly the
         * reason described on `footer`: table markup has nowhere valid to lay
         * out once the table is hidden. Renders inside `.card-footer`, which
         * already carries the border-top separator and `--font-data` size the
         * cards use; give a numeric figure `class="num"` for the same
         * `--font-num` / tabular-nums / right-aligned treatment `.card-value.num`
         * gives the fields above it, so the digits line up.
         * A consumer who passes only `footer` still gets no totals on a phone —
         * the same silence as before this prop existed, not a new regression —
         * so pass both when the totals need to survive the breakpoint.
         */
        cardFooter?: Snippet;
        empty?: Snippet;
        emptyTitle?: string;
        emptyDescription?: string;
        class?: string;
    };
    exports: {};
    bindings: "rows";
    slots: {};
    events: {};
};
declare class __sveltets_Render<Row extends object = Record<string, unknown>> {
    props(): ReturnType<typeof $$render<Row>>['props'];
    events(): ReturnType<typeof $$render<Row>>['events'];
    slots(): ReturnType<typeof $$render<Row>>['slots'];
    bindings(): "rows";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <Row extends object = Record<string, unknown>>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<Row>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<Row>['props']>, ReturnType<__sveltets_Render<Row>['events']>, ReturnType<__sveltets_Render<Row>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<Row>['bindings']>;
    } & ReturnType<__sveltets_Render<Row>['exports']>;
    <Row extends object = Record<string, unknown>>(internal: unknown, props: ReturnType<__sveltets_Render<Row>['props']> & {}): ReturnType<__sveltets_Render<Row>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const ReorderableTable: $$IsomorphicComponent;
type ReorderableTable<Row extends object = Record<string, unknown>> = InstanceType<typeof ReorderableTable<Row>>;
export default ReorderableTable;
