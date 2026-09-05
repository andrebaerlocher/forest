export type AnchoredPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

export interface AnchoredOptions {
  /** The element the floating surface is positioned against. */
  anchor: HTMLElement | null | undefined;
  /** Default 'bottom-start'. */
  placement?: AnchoredPlacement;
  /** Gap between anchor and surface, px. Default 6. */
  offset?: number;
  /** Flip to the opposite side when there is not enough room. Default true. */
  flip?: boolean;
  /** Slide along the cross axis to stay on screen. Default true. */
  shift?: boolean;
  /** Skip all work while the surface is closed. Default true. */
  enabled?: boolean;
  /** Match the surface's min-width to the anchor's width (for select-likes). */
  matchWidth?: boolean;
}

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "end" | "center";

const VIEWPORT_MARGIN = 8;

interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * The visible area to clamp against, in the same coordinate space as
 * `getBoundingClientRect()` and `position: fixed` (the layout viewport).
 *
 * `window.visualViewport` shrinks when the on-screen keyboard opens —
 * `innerHeight` does not. A `position: fixed` surface still lays out
 * against the *layout* viewport, so without this a Popover/Combobox/
 * DatePicker anchored to a focused field can end up positioned behind the
 * keyboard. `offsetLeft`/`offsetTop` give the visual viewport's origin
 * within that same layout-viewport space, so the bounds below describe
 * exactly the region still visible above the keyboard (or after a pinch
 * zoom). Absent in jsdom and older browsers — fall back to the window
 * dimensions, which is the previous, unaware behaviour.
 */
function getViewportBounds(): ViewportBounds {
  const vv = typeof window !== "undefined" ? window.visualViewport : null;
  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      right: vv.offsetLeft + vv.width,
      bottom: vv.offsetTop + vv.height,
    };
  }
  return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}

function parsePlacement(placement: AnchoredPlacement): { side: Side; align: Align } {
  const [side, align] = placement.split("-") as [Side, Align | undefined];
  return { side, align: align ?? "center" };
}

function clamp(value: number, min: number, max: number): number {
  // A surface wider/taller than the viewport has min > max — hold it at the
  // margin rather than let it invert.
  return max < min ? min : Math.min(Math.max(value, min), max);
}

/**
 * Positions a floating element relative to an anchor, flipping to the
 * opposite side and shifting along the cross axis to stay in the viewport.
 *
 * Uses `position: fixed` and coordinates from `getBoundingClientRect()`, so
 * the action does not care what offset parent (if any) sits between the
 * node and the document — no transformed or `position: relative` ancestor
 * can throw the math off the way it would with `position: absolute`.
 *
 * Usage: <div use:anchored={{ anchor: triggerEl, placement: 'bottom-start' }}>
 */
export function anchored(node: HTMLElement, options: AnchoredOptions) {
  let {
    anchor,
    placement = "bottom-start",
    offset = 6,
    flip = true,
    shift = true,
    enabled = true,
    matchWidth = false,
  } = options;

  let frame: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let listening = false;

  function resolveFlip(
    side: Side,
    anchorRect: DOMRect,
    surfaceRect: DOMRect,
    bounds: ViewportBounds,
  ): Side {
    if (!flip) return side;

    if (side === "top" || side === "bottom") {
      const spaceAbove = anchorRect.top - bounds.top;
      const spaceBelow = bounds.bottom - anchorRect.bottom;
      const needed = surfaceRect.height + offset;
      if (side === "top" && spaceAbove < needed && spaceBelow > spaceAbove) return "bottom";
      if (side === "bottom" && spaceBelow < needed && spaceAbove > spaceBelow) return "top";
      return side;
    }

    const spaceLeft = anchorRect.left - bounds.left;
    const spaceRight = bounds.right - anchorRect.right;
    const needed = surfaceRect.width + offset;
    if (side === "left" && spaceLeft < needed && spaceRight > spaceLeft) return "right";
    if (side === "right" && spaceRight < needed && spaceLeft > spaceRight) return "left";
    return side;
  }

  function reposition() {
    if (!enabled || !anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const surfaceRect = node.getBoundingClientRect();
    const bounds = getViewportBounds();

    const preferred = parsePlacement(placement);
    const side = resolveFlip(preferred.side, anchorRect, surfaceRect, bounds);
    const align = preferred.align;

    let top: number;
    let left: number;

    if (side === "top" || side === "bottom") {
      top =
        side === "top" ? anchorRect.top - surfaceRect.height - offset : anchorRect.bottom + offset;

      if (align === "start") left = anchorRect.left;
      else if (align === "end") left = anchorRect.right - surfaceRect.width;
      else left = anchorRect.left + anchorRect.width / 2 - surfaceRect.width / 2;

      if (shift) {
        left = clamp(
          left,
          bounds.left + VIEWPORT_MARGIN,
          bounds.right - surfaceRect.width - VIEWPORT_MARGIN,
        );
      }
    } else {
      left =
        side === "left" ? anchorRect.left - surfaceRect.width - offset : anchorRect.right + offset;
      top = anchorRect.top + anchorRect.height / 2 - surfaceRect.height / 2;

      if (shift) {
        top = clamp(
          top,
          bounds.top + VIEWPORT_MARGIN,
          bounds.bottom - surfaceRect.height - VIEWPORT_MARGIN,
        );
      }
    }

    node.style.position = "fixed";
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
    node.dataset.placement = align === "center" ? side : `${side}-${align}`;

    if (matchWidth) {
      node.style.minWidth = `${anchorRect.width}px`;
    }
  }

  function scheduleReposition() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = null;
      reposition();
    });
  }

  function attach() {
    if (listening || !enabled || !anchor) return;
    listening = true;

    // Capture phase so ancestor scroll containers (not just the window) are
    // caught — a scrollable panel between the anchor and <body> would
    // otherwise silently detach the surface from its anchor.
    window.addEventListener("scroll", scheduleReposition, { capture: true, passive: true });
    window.addEventListener("resize", scheduleReposition);

    // The soft keyboard resizes/scrolls the visual viewport without firing
    // window's own resize/scroll — absent in jsdom, so guard it.
    window.visualViewport?.addEventListener("resize", scheduleReposition);
    window.visualViewport?.addEventListener("scroll", scheduleReposition);

    // First correct use of ResizeObserver in this library — guard its
    // absence rather than assume the runtime has it.
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleReposition);
      resizeObserver.observe(node);
      resizeObserver.observe(anchor);
    }

    scheduleReposition();
  }

  function detach() {
    if (!listening) return;
    listening = false;

    window.removeEventListener("scroll", scheduleReposition, true);
    window.removeEventListener("resize", scheduleReposition);
    window.visualViewport?.removeEventListener("resize", scheduleReposition);
    window.visualViewport?.removeEventListener("scroll", scheduleReposition);
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  attach();

  return {
    update(next: AnchoredOptions) {
      const wasEnabled = enabled && !!anchor;
      const previousAnchor = anchor;
      ({
        anchor,
        placement = "bottom-start",
        offset = 6,
        flip = true,
        shift = true,
        enabled = true,
        matchWidth = false,
      } = next);
      const isEnabled = enabled && !!anchor;

      // A swapped anchor has to tear down first: `attach` is a no-op while
      // already listening, so the ResizeObserver would keep watching the old
      // element and the surface would track a trigger that no longer owns it.
      if (previousAnchor !== anchor) detach();

      if (wasEnabled && !isEnabled) {
        detach();
      } else if (isEnabled) {
        attach();
        scheduleReposition();
      }
    },
    destroy() {
      detach();
    },
  };
}
