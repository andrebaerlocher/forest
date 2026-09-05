interface Props {
    mode: "light" | "dark";
    hue: number;
    viewMode: string;
    paletteOpen: boolean;
    triggerCommand: (cmdId: string) => void;
}
declare const EditorView: import("svelte").Component<Props, {}, "hue" | "mode" | "viewMode" | "paletteOpen">;
type EditorView = ReturnType<typeof EditorView>;
export default EditorView;
