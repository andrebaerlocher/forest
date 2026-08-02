<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DeepDive from '../lib/organisms/DeepDive.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/DeepDive',
    component: DeepDive,
    tags: ['autodocs'],
    render: DeepDiveTemplate
  });

  const subsections = [
    { id: 'kappa-formula', label: "Cohen's κ", level: 3 },
    { id: 'alpha-formula', label: "Krippendorff's α", level: 3 },
    { id: 'disagreement-matrix', label: 'Reading the disagreement matrix', level: 3 }
  ];
</script>

{#snippet DeepDiveTemplate(args)}
  <div style="max-width: 720px;">
    <DeepDive {...args} />
  </div>
{/snippet}

{#snippet standardBody()}
  <p>
    The rater-calibration dashboard exists because two humans grading the same essay against the
    same rubric routinely land 8-12 points apart on a 100-point scale. Before any model was
    trained on the labels, we needed a number for how much the raters themselves agreed.
  </p>
  <p>
    We settled on reporting both Cohen's κ for pairwise agreement and Krippendorff's α for the
    full panel, since κ degrades misleadingly when one score band dominates the sample and α does
    not.
  </p>
{/snippet}

{#snippet subsectionsBody()}
  <p>
    Three views make up the deep dive: the pairwise statistic raters see first, the panel-wide
    statistic used for go/no-go decisions on a rubric revision, and the disagreement matrix
    analysts use to find which score bands are actually driving the gap.
  </p>
  <h3 id="kappa-formula">Cohen's κ</h3>
  <p>
    Computed per rater pair per rubric dimension, κ = (p₀ − pₑ) / (1 − pₑ). We flag any pair
    dropping below 0.6 for recalibration training.
  </p>
  <h3 id="alpha-formula">Krippendorff's α</h3>
  <p>
    α extends to more than two raters and to missing data — not every essay in a batch gets all
    five raters — which κ cannot handle without pairwise averaging tricks that hide outliers.
  </p>
  <h3 id="disagreement-matrix">Reading the disagreement matrix</h3>
  <p>
    Rows are the first rater's score band, columns the second's. A healthy rubric keeps mass on
    the diagonal; a rubric that needs rewriting shows a second cluster one band off, usually at
    the boundary between "developing" and "proficient".
  </p>
{/snippet}

<Story
  name="Standard"
  args={{
    id: 'irr-methodology',
    title: 'Computing inter-rater reliability',
    summary:
      'How the dashboard turns raw rater scores into the two agreement statistics analysts actually trust.',
    children: standardBody
  }}
/>

<Story
  name="With subsections"
  args={{
    id: 'irr-statistics',
    title: 'Agreement statistics, in depth',
    summary: 'The three views behind the headline agreement number, and when each one applies.',
    subsections,
    children: subsectionsBody
  }}
/>
