<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Radio from '../lib/atoms/Radio.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Radio',
    component: Radio,
    tags: ['autodocs'],
    render: RadioTemplate
  });
</script>

{#snippet RadioTemplate(args)}
  {#if args.isGroup}
    <div style="display: flex; gap: 14px;">
      <Radio name="season-story" value="spring" checked={true}>Spring</Radio>
      <Radio name="season-story" value="autumn">Autumn</Radio>
    </div>
  {:else}
    <Radio {...args} />
  {/if}
{/snippet}

{#snippet standardLabel()}Standard Option{/snippet}
{#snippet disabledLabel()}Disabled Option{/snippet}

<Story name="Standard" args={{ name: 'season-story-single', value: 'option1', group: 'option2', children: standardLabel }} />

<Story name="Group Demonstration" args={{ isGroup: true }} />

<Story name="Disabled" args={{ name: 'season-story-single', value: 'option1', group: 'option2', disabled: true, children: disabledLabel }} />
