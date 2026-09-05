<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "ghost" | "danger";
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    type = "button",
    variant = "secondary",
    disabled = false,
    onclick,
    children,
    ...restProps
  }: Props = $props();
</script>

<button {type} class="btn btn-{variant}" {disabled} {onclick} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .btn {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    padding: var(--pad-control-y) 18px;
    border-radius: var(--radius-s);
    cursor: pointer;
    border: 1.5px solid transparent;
    transition:
      background var(--t-fast) var(--ease),
      border-color var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease);
  }

  .btn:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .btn-primary {
    background: var(--cell-edit-bg);
    color: var(--cell-edit-text);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-1);
    border-color: var(--line-strong);
  }

  :global([data-mode="dark"]) .btn-secondary {
    border-color: oklch(94.5% 0.012 95 / 45%);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-1);
  }

  .btn-danger {
    background: transparent;
    color: var(--danger);
    border-color: var(--danger);
  }

  /* Gated: a stuck hover on touch would leave every variant looking
     permanently pressed/lit with no way to release it. */
  @media (hover: hover) {
    .btn-primary:hover {
      background: color-mix(in oklch, var(--cell-edit-bg), white 8%);
    }

    .btn-secondary:hover {
      background: var(--wash);
    }

    .btn-ghost:hover {
      background: var(--wash);
    }

    .btn-danger:hover {
      background: var(--wash);
    }
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
