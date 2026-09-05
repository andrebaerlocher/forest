import type { Snippet } from 'svelte';
interface Props {
    class?: string;
    stats?: Snippet;
    content?: Snippet;
}
declare const DashboardTemplate: import("svelte").Component<Props, {}, "">;
type DashboardTemplate = ReturnType<typeof DashboardTemplate>;
export default DashboardTemplate;
