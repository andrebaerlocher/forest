interface Props {
    /** Where it points when `open` is false. */
    direction?: 'right' | 'down' | 'left' | 'up';
    /** Rotates 90° clockwise from `direction`. */
    open?: boolean;
    size?: number;
    class?: string;
}
declare const Chevron: import("svelte").Component<Props, {}, "">;
type Chevron = ReturnType<typeof Chevron>;
export default Chevron;
