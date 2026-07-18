<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/atoms/Button.svelte';
  import AppHeader from '../lib/organisms/AppHeader.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/AppHeader',
    component: AppHeader,
    tags: ['autodocs'],
    render: HeaderTemplate
  });
</script>

{#snippet HeaderTemplate(args)}
  <div style="border: 1px solid var(--line-soft); border-radius: var(--radius-m); overflow: hidden; background: var(--canvas);">
    <AppHeader {...args} />
    <div style="height: 100px; padding: 24px; font-family: var(--font-body); font-size: 13px; color: var(--text-3);">
      Page body...
    </div>
  </div>
{/snippet}

{#snippet primaryLabel()}Add spec{/snippet}
{#snippet exportLabel()}Export{/snippet}
{#snippet headerActions()}
  <Button variant="secondary" children={exportLabel} />
  <Button variant="primary" children={primaryLabel} />
{/snippet}

<Story
  name="Standard"
  args={{
    breadcrumbs: [
      { label: 'Specimens', href: '#/specimens' },
      { label: 'Green Tea' }
    ],
    onsearch: () => alert('Search clicked'),
    children: headerActions
  }}
/>
