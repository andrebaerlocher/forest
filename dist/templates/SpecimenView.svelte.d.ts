interface Props {
    mode: "light" | "dark";
    hue: number;
    density: string;
}
declare const SpecimenView: import("svelte").Component<Props, {}, "hue" | "mode" | "density">;
type SpecimenView = ReturnType<typeof SpecimenView>;
export default SpecimenView;
