import type { BreadcrumbItem } from '../domain.js';
interface Props {
    items: BreadcrumbItem[];
    class?: string;
}
declare const Breadcrumb: import("svelte").Component<Props, {}, "">;
type Breadcrumb = ReturnType<typeof Breadcrumb>;
export default Breadcrumb;
