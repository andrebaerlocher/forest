/**
 * Domain shapes — the objects a consuming app builds and hands to a component.
 *
 * This module deliberately imports nothing: components import from here, and
 * `types.ts` (which imports every component for `ComponentProps`) re-exports it.
 * Keeping it a leaf avoids a cycle between components and the type surface.
 */
export {};
