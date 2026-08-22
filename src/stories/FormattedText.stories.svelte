<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FormattedText from '../lib/atoms/FormattedText.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/FormattedText',
    component: FormattedText,
    tags: ['autodocs']
  });
</script>

<Story name="Default" args={{ text: 'Inline **bold**, *italic*, `code`, and $E=mc^2$ math.' }} />

<Story name="Block" args={{ text: 'First paragraph with **bold** text.\n\nSecond paragraph with *italic*.\n\n- Item 1\n- Item 2', block: true }} />

<Story name="MultiLevelList" args={{ text: 'Der Dienst kombiniert zwei mathematische Modelle:\n\n* **Surmise Systems**: Kompetenz-Abhängigkeiten als DNF. Statt $2^N$ evaluiert das System *Feasible Knowledge States*.\n* **Dual Estimator Engine**:\n  * **Joint Estimator**: Exakte Bayes-Inferenz bei $\\le 1000$ Zuständen.\n  * **Marginal Estimator**: Speichereffizienter Fallback.\n* **BKT & Hystereseband**: Bayesianische Updates.', block: true }} />

