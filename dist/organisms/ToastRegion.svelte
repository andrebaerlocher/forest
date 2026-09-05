<script lang="ts">
  import Toast from '../molecules/Toast.svelte';
  import { toaster as sharedToaster, type Toaster } from '../stores/toaster.svelte.js';

  interface Props {
    /** Defaults to the shared stack; pass your own for an isolated region. */
    toaster?: Toaster;
    placement?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    class?: string;
  }

  let {
    toaster = sharedToaster,
    placement = 'bottom-right',
    class: className = ''
  }: Props = $props();
</script>

<!-- One region per app. Toasts stack instead of replacing one another. -->
<div class="toast-region place-{placement} {className}">
  {#each toaster.items as item (item.id)}
    <Toast
      open
      standalone={false}
      message={item.message}
      status={item.status}
      onclose={() => toaster.dismiss(item.id)}
      onmouseenter={() => toaster.pause(item.id)}
      onmouseleave={() => toaster.resume(item.id)}
    />
  {/each}
</div>

<style>
  .toast-region {
    position: fixed;
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: min(340px, calc(100vw - 48px));
    /* the region spans the corner but must not swallow clicks between toasts */
    pointer-events: none;
  }

  .toast-region > :global(*) {
    pointer-events: auto;
  }

  .place-bottom-right {
    bottom: 24px;
    right: 24px;
    align-items: flex-end;
  }

  .place-bottom-left {
    bottom: 24px;
    left: 24px;
    align-items: flex-start;
  }

  /* newest on top reads better when the stack grows downward */
  .place-top-right {
    top: 24px;
    right: 24px;
    align-items: flex-end;
    flex-direction: column-reverse;
  }

  .place-top-left {
    top: 24px;
    left: 24px;
    align-items: flex-start;
    flex-direction: column-reverse;
  }
</style>
