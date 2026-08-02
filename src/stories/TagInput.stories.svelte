<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TagInput from '../lib/molecules/TagInput.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/TagInput',
    component: TagInput,
    tags: ['autodocs']
  });

  const segments = [
    'Enterprise',
    'Mid-market',
    'SME',
    'Public sector',
    'Education',
    'Non-profit',
    'Reseller'
  ];
</script>

<script>
  let freeform = $state(['churn-risk']);
  let withSuggestions = $state(['SME']);
  let capped = $state(['Enterprise', 'Education']);
</script>

<!-- Free entry: no suggestion source, so anything typed is accepted. -->
<Story name="Standard">
  <div class="wrap">
    <TagInput bind:value={freeform} label="Account tags" placeholder="Add a tag…" />
  </div>
</Story>

<Story name="With suggestions">
  <div class="wrap">
    <TagInput
      bind:value={withSuggestions}
      suggestions={segments}
      label="Segments"
      placeholder="Type to search segments…"
    />
  </div>
</Story>

<Story name="Capped at three">
  <div class="wrap">
    <TagInput
      bind:value={capped}
      suggestions={segments}
      max={3}
      label="Segments"
      placeholder="Up to three…"
    />
  </div>
</Story>

<Story name="Disabled">
  <div class="wrap">
    <TagInput value={['SME', 'Reseller']} label="Segments" disabled />
  </div>
</Story>

<style>
  .wrap {
    max-width: 420px;
  }
</style>
