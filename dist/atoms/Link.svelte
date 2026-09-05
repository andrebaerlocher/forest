<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  interface Props extends HTMLAnchorAttributes {
    href?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    href = '#',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<a href={href} class="link {className}" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</a>

<style>
  .link {
    color: var(--text-1);
    text-decoration: none;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 1px;
    font-family: var(--font-body);
    transition:
      color var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease);
    cursor: pointer;
  }

  /* Gated: a stuck hover on touch would leave the link looking
     permanently visited/active with no way to release it. */
  @media (hover: hover) {
    .link:hover {
      color: var(--accent-ink);
      border-bottom-color: var(--accent-ink);
    }
  }

  .link:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  /* No touch-target rule here on purpose: every consumer (FormattedText,
     the stories prose) sets this mid-sentence inline. A 44px box would
     force line-height on the whole paragraph, not just the link. This is
     the inline-text-link exception (WCAG 2.5.5) — not the same shape as
     Combobox's documented sub-44px .clear, but the same kind of "don't
     apply the tool where it breaks the container" judgment call. */
</style>
