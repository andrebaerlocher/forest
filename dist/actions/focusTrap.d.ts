export interface FocusTrapOptions {
    /** Set false to leave focus alone (e.g. while the surface is closed) */
    enabled?: boolean;
    /** Move focus into the surface on mount. */
    autoFocus?: boolean;
    /** Return focus to whatever was focused before the surface opened. */
    restoreFocus?: boolean;
}
/**
 * Keeps Tab inside a transient surface and hands focus back when it closes.
 *
 * Modal surfaces must not leak focus to the page behind them — without this a
 * keyboard user tabs straight out of an open dialog into the document.
 *
 * Usage: <div use:focusTrap={{ enabled: open }}>
 */
export declare function focusTrap(node: HTMLElement, options?: FocusTrapOptions): {
    update(next?: FocusTrapOptions): void;
    destroy(): void;
};
