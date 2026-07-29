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

let counter = 0;

/**
 * A toast stack. Toasts queue rather than replacing one another, so a burst of
 * events doesn't silently swallow all but the last message.
 *
 * Most apps want the shared `toaster` singleton below; call this directly only
 * when you need an independent stack (tests, an isolated surface).
 */
export function createToaster(options: ToasterOptions = {}) {
  const { duration: defaultDuration = 3500, max = 4 } = options;

  let items = $state<ToastItem[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function clearTimer(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  function dismiss(id: string) {
    clearTimer(id);
    items = items.filter((t) => t.id !== id);
  }

  function push(message: string, opts: ToastOptions = {}): string {
    counter += 1;
    const id = `toast-${counter}`;
    const toast: ToastItem = {
      id,
      message,
      status: opts.status ?? "neutral",
      duration: opts.duration ?? defaultDuration,
    };

    items = [...items, toast];

    // Trim from the front so the newest message is never the one dropped
    while (items.length > max) {
      const oldest = items[0];
      clearTimer(oldest.id);
      items = items.slice(1);
    }

    if (toast.duration > 0) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), toast.duration),
      );
    }

    return id;
  }

  function clear() {
    for (const id of timers.keys()) clearTimer(id);
    items = [];
  }

  /** Suspend auto-dismiss — call while the pointer rests on a toast. */
  function pause(id: string) {
    clearTimer(id);
  }

  /** Resume auto-dismiss after a pause. */
  function resume(id: string) {
    const toast = items.find((t) => t.id === id);
    if (!toast || toast.duration <= 0 || timers.has(id)) return;
    timers.set(
      id,
      setTimeout(() => dismiss(id), toast.duration),
    );
  }

  return {
    get items() {
      return items;
    },
    push,
    dismiss,
    clear,
    pause,
    resume,
    success: (message: string, opts: ToastOptions = {}) =>
      push(message, { ...opts, status: "success" }),
    warning: (message: string, opts: ToastOptions = {}) =>
      push(message, { ...opts, status: "warning" }),
    danger: (message: string, opts: ToastOptions = {}) =>
      push(message, { ...opts, status: "danger" }),
  };
}

export type Toaster = ReturnType<typeof createToaster>;

/** The shared stack. Render it once with <ToastRegion />. */
export const toaster = createToaster();
