<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Draw the seal ring. Off gives a bare initials disc. */
    ring?: boolean;
    class?: string;
  }

  let {
    name,
    src,
    size = 'md',
    ring = true,
    class: className = '',
    ...restProps
  }: Props = $props();

  // Two initials at most: "Ada Lovelace" -> AL, "Ada" -> A
  let initials = $derived(
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  );
</script>

<span
  class="avatar size-{size} {className}"
  class:ring
  title={name}
  role="img"
  aria-label={name}
  {...restProps}
>
  {#if src}
    <img {src} alt="" />
  {:else}
    <span class="initials" aria-hidden="true">{initials}</span>
  {/if}
</span>

<style>
  /* A small seal — no hash-coloured backgrounds, that would paint rather than ink */
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
    border: 1.5px solid transparent;
    background: var(--raised);
    color: var(--text-2);
    font-family: var(--font-body);
    font-weight: 500;
    letter-spacing: 0.04em;
    user-select: none;
  }

  .avatar.ring {
    border-color: var(--line-mid);
  }

  .size-sm {
    width: 22px;
    height: 22px;
    font-size: 9px;
  }

  .size-md {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  .size-lg {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .initials {
    line-height: 1;
  }
</style>
