<script lang="ts">
  interface Props {
    orientation?: 'horizontal' | 'vertical';
    variant?: 'soft' | 'strong';
    class?: string;
  }

  let {
    orientation = 'horizontal',
    variant = 'soft',
    class: className = ''
  }: Props = $props();
</script>

<hr
  class="divider {orientation} {variant} {className}"
  aria-orientation={orientation}
/>

<style>
  .divider {
    background: var(--line-soft);
    transition: background var(--t-base) var(--ease);
    border: none;
  }

  /* Soft and strong variants */
  .divider.soft {
    background: var(--line-soft);
  }

  .divider.strong {
    background: var(--line-strong);
  }

  /* Horizontal orientation */
  .divider.horizontal {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }

  .divider.horizontal.strong {
    height: 1.5px;
  }

  /* Vertical orientation */
  .divider.vertical {
    width: 1px;
    height: 100%;
    margin: 0 8px;
    display: inline-block;
    align-self: stretch;
  }

  .divider.vertical.strong {
    width: 1.5px;
  }
</style>
