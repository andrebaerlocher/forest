export interface TreeNodeData<T = unknown> {
    id: string;
    label: string;
    icon?: string;
    children?: TreeNodeData<T>[];
    expanded?: boolean;
    disabled?: boolean;
    /** Explicitly declare whether node is a folder (useful for empty folders without children) */
    isFolder?: boolean;
    /** Optional domain payload attached to the node */
    data?: T;
}
import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
declare function $$render<T = unknown>(): {
    props: Omit<HTMLAttributes<HTMLUListElement>, "ontoggle" | "onselect"> & {
        nodes?: TreeNodeData<T>[];
        selectedId?: string | null;
        activeNodeId?: string | null;
        level?: number;
        showIcons?: boolean;
        onselect?: (node: TreeNodeData<T>) => void;
        ontoggle?: (node: TreeNodeData<T>) => void;
        onexpand?: (node: TreeNodeData<T>) => void;
        /** Custom snippet override for rendering node content */
        nodeSnippet?: Snippet<[TreeNodeData<T>]>;
        class?: string;
    };
    exports: {};
    bindings: "selectedId" | "activeNodeId";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T = unknown> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "selectedId" | "activeNodeId";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T = unknown>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T = unknown>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const TreeView: $$IsomorphicComponent;
type TreeView<T = unknown> = InstanceType<typeof TreeView<T>>;
export default TreeView;
