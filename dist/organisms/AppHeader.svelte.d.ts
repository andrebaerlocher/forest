import type { Snippet } from 'svelte';
import type { BreadcrumbItem } from '../domain.js';
interface Props {
    breadcrumbs: BreadcrumbItem[];
    onsearch?: () => void;
    /**
     * A leading action rendered before the breadcrumb — typically the phone
     * navigation trigger, or a back affordance. AppHeader stays neutral about
     * width and renders it at every size; hiding it is the caller's decision.
     */
    leading?: Snippet;
    class?: string;
    children?: Snippet;
}
declare const AppHeader: import("svelte").Component<Props, {}, "">;
type AppHeader = ReturnType<typeof AppHeader>;
export default AppHeader;
