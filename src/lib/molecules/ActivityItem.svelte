<script lang="ts">
  import type { Snippet } from 'svelte';
  import Avatar from '../atoms/Avatar.svelte';

  interface Props {
    /** Who did it — also drives the avatar initials */
    actor: string;
    /** What they did, e.g. "moved" or "left a note on" */
    verb?: string;
    /** What it happened to, e.g. a deal or contact name */
    target?: string;
    /** Already-formatted timestamp; the component does no date maths */
    timestamp?: string;
    avatarSrc?: string;
    class?: string;
    /** Optional body — a note, a quoted change, an attachment row */
    children?: Snippet;
    trailing?: Snippet;
  }

  let {
    actor,
    verb = '',
    target = '',
    timestamp = '',
    avatarSrc,
    class: className = '',
    children,
    trailing
  }: Props = $props();
</script>

<article class="activity-item {className}">
  <div class="avatar-slot">
    <Avatar name={actor} src={avatarSrc} size="sm" />
  </div>

  <div class="body">
    <p class="line">
      <span class="actor">{actor}</span>
      {#if verb}<span class="verb">{verb}</span>{/if}
      {#if target}<span class="target">{target}</span>{/if}
    </p>

    {#if children}
      <div class="detail">{@render children()}</div>
    {/if}
  </div>

  <div class="meta">
    {#if trailing}
      {@render trailing()}
    {:else if timestamp}
      <time class="timestamp">{timestamp}</time>
    {/if}
  </div>
</article>

<style>
  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    font-family: var(--font-body);
  }

  .avatar-slot {
    /* holds the avatar clear of the Timeline rail */
    flex-shrink: 0;
    padding-top: 1px;
  }

  .body {
    flex: 1;
    min-width: 0;
  }

  .line {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--text-2);
  }

  .actor {
    color: var(--text-1);
    font-weight: 400;
  }

  .verb {
    color: var(--text-3);
  }

  .target {
    color: var(--text-1);
  }

  .detail {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-2);
  }

  .meta {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .timestamp {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
  }
</style>
