interface Props {
    current: number;
    total: number;
    class?: string;
    onchange?: (page: number) => void;
}
declare const Pagination: import("svelte").Component<Props, {}, "current">;
type Pagination = ReturnType<typeof Pagination>;
export default Pagination;
