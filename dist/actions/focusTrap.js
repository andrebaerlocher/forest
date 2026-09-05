const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");
function focusable(node) {
    return Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
}
/**
 * Keeps Tab inside a transient surface and hands focus back when it closes.
 *
 * Modal surfaces must not leak focus to the page behind them — without this a
 * keyboard user tabs straight out of an open dialog into the document.
 *
 * Usage: <div use:focusTrap={{ enabled: open }}>
 */
export function focusTrap(node, options = {}) {
    let { enabled = true, autoFocus = true, restoreFocus = true } = options;
    const previouslyFocused = document.activeElement;
    function handleKeydown(e) {
        if (!enabled || e.key !== "Tab")
            return;
        const items = focusable(node);
        if (items.length === 0) {
            // nothing to land on — keep focus on the surface itself
            e.preventDefault();
            node.focus();
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !node.contains(active))) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    }
    function focusFirst() {
        if (!enabled || !autoFocus)
            return;
        // let the surface finish rendering (and any transition begin) first
        queueMicrotask(() => {
            if (node.contains(document.activeElement))
                return;
            const items = focusable(node);
            if (items.length > 0) {
                items[0].focus();
            }
            else {
                if (!node.hasAttribute("tabindex"))
                    node.setAttribute("tabindex", "-1");
                node.focus();
            }
        });
    }
    node.addEventListener("keydown", handleKeydown);
    focusFirst();
    return {
        update(next = {}) {
            const wasEnabled = enabled;
            ({ enabled = true, autoFocus = true, restoreFocus = true } = next);
            if (!wasEnabled && enabled)
                focusFirst();
        },
        destroy() {
            node.removeEventListener("keydown", handleKeydown);
            if (restoreFocus && previouslyFocused?.isConnected) {
                previouslyFocused.focus();
            }
        },
    };
}
