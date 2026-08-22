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

interface ParsedListLine {
  indent: number;
  ordered: boolean;
  content: string;
}

function parseRawListLines(lines: string[]): ParsedListLine[] {
  const result: ParsedListLine[] = [];
  const listMarkerRegex = /^(\s*)(?:([*-])|(\d+)\.)\s+(.*)$/;

  for (const line of lines) {
    const match = line.match(listMarkerRegex);
    if (match) {
      const indentStr = match[1];
      const indent = indentStr.replace(/\t/g, "  ").length;
      const ordered = match[3] !== undefined;
      const content = match[4];
      result.push({ indent, ordered, content });
    } else if (result.length > 0) {
      // Continuation line for the previous list item
      const prev = result[result.length - 1];
      prev.content += " " + line.trim();
    }
  }

  return result;
}

function buildListTree(lines: ParsedListLine[]): InlineToken {
  if (lines.length === 0) {
    return { type: "list", ordered: false, children: [] };
  }

  const minIndent = Math.min(...lines.map((l) => l.indent));
  const firstBaseLine = lines.find((l) => l.indent === minIndent) ?? lines[0];
  const listOrdered = firstBaseLine.ordered;

  const listItems: InlineToken[] = [];
  let currentItem: { line: ParsedListLine; subLines: ParsedListLine[] } | null = null;

  const flushCurrentItem = () => {
    if (!currentItem) return;
    const inlineChildren = parseInlineMarkdown(currentItem.line.content);
    const children: InlineToken[] = [...inlineChildren];

    if (currentItem.subLines.length > 0) {
      const subListToken = buildListTree(currentItem.subLines);
      children.push(subListToken);
    }

    listItems.push({
      type: "list-item",
      children,
    });
  };

  for (const line of lines) {
    if (line.indent === minIndent) {
      flushCurrentItem();
      currentItem = { line, subLines: [] };
    } else {
      if (currentItem) {
        currentItem.subLines.push(line);
      } else {
        currentItem = { line, subLines: [] };
      }
    }
  }
  flushCurrentItem();

  return {
    type: "list",
    ordered: listOrdered,
    children: listItems,
  };
}

export function parseBlockMarkdown(text: string): InlineToken[] {
  if (!text) return [];

  const paragraphs = text.split(/\n\n+/);
  const result: InlineToken[] = [];
  const listMarkerRegex = /^\s*(?:[*-]|\d+\.)\s+/;

  for (const para of paragraphs) {
    const rawLines = para.split("\n").filter((l) => l.trim() !== "");
    if (rawLines.length === 0) continue;

    const hasListItems = rawLines.some((line) => listMarkerRegex.test(line));

    if (hasListItems) {
      let currentNonList: string[] = [];
      let currentListLines: string[] = [];

      const flushNonList = () => {
        if (currentNonList.length === 0) return;
        const paraChildren: InlineToken[] = [];
        currentNonList.forEach((line, idx) => {
          paraChildren.push(...parseInlineMarkdown(line));
          if (idx < currentNonList.length - 1) {
            paraChildren.push({ type: "br" });
          }
        });
        result.push({
          type: "paragraph",
          children: paraChildren,
        });
        currentNonList = [];
      };

      const flushList = () => {
        if (currentListLines.length === 0) return;
        const parsedList = parseRawListLines(currentListLines);
        if (parsedList.length > 0) {
          result.push(buildListTree(parsedList));
        }
        currentListLines = [];
      };

      for (const line of rawLines) {
        if (listMarkerRegex.test(line) || (currentListLines.length > 0 && /^\s+/.test(line))) {
          flushNonList();
          currentListLines.push(line);
        } else {
          flushList();
          currentNonList.push(line);
        }
      }
      flushNonList();
      flushList();
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
