export interface InlineToken {
  type:
    | "text"
    | "strong"
    | "em"
    | "code"
    | "link"
    | "math"
    | "list"
    | "list-item"
    | "paragraph"
    | "br";
  content?: string;
  href?: string;
  ordered?: boolean;
  children?: InlineToken[];
}

export function parseBlockMarkdown(text: string): InlineToken[] {
  if (!text) return [];

  const paragraphs = text.split(/\n\n+/);
  const result: InlineToken[] = [];

  for (const para of paragraphs) {
    const rawLines = para.split("\n").filter((l) => l.trim() !== "");
    if (rawLines.length === 0) continue;

    const isUnordered = rawLines.every((line) => /^\s*[*-]\s+/.test(line));
    const isOrdered = rawLines.every((line) => /^\s*\d+\.\s+/.test(line));

    if (isUnordered || isOrdered) {
      const listItems: InlineToken[] = rawLines.map((line) => {
        const itemContent = line.replace(/^\s*(?:[*-]|\d+\.)\s+/, "");
        return {
          type: "list-item",
          children: parseInlineMarkdown(itemContent),
        };
      });
      result.push({
        type: "list",
        ordered: isOrdered,
        children: listItems,
      });
    } else {
      const paraChildren: InlineToken[] = [];
      rawLines.forEach((line, idx) => {
        paraChildren.push(...parseInlineMarkdown(line));
        if (idx < rawLines.length - 1) {
          paraChildren.push({ type: "br" });
        }
      });
      result.push({
        type: "paragraph",
        children: paraChildren,
      });
    }
  }

  return result;
}

export function parseInlineMarkdown(text: string): InlineToken[] {
  if (!text) return [];

  const result: InlineToken[] = [];

  // Enhanced pattern that handles LaTeX math expressions with backslashes
  // Math pattern: \$(?:[^$\\]|\\.)+\$ matches $...$ allowing backslash-escaped sequences like \to, \le, etc.
  const pattern =
    /\$(?:[^$\\]|\\.)+\$|`[^`]+`|\*\*(?:[^*]|\*[^*])+\*\*|__(?:[^_]|_[^_])+__|\[[^\]]+\]\([^)]+\)|\*(?:[^*])+\*|_(?:[^_])+_/g;

  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      result.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    const raw = match[0];
    if (raw.startsWith("$") && raw.endsWith("$")) {
      result.push({
        type: "math",
        content: raw.slice(1, -1),
      });
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      result.push({
        type: "code",
        content: raw.slice(1, -1),
      });
    } else if (
      (raw.startsWith("**") && raw.endsWith("**")) ||
      (raw.startsWith("__") && raw.endsWith("__"))
    ) {
      const inner = raw.slice(2, -2);
      result.push({
        type: "strong",
        children: parseInlineMarkdown(inner),
      });
    } else if (raw.startsWith("[") && raw.includes("](") && raw.endsWith(")")) {
      const closeBracketIndex = raw.indexOf("](");
      const label = raw.slice(1, closeBracketIndex);
      const href = raw.slice(closeBracketIndex + 2, -1);
      result.push({
        type: "link",
        href,
        children: parseInlineMarkdown(label),
      });
    } else if (
      (raw.startsWith("*") && raw.endsWith("*")) ||
      (raw.startsWith("_") && raw.endsWith("_"))
    ) {
      const inner = raw.slice(1, -1);
      result.push({
        type: "em",
        children: parseInlineMarkdown(inner),
      });
    } else {
      result.push({
        type: "text",
        content: raw,
      });
    }

    lastIndex = pattern.lastIndex;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    result.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return result;
}
