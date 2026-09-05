import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DataTableColumn as Column, DataTableSort as Sort } from '../domain.js';
declare function $$render<Row extends object = Record<string, unknown>>(): {
    props: HTMLAttributes<HTMLDivElement> & {
        columns?: Column<Row>[];
        rows?: Row[];
        /** Field used as the row identity. Must be unique. */
        rowKey?: string;
        sort?: Sort | null;
        selectable?: boolean;
        selectedIds?: Array<string | number>;
        loading?: boolean;
        emptyTitle?: string;
        emptyDescription?: string;
        stickyHeader?: boolean;
        /** Enable row virtualization / windowing for handling large datasets. */
        virtualize?: boolean;
        /** Minimum row count threshold to activate virtualization automatically. Defaults to 50. */
        threshold?: number;
        /** Estimated or fixed row height in pixels. Defaults to 44. */
        rowHeight?: number;
        /** Viewport height for scroll calculations. Defaults to 440. */
        viewportHeight?: number;
        onrowclick?: (row: Row) => void;
        /** Per-cell render override; falls back to the raw value */
        cell?: Snippet<[Row, Column<Row>]>;
        empty?: Snippet;
        class?: string;
    };
    exports: {};
    bindings: "sort" | "selectedIds";
    slots: {};
    events: {};
};
declare class __sveltets_Render<Row extends object = Record<string, unknown>> {
    props(): ReturnType<typeof $$render<Row>>['props'];
    events(): ReturnType<typeof $$render<Row>>['events'];
    slots(): ReturnType<typeof $$render<Row>>['slots'];
    bindings(): "sort" | "selectedIds";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <Row extends object = Record<string, unknown>>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<Row>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<Row>['props']>, ReturnType<__sveltets_Render<Row>['events']>, ReturnType<__sveltets_Render<Row>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<Row>['bindings']>;
    } & ReturnType<__sveltets_Render<Row>['exports']>;
    <Row extends object = Record<string, unknown>>(internal: unknown, props: ReturnType<__sveltets_Render<Row>['props']> & {}): ReturnType<__sveltets_Render<Row>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const DataTable: $$IsomorphicComponent;
type DataTable<Row extends object = Record<string, unknown>> = InstanceType<typeof DataTable<Row>>;
export default DataTable;
