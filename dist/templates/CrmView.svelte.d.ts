interface Props {
    mode: "light" | "dark";
    hue: number;
    viewMode: string;
    paletteOpen: boolean;
    triggerCommand: (cmdId: string) => void;
}
declare const CrmView: import("svelte").Component<Props, {}, "hue" | "mode" | "viewMode" | "paletteOpen">;
type CrmView = ReturnType<typeof CrmView>;
export default CrmView;
