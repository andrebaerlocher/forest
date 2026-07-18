<script lang="ts">
  interface Props {
    hue?: number;
    [key: string]: any;
  }

  let { hue = $bindable(282), ...restProps }: Props = $props();

  function updateHue(event: Event) {
    const target = event.target as HTMLInputElement;
    hue = Number(target.value);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--hue', String(hue));
    }
  }

  $effect(() => {
    const current = getComputedStyle(document.documentElement).getPropertyValue('--hue').trim();
    if (current) {
      hue = Number(current);
    }
  });
</script>

<div class="hue-control" {...restProps}>
  <label for="hueSlider">Ink hue · <span class="val">{hue}</span></label>
  <input
    type="range"
    id="hueSlider"
    min="0"
    max="360"
    value={hue}
    oninput={updateHue}
  />
</div>

<style>
  .hue-control {
    font-family: var(--font-body);
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: oklch(94.5% 0.012 95 / 55%);
  }

  .hue-control label {
    display: block;
    margin-bottom: 8px;
  }

  .hue-control .val {
    color: var(--text-inverse);
  }

  .hue-control input {
    width: 100%;
    margin: 0;
    accent-color: var(--accent);
  }
</style>
