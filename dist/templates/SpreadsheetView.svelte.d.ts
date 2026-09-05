interface Props {
    mode: "light" | "dark";
    hue: number;
    viewMode: string;
    paletteOpen: boolean;
    triggerCommand: (cmdId: string) => void;
}
declare const SpreadsheetView: import("svelte").Component<Props, {}, "hue" | "mode" | "viewMode" | "paletteOpen">;
type SpreadsheetView = ReturnType<typeof SpreadsheetView>;
export default SpreadsheetView;
