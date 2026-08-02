<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stepper from '../lib/organisms/Stepper.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Stepper',
    component: Stepper,
    tags: ['autodocs']
  });

  const orderSteps = [
    { id: 'cart', label: 'Selection', detail: '14 trays' },
    { id: 'delivery', label: 'Delivery window', detail: 'Week 12' },
    { id: 'invoice', label: 'Invoicing', detail: 'Net 30' },
    { id: 'confirm', label: 'Confirmation' }
  ];

  const onboardingSteps = [
    { id: 'org', label: 'Organisation' },
    { id: 'team', label: 'Invite the team' },
    { id: 'projects', label: 'First project' },
    { id: 'billing', label: 'Billing' }
  ];
</script>

<script>
  let activeId = $state('invoice');
</script>

<Story
  name="Standard"
  args={{
    steps: orderSteps,
    activeId: 'invoice',
    completedIds: ['cart', 'delivery']
  }}
/>

<Story
  name="Vertical"
  args={{
    steps: onboardingSteps,
    activeId: 'projects',
    completedIds: ['org', 'team'],
    orientation: 'vertical'
  }}
/>

<Story name="First step, nothing completed" args={{ steps: orderSteps, activeId: 'cart' }} />

<!-- With onstepclick the steps become real buttons; without it they stay
     non-interactive markup rather than a row of disabled buttons. -->
<Story name="Interactive">
  <Stepper
    steps={orderSteps}
    bind:activeId
    completedIds={['cart', 'delivery']}
    onstepclick={(id) => (activeId = id)}
  />
</Story>
