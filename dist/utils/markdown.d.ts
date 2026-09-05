export interface InlineToken {
    type: "text" | "strong" | "em" | "code" | "link" | "math" | "list" | "list-item" | "paragraph" | "br";
    content?: string;
    href?: string;
    ordered?: boolean;
    children?: InlineToken[];
}
export declare function parseBlockMarkdown(text: string): InlineToken[];
export declare function parseInlineMarkdown(text: string): InlineToken[];
