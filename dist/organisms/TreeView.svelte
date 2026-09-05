<script module lang="ts">
  export interface TreeNodeData<T = unknown> {
    id: string;
    label: string;
    icon?: string;
    children?: TreeNodeData<T>[];
    expanded?: boolean;
    disabled?: boolean;
    /** Explicitly declare whether node is a folder (useful for empty folders without children) */
    isFolder?: boolean;
    /** Optional domain payload attached to the node */
    data?: T;
  }

  interface TreeContext<T = unknown> {
    readonly activeNodeId: string | null;
    setActiveNodeId: (id: string | null) => void;
    isExpanded: (node: TreeNodeData<T>) => boolean;
    toggleNode: (node: TreeNodeData<T>, event?: Event) => void;
    selectNode: (node: TreeNodeData<T>, event?: Event) => void;
    handleKeyDown: (event: KeyboardEvent, node: TreeNodeData<T>) => void;
    getRootNodes?: () => TreeNodeData<T>[];
  }

  const TREE_CONTEXT_KEY = Symbol('TREE_CONTEXT');
</script>

<script lang="ts" generics="T = unknown">
  import { getContext, type Snippet, setContext, tick } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import Self from './TreeView.svelte';

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'onselect' | 'ontoggle'> {
    nodes?: TreeNodeData<T>[];
    selectedId?: string | null;
    activeNodeId?: string | null;
    level?: number;
    showIcons?: boolean;
    onselect?: (node: TreeNodeData<T>) => void;
    ontoggle?: (node: TreeNodeData<T>) => void;
    onexpand?: (node: TreeNodeData<T>) => void;
    /** Custom snippet override for rendering node content */
    nodeSnippet?: Snippet<[TreeNodeData<T>]>;
    class?: string;
  }

  let {
    nodes = [],
    selectedId = $bindable(null),
    activeNodeId = $bindable(null),
    level = 0,
    showIcons = true,
    onselect,
    ontoggle,
    onexpand,
    nodeSnippet,
    class: className = '',
    ...restProps
  }: Props = $props();

  // Local state to track open node IDs for smooth reactivity
  let expandedMap = $state<Record<string, boolean>>({});
  let rootEl = $state<HTMLElement | null>(null);

  let isRoot = $derived(level === 0);

  function isExpanded(node: TreeNodeData<T>): boolean {
    if (expandedMap[node.id] !== undefined) {
      return expandedMap[node.id];
    }
    return Boolean(node.expanded);
  }

  function toggleNode(node: TreeNodeData<T>, event?: Event) {
    event?.stopPropagation();
    if (!node.children || node.children.length === 0) return;
    const currentState = isExpanded(node);
    const nextState = !currentState;
    expandedMap[node.id] = nextState;
    if (ontoggle) {
      ontoggle(node);
    }
    if (nextState && onexpand) {
      onexpand(node);
    }
  }

  function selectNode(node: TreeNodeData<T>, event?: Event) {
    event?.stopPropagation();
    if (node.disabled) return;
    selectedId = node.id;
    activeNodeId = node.id;
    if (onselect) {
      onselect(node);
    }
  }

  function flattenVisibleNodes(
    nodeList: TreeNodeData<T>[],
    parent: TreeNodeData<T> | null = null,
    parentMap: Map<string, TreeNodeData<T> | null> = new Map()
  ): { visible: TreeNodeData<T>[]; parentMap: Map<string, TreeNodeData<T> | null> } {
    const visible: TreeNodeData<T>[] = [];
    for (const n of nodeList) {
      parentMap.set(n.id, parent);
      visible.push(n);
      if (n.children && n.children.length > 0 && isExpanded(n)) {
        const childRes = flattenVisibleNodes(n.children, n, parentMap);
        visible.push(...childRes.visible);
      }
    }
    return { visible, parentMap };
  }

  function focusNode(id: string) {
    activeNodeId = id;
    tick().then(() => {
      const root = isRoot ? rootEl : document.querySelector(`[data-node-id="${CSS.escape ? CSS.escape(activeNodeId!) : activeNodeId!}"]`)?.closest('.tree-view');
      if (root) {
        const el = root.querySelector<HTMLElement>(`[data-node-id="${CSS.escape ? CSS.escape(id) : id}"]`);
        el?.focus();
      }
    });
  }

  function handleKeyDown(event: KeyboardEvent, node: TreeNodeData<T>) {
    const rootNodes = isRoot ? nodes : (ctx ? ctx.getRootNodes?.() ?? nodes : nodes);
    const { visible, parentMap } = flattenVisibleNodes(rootNodes);
    const currentIndex = visible.findIndex((n) => n.id === node.id);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < visible.length - 1) {
          if (isRoot) focusNode(visible[currentIndex + 1].id);
          else ctx.handleKeyDown(event, node);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (currentIndex > 0) {
          if (isRoot) focusNode(visible[currentIndex - 1].id);
          else ctx.handleKeyDown(event, node);
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        if (visible.length > 0) {
          if (isRoot) focusNode(visible[0].id);
          else ctx.handleKeyDown(event, node);
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        if (visible.length > 0) {
          if (isRoot) focusNode(visible[visible.length - 1].id);
          else ctx.handleKeyDown(event, node);
        }
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        const hasChildren = Boolean(node.children && node.children.length > 0);
        if (hasChildren) {
          if (!isExpanded(node)) {
            toggleNode(node, event);
          } else if (node.children && node.children.length > 0) {
            focusNode(node.children[0].id);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const hasChildren = Boolean(node.children && node.children.length > 0);
        if (hasChildren && isExpanded(node)) {
          toggleNode(node, event);
        } else {
          const parentNode = parentMap.get(node.id);
          if (parentNode) {
            focusNode(parentNode.id);
          }
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        selectNode(node, event);
        break;
      }
    }
  }

  const rootCtx: TreeContext<T> = {
    get activeNodeId() {
      return activeNodeId;
    },
    setActiveNodeId(id: string | null) {
      activeNodeId = id;
    },
    isExpanded,
    toggleNode,
    selectNode,
    handleKeyDown,
    getRootNodes: () => nodes,
  };

  if (level === 0) {
    setContext(TREE_CONTEXT_KEY, rootCtx);
  }

  const ctx: TreeContext<T> = level === 0 ? rootCtx : getContext<TreeContext<T>>(TREE_CONTEXT_KEY);

  $effect(() => {
    if (level === 0 && selectedId && activeNodeId !== selectedId) {
      activeNodeId = selectedId;
    }
  });

  $effect(() => {
    if (level === 0 && !activeNodeId && nodes.length > 0) {
      activeNodeId = selectedId ?? nodes[0].id;
    }
  });
</script>

<ul
  bind:this={rootEl}
  class="tree-view"
  class:root={level === 0}
  role={level === 0 ? "tree" : "group"}
  {...restProps}
>
  {#each nodes as node (node.id)}
    {@const hasChildren = Boolean(node.children && node.children.length > 0)}
    {@const isFolder = node.isFolder ?? (node.children !== undefined || node.label.endsWith('/') || node.label.endsWith('/...'))}
    {@const nodeOpen = ctx.isExpanded(node)}
    {@const selected = selectedId === node.id}
    <li
      class="tree-node"
      role="treeitem"
      data-node-id={node.id}
      tabindex={(activeNodeId ?? ctx.activeNodeId) === node.id ? 0 : -1}
      aria-expanded={hasChildren ? nodeOpen : undefined}
      aria-selected={selected}
      class:selected
      class:disabled={node.disabled}
      onclick={(e) => {
        ctx.setActiveNodeId(node.id);
        ctx.selectNode(node, e);
      }}
      onkeydown={(e) => ctx.handleKeyDown(e, node)}
    >
      <div
        class="node-row"
        style="padding-left: {level * 16 + 8}px;"
      >
        <button
          type="button"
          class="toggle-btn"
          class:hidden={!hasChildren}
          tabindex="-1"
          aria-label={nodeOpen ? "Collapse" : "Expand"}
          data-tap-target-exempt="Secondary control inside a row that is
            itself the 44px target. The row selects; this only twists the
            disclosure open. Widening it to 44px would push it into the label
            and steal taps from the primary action — the same trade Combobox's
            .clear documents. It stays 44px TALL, and is tabindex=-1 because
            the keyboard path is the row's own arrow-key handling."
          onclick={(e) => ctx.toggleNode(node, e)}
        >
          <svg
            class="toggle-icon"
            class:nodeOpen
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {#if nodeSnippet}
          {@render nodeSnippet(node)}
        {:else}
          {#if showIcons}
            {#if node.icon}
              <span class="node-icon">{node.icon}</span>
            {:else if isFolder}
              <span class="node-icon">{nodeOpen ? "📂" : "📁"}</span>
            {:else}
              <span class="node-icon">📄</span>
            {/if}
          {/if}

          <span class="node-label">{node.label}</span>
        {/if}
      </div>

      {#if hasChildren && nodeOpen && node.children}
        <Self
          nodes={node.children}
          bind:selectedId
          bind:activeNodeId
          level={level + 1}
          {showIcons}
          {onselect}
          {ontoggle}
          {onexpand}
          {nodeSnippet}
        />
      {/if}
    </li>
  {/each}
</ul>

<style>
  .tree-view {
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--font-body);
    font-size: 12px;
  }

  .tree-view.root {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--raised);
    padding: 4px 0;
    user-select: none;

    /* A tree pans; it does not reflow. Indent depth IS the structure, so
       wrapping a deep label onto the next line puts a child's text under its
       parent's and the hierarchy stops being readable — which is exactly what
       a 375px screen was doing to it. The rows below size to their content and
       this scrolls them. */
    overflow-x: auto;
    overscroll-behavior-x: contain;
    touch-action: pan-x pan-y;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .tree-view.root::-webkit-scrollbar {
    height: 8px;
  }

  .tree-view.root::-webkit-scrollbar-track {
    background: transparent;
  }

  .tree-view.root::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .tree-node {
    margin: 0;
    padding: 0;
    outline: none;
  }

  .node-row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding-right: 12px;
    /* max-content gives the scroller something to scroll; the 100% floor keeps
       the selected/hover wash spanning the full width when it doesn't. */
    width: max-content;
    min-width: 100%;
    cursor: pointer;
    color: var(--text-1);
    transition: background var(--t-fast) var(--ease);
    border-radius: 2px;
  }

  /* Gated: a hover that sticks after a tap reads as a state this control
     is not in. */
  @media (hover: hover) {
    .tree-node:hover:not(.disabled) > .node-row {
      background: var(--wash);
    }
  }

  .tree-node.selected > .node-row {
    background: var(--wash);
    color: var(--accent-ink);
    font-weight: 500;
  }

  .tree-node:focus-visible > .node-row {
    outline: 1.5px solid var(--accent);
    outline-offset: -1px;
  }

  .tree-node.disabled > .node-row {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* On a finger, the ROW is the target — it is full width and carries both
     the selection click and the keyboard handling. Giving it 44px of height
     makes the primary action comfortable; the disclosure toggle grows in
     height with it but stays narrow on purpose (see the exemption note on the
     button itself). */
  @media (pointer: coarse) {
    .node-row {
      min-height: 44px;
    }

    .toggle-btn {
      height: 44px;
      width: 28px;
    }
  }

  .toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--text-2);
  }

  .toggle-btn.hidden {
    visibility: hidden;
  }

  .toggle-icon {
    transition: transform var(--t-fast) var(--ease);
  }

  .toggle-icon.nodeOpen {
    transform: rotate(90deg);
  }

  .node-icon {
    font-size: 13px;
    line-height: 1;
    flex-shrink: 0;
  }

  /* No ellipsis: the row is free to be wider than the box now, and truncating
     inside a scroller hides text the scroller exists to reach. */
  .node-label {
    white-space: nowrap;
  }
</style>
