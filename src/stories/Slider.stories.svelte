<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Slider from '../lib/atoms/Slider.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Slider',
    component: Slider,
    tags: ['autodocs'],
    render: SliderTemplate
  });
</script>

{#snippet SliderTemplate(args)}
  <div style="width: 320px; padding: 16px;">
    <Slider {...args} />
  </div>
{/snippet}

<Story name="Default" args={{ value: 45, min: 0, max: 100 }} />

<Story name="With Label & Value" args={{ value: 72, min: 0, max: 100, label: 'Font Size', showValue: true }} />

<Story name="Custom Range & Step" args={{ value: 16, min: 8, max: 64, step: 2, label: 'Cell Height', showValue: true }} />

<Story name="Disabled" args={{ value: 30, label: 'Locked Property', disabled: true }} />
