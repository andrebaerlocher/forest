<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Alert from '../lib/molecules/Alert.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/Alert',
    component: Alert,
    tags: ['autodocs']
  });
</script>

{#snippet neutralBody()}
Evaluation metrics are sourced from production telemetry. Refreshed hourly.
{/snippet}

{#snippet successBody()}
Dataset validation complete. All 52,000 samples passed rubric alignment checks.
{/snippet}

{#snippet warningBody()}
Rater agreement has dropped below 0.80. Consider retraining the scoring model or reviewing the rubric definitions.
{/snippet}

{#snippet dangerBody()}
Service degradation detected. Response times exceeded 5s threshold for 3 minutes.
{/snippet}

<Story name="Neutral" args={{ status: 'neutral', title: 'Status update', children: neutralBody }} />

<Story name="Success" args={{ status: 'success', title: 'Validation complete', children: successBody }} />

<Story name="Warning" args={{ status: 'warning', title: 'Action required', children: warningBody }} />

<Story name="Danger" args={{ status: 'danger', title: 'System alert', children: dangerBody }} />

<Story
  name="With dismiss"
  args={{
    status: 'neutral',
    title: 'Feature announcement',
    children: () => 'Anchor-text recommendations are now available for your essays.',
    ondismiss: () => {}
  }}
/>
