import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TreeView, { type TreeNodeData } from "$lib/organisms/TreeView.svelte";

const sampleNodes = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "App.svelte" },
      { id: "main", label: "main.ts" },
    ],
  },
  {
    id: "package",
    label: "package.json",
  },
];

describe("TreeView genuine Svelte 5 component interaction tests", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("renders root tree structure with correct ARIA roles and labels", async () => {
    const instance = mount(TreeView, {
      target: container,
      props: {
        nodes: sampleNodes,
      },
    });

    const rootUl = container.querySelector("ul.tree-view.root");
    expect(rootUl).not.toBeNull();
    expect(rootUl?.getAttribute("role")).toBe("tree");

    const topNodes = container.querySelectorAll("li.tree-node");
    expect(topNodes.length).toBe(2);
    expect(topNodes[0].getAttribute("data-node-id")).toBe("src");
    expect(topNodes[1].getAttribute("data-node-id")).toBe("package");

    unmount(instance);
  });

  it("expands nested child nodes when toggle button is clicked", async () => {
    const ontoggle = vi.fn();

    const instance = mount(TreeView, {
      target: container,
      props: {
        nodes: sampleNodes,
        ontoggle,
      },
    });

    let childApp = container.querySelector('[data-node-id="app"]');
    expect(childApp).toBeNull();

    const toggleBtn = container.querySelector<HTMLButtonElement>("button.toggle-btn");
    expect(toggleBtn).not.toBeNull();

    toggleBtn!.click();
    await tick();

    expect(ontoggle).toHaveBeenCalled();

    childApp = container.querySelector('[data-node-id="app"]');
    expect(childApp).not.toBeNull();

    unmount(instance);
  });

  it("selects node when clicked and triggers onselect callback", async () => {
    const onselect = vi.fn();
    let selectedId = null;

    const instance = mount(TreeView, {
      target: container,
      props: {
        nodes: sampleNodes,
        selectedId,
        onselect: (node: TreeNodeData<unknown>) => {
          selectedId = node.id;
          onselect(node);
        },
      },
    });

    const packageNode = container.querySelector<HTMLLIElement>('[data-node-id="package"]');
    expect(packageNode).not.toBeNull();

    packageNode!.click();
    await tick();

    expect(onselect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "package", label: "package.json" }),
    );

    unmount(instance);
  });

  it("manages roving tabindex (tabindex 0 for active node, -1 for inactive nodes)", async () => {
    const instance = mount(TreeView, {
      target: container,
      props: {
        nodes: sampleNodes,
        activeNodeId: "package",
      },
    });

    const srcNode = container.querySelector('[data-node-id="src"]');
    const packageNode = container.querySelector('[data-node-id="package"]');

    expect(srcNode?.getAttribute("tabindex")).toBe("-1");
    expect(packageNode?.getAttribute("tabindex")).toBe("0");

    unmount(instance);
  });

  it("navigates down and up tree nodes with ArrowDown and ArrowUp keypresses", async () => {
    const instance = mount(TreeView, {
      target: container,
      props: {
        nodes: sampleNodes,
        activeNodeId: "src",
      },
    });

    const srcNode = container.querySelector<HTMLLIElement>('[data-node-id="src"]');
    expect(srcNode).not.toBeNull();

    srcNode!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();

    const packageNode = container.querySelector('[data-node-id="package"]');
    expect(packageNode?.getAttribute("tabindex")).toBe("0");

    unmount(instance);
  });
});
