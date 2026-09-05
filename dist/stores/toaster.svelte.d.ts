export type ToastStatus = "neutral" | "success" | "warning" | "danger";
export interface ToastItem {
    id: string;
    message: string;
    status: ToastStatus;
    /** ms before auto-dismiss; 0 keeps it until dismissed */
    duration: number;
}
export interface ToastOptions {
    status?: ToastStatus;
    duration?: number;
}
export interface ToasterOptions {
    /** Default ms before auto-dismiss. 0 disables it. */
    duration?: number;
    /** Oldest toasts drop off once the stack exceeds this. */
    max?: number;
}
/**
 * A toast stack. Toasts queue rather than replacing one another, so a burst of
 * events doesn't silently swallow all but the last message.
 *
 * Most apps want the shared `toaster` singleton below; call this directly only
 * when you need an independent stack (tests, an isolated surface).
 */
export declare function createToaster(options?: ToasterOptions): {
    readonly items: ToastItem[];
    push: (message: string, opts?: ToastOptions) => string;
    dismiss: (id: string) => void;
    clear: () => void;
    pause: (id: string) => void;
    resume: (id: string) => void;
    success: (message: string, opts?: ToastOptions) => string;
    warning: (message: string, opts?: ToastOptions) => string;
    danger: (message: string, opts?: ToastOptions) => string;
};
export type Toaster = ReturnType<typeof createToaster>;
/** The shared stack. Render it once with <ToastRegion />. */
export declare const toaster: {
    readonly items: ToastItem[];
    push: (message: string, opts?: ToastOptions) => string;
    dismiss: (id: string) => void;
    clear: () => void;
    pause: (id: string) => void;
    resume: (id: string) => void;
    success: (message: string, opts?: ToastOptions) => string;
    warning: (message: string, opts?: ToastOptions) => string;
    danger: (message: string, opts?: ToastOptions) => string;
};
