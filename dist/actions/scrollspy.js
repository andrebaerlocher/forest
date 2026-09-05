/**
 * Tracks which anchored section the reader is currently in.
 *
 * Actions never run during SSR, so the table of contents renders with no active
 * entry on the server and gains one on the first observer callback. That is the
 * house rule from `breakpoints.svelte.ts` applied here: CSS owns the first
 * frame's appearance, JS only refines it afterwards.
 *
 * Usage: <nav use:scrollspy={{ ids, onchange: (id) => (activeId = id) }}>
 */
export function scrollspy(node, options) {
    let { ids, onchange, rootMargin = "-10% 0px -70% 0px" } = options;
    let observer = null;
    const visible = new Set();
    const doc = node.ownerDocument;
    function elementsFor(list) {
        return list.map((id) => doc.getElementById(id)).filter((el) => el !== null);
    }
    /**
     * Nothing intersects when a section is taller than the band — mid-section, or
     * at the very top or bottom of the document. Fall back to the last section
     * whose top has already passed the band, which is the one being read.
     */
    function fallbackActive() {
        let last = null;
        const threshold = (doc.documentElement.clientHeight || 800) * 0.1;
        for (const id of ids) {
            const el = doc.getElementById(id);
            if (el && el.getBoundingClientRect().top <= threshold)
                last = id;
        }
        return last;
    }
    function emit() {
        // A Section that contains nested Sections (e.g. a "Decisions" chapter
        // wrapping each decision record) is visible for its entire span, so it
        // would otherwise always win — it's document-order-first and intersects
        // whenever any of its children do. Drop any visible id whose element
        // contains another visible id's element, leaving only the most specific
        // (innermost) candidates, then take the topmost of those.
        const visibleIds = ids.filter((id) => visible.has(id));
        const specific = visibleIds.filter((id) => {
            const el = doc.getElementById(id);
            return !visibleIds.some((otherId) => {
                if (otherId === id)
                    return false;
                const otherEl = doc.getElementById(otherId);
                return !!el && !!otherEl && el.contains(otherEl);
            });
        });
        const active = specific[0] ?? fallbackActive();
        onchange(active);
    }
    function observe() {
        observer?.disconnect();
        visible.clear();
        if (ids.length === 0) {
            onchange(null);
            return;
        }
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting)
                    visible.add(entry.target.id);
                else
                    visible.delete(entry.target.id);
            }
            emit();
        }, { rootMargin });
        for (const el of elementsFor(ids))
            observer.observe(el);
        emit();
    }
    observe();
    return {
        update(next) {
            const changed = next.ids.length !== ids.length ||
                next.ids.some((id, i) => id !== ids[i]) ||
                next.rootMargin !== rootMargin;
            ({ ids, onchange, rootMargin = "-10% 0px -70% 0px" } = next);
            if (changed)
                observe();
        },
        destroy() {
            observer?.disconnect();
            observer = null;
        },
    };
}
