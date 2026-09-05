<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onchange"> {
    direction?: "horizontal" | "vertical";
    split?: number;
    min?: number;
    max?: number;
    first?: Snippet;
    second?: Snippet;
    onchange?: (split: number) => void;
  }

  let {
    direction = "horizontal",
    split = $bindable(50),
    min = 10,
    max = 90,
    first,
    second,
    onchange,
    ...restProps
  }: Props = $props();

  let containerEl = $state<HTMLElement | null>(null);
  let isDragging = $state(false);

  function clamp(val: number): number {
    return Math.min(max, Math.max(min, val));
  }

  function handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    isDragging = true;
    const target = event.currentTarget as HTMLElement | null;
    if (target && typeof target.setPointerCapture === 'function') {
      try {
        target.setPointerCapture(event.pointerId);
      } catch (_) {}
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging || !containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    let newSplit: number;

    if (direction === "horizontal") {
      const offset = event.clientX - rect.left;
      newSplit = (offset / rect.width) * 100;
    } else {
      const offset = event.clientY - rect.top;
      newSplit = (offset / rect.height) * 100;
    }

    const clamped = clamp(newSplit);
    split = Number(clamped.toFixed(1));
    if (onchange) {
      onchange(split);
    }
  }

  function handlePointerUp(event?: PointerEvent) {
    if (isDragging) {
      isDragging = false;
      if (event?.target && typeof (event.target as HTMLElement).releasePointerCapture === 'function') {
        try {
          (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        } catch (_) {}
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    }
  }

  $effect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    const step = event.shiftKey ? 5 : 1;
    let newSplit = split;

    if (
      (direction === "horizontal" && event.key === "ArrowLeft") ||
      (direction === "vertical" && event.key === "ArrowUp")
    ) {
      event.preventDefault();
      newSplit = clamp(split - step);
    } else if (
      (direction === "horizontal" && event.key === "ArrowRight") ||
      (direction === "vertical" && event.key === "ArrowDown")
    ) {
      event.preventDefault();
      newSplit = clamp(split + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      newSplit = min;
    } else if (event.key === "End") {
      event.preventDefault();
      newSplit = max;
    }

    if (newSplit !== split) {
      split = Number(newSplit.toFixed(1));
      if (onchange) {
        onchange(split);
      }
    }
  }
</script>

<div
  bind:this={containerEl}
  class="split-pane direction-{direction}"
  class:dragging={isDragging}
  {...restProps}
>
  <div
    class="pane pane-first"
    style="{direction === 'horizontal' ? 'width' : 'height'}: {split}%;"
  >
    {#if first}
      {@render first()}
    {/if}
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex a11y_no_noninteractive_element_interactions -->
  <div
    class="gutter"
    role="separator"
    aria-label="Resize split pane"
    aria-orientation={direction}
    aria-valuenow={split}
    aria-valuemin={min}
    aria-valuemax={max}
    tabindex="0"
    onpointerdown={handlePointerDown}
    onpointercancel={handlePointerUp}
    onkeydown={handleKeyDown}
  >
    <div class="gutter-handle"></div>
  </div>

  <div
    class="pane pane-second"
    style="{direction === 'horizontal' ? 'width' : 'height'}: {100 - split}%;"
  >
    {#if second}
      {@render second()}
    {/if}
  </div>
</div>

<style>
  .split-pane {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 200px;
    position: relative;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-s);
    background: var(--paper-l);
    overflow: hidden;
  }

  .split-pane.direction-horizontal {
    flex-direction: row;
  }

  .split-pane.direction-vertical {
    flex-direction: column;
  }

  .pane {
    overflow: auto;
    position: relative;
    box-sizing: border-box;
  }

  .gutter {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--line-soft);
    position: relative;
    z-index: 2;
    transition: background var(--t-fast) var(--ease);
    touch-action: none;
  }

  .direction-horizontal > .gutter {
    width: 8px;
    cursor: col-resize;
  }

  .direction-vertical > .gutter {
    height: 8px;
    cursor: row-resize;
  }

  .gutter:focus-visible,
  .split-pane.dragging .gutter {
    background: var(--accent);
  }

  /* Gated: a hover that sticks after a tap reads as a state this control
     is not in. */
  @media (hover: hover) {
    .gutter:hover {
      background: var(--accent);
    }
  }

  .gutter:focus-visible {
    outline: none;
  }

  .gutter-handle {
    background: var(--line-strong);
    border-radius: 2px;
    transition: background var(--t-fast) var(--ease);
  }

  .direction-horizontal .gutter-handle {
    width: 2px;
    height: 20px;
  }

  .direction-vertical .gutter-handle {
    width: 20px;
    height: 2px;
  }

  .split-pane.dragging .gutter-handle {
    background: var(--paper-l);
  }

  /* Gated: a hover that sticks after a tap reads as a state this control
     is not in. */
  @media (hover: hover) {
    .gutter:hover .gutter-handle {
      background: var(--paper-l);
    }
  }
</style>
