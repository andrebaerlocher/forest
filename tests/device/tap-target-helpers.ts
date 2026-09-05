/**
 * Shared logic for the phone tap-target assertion (RESPONSIVE.md, Phase 0/2).
 *
 * The one documented exception in the system is `molecules/Combobox.svelte`
 * `.clear` (see the comment above its `@media (pointer: coarse)` block,
 * around line 324): "THE ONE DOCUMENTED SUB-44px TARGET IN THE SYSTEM …
 * Deliberate; do not 'fix' to 44." That comment *is* the opt-out — this
 * module gives the same idea a machine-checkable form: a `data-*` attribute
 * carrying the justification text, so a future opt-out has to be written
 * down next to the element, not just in CSS. Combobox itself is not edited
 * here (components under src/lib are owned by other work in flight); when
 * it next gets touched, its `.clear` button should carry this attribute
 * with that same justification as its value.
 */

/** Elements a user can tap, per the phone hit-target contract. */
export const TAP_TARGET_SELECTOR =
  'a, button, input, select, [role="button"], [role="tab"], [tabindex]:not([tabindex="-1"])';

/**
 * Opt-out attribute. The value must be the written justification — an empty
 * value does not count as an opt-out, so a real reason is required.
 */
export const EXEMPT_ATTR = "data-tap-target-exempt";

export interface TapTargetViolation {
  tag: string;
  id: string;
  className: string;
  width: number;
  height: number;
}

/** True only when the attribute is present AND carries non-empty text. */
export function isExempt(el: Element): boolean {
  const reason = el.getAttribute(EXEMPT_ATTR);
  return typeof reason === "string" && reason.trim().length > 0;
}

/**
 * Invisible things have no target: skip zero-size elements and anything
 * `display: none` (directly or via an ancestor — both collapse the
 * rendered box to 0x0, which getBoundingClientRect already reflects).
 */
export function isRenderedForTapTarget(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  if (getComputedStyle(el).display === "none") return false;
  return true;
}

function classAttr(el: Element): string {
  const raw = el.getAttribute("class");
  return raw ? raw.trim() : "";
}

/**
 * The size that actually receives a tap — which is NOT always the border box.
 *
 * `.hit-44` (forest.css, inside `@media (pointer: coarse)`) deliberately keeps
 * the visible ink small and grows an absolutely-positioned, transparent
 * `::after` to `max(100%, 44px)` instead. That is the whole point of it: the
 * house box model forbids anything that shifts pixels, so the target grows
 * without the control appearing to. Measuring only `getBoundingClientRect()`
 * therefore reports a correctly-sized SealButton as a 28x28 failure.
 *
 * So take the larger of the border box and the ::after box. A pseudo-element
 * with `content: none` is not generated and contributes nothing.
 */
export function effectiveTapSize(el: Element): { width: number; height: number } {
  const rect = el.getBoundingClientRect();
  let width = rect.width;
  let height = rect.height;

  const after = getComputedStyle(el, "::after");
  if (after.content && after.content !== "none" && after.position === "absolute") {
    const aw = Number.parseFloat(after.width);
    const ah = Number.parseFloat(after.height);
    if (Number.isFinite(aw)) width = Math.max(width, aw);
    if (Number.isFinite(ah)) height = Math.max(height, ah);
  }

  // Round to the nearest pixel so sub-pixel antialiasing (43.98px) does not
  // read as a failure when the intent was clearly 44.
  return { width: Math.round(width), height: Math.round(height) };
}

/** Walk a root and report every non-exempt, undersized tap target. */
export function measureTapTargets(root: ParentNode): TapTargetViolation[] {
  const candidates = Array.from(root.querySelectorAll(TAP_TARGET_SELECTOR));
  const violations: TapTargetViolation[] = [];

  for (const el of candidates) {
    if (!isRenderedForTapTarget(el)) continue;
    if (isExempt(el)) continue;

    const { width, height } = effectiveTapSize(el);

    if (width < 44 || height < 44) {
      violations.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        className: classAttr(el),
        width,
        height,
      });
    }
  }

  return violations;
}

/** A report readable by someone fixing components, not just a test runner. */
export function formatViolationsReport(violations: TapTargetViolation[]): string {
  const lines = violations.map((v, i) => {
    const idPart = v.id ? `#${v.id}` : "";
    const classPart = v.className ? `.${v.className.split(/\s+/).filter(Boolean).join(".")}` : "";
    return `  ${i + 1}. <${v.tag}${idPart}${classPart}> measured ${v.width}x${v.height}px (needs >=44x44)`;
  });

  return [
    `${violations.length} tap target(s) below the 44x44px minimum at 375px phone width:`,
    ...lines,
    "",
    `Opt out only with a written justification: add ${EXEMPT_ATTR}="<why>" on the element.`,
    `See molecules/Combobox.svelte's .clear button for the one documented precedent —`,
    `it is a design decision, not a default; an empty attribute value does not count.`,
  ].join("\n");
}
