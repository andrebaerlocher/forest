<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CodeBlock from '../lib/organisms/CodeBlock.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/CodeBlock',
    component: CodeBlock,
    tags: ['autodocs']
  });

  const rankExercises = `function topExercises(mastery: Map<string, number>, graph: SkillGraph, k = 3): Exercise[] {
  const eligible = graph.exercises.filter((ex) =>
    ex.prerequisites.every((skill) => (mastery.get(skill) ?? 0) >= ex.threshold)
  );

  return eligible
    .map((ex) => ({ ex, score: informationGain(ex, mastery) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ ex }) => ex);
}`;

</script>

<!--
  Stands in for a build-time highlighter's output. CodeBlock takes highlighted
  code as a snippet rather than an HTML string, so the consuming app decides how
  to turn its highlighter's result into markup — Forest never accepts raw HTML.
  Rendered whole, so lineNumbers/highlightLines do not apply on this path.
-->
{#snippet highlightedSource()}<span class="tok-kw">const</span> eligible = graph.exercises.<span
    class="tok-fn">filter</span
  >(isUnlocked);
<span class="tok-kw">const</span> ranked = eligible.<span class="tok-fn">sort</span>(byGain);
<span class="tok-kw">return</span> ranked.<span class="tok-fn">slice</span>(<span class="tok-num"
    >0</span
  >, k);{/snippet}

<Story
  name="Standard"
  args={{
    filename: 'recommender.ts',
    language: 'typescript',
    code: rankExercises
  }}
/>

<Story
  name="With line numbers"
  args={{
    filename: 'recommender.ts',
    language: 'typescript',
    code: rankExercises,
    lineNumbers: true
  }}
/>

<Story
  name="With highlighted lines"
  args={{
    filename: 'recommender.ts',
    language: 'typescript',
    code: rankExercises,
    lineNumbers: true,
    highlightLines: [6, 7, 8]
  }}
/>

<Story
  name="Pre-highlighted"
  args={{
    filename: 'recommender.ts',
    language: 'typescript',
    highlighted: highlightedSource
  }}
/>

<Story
  name="Not copyable"
  args={{
    filename: 'recommender.ts',
    language: 'typescript',
    code: rankExercises,
    copyable: false
  }}
/>

<style>
  /* Token colours a real highlighter would emit. Kept inside the story: the
     library ships no theme for syntax, only the surface it sits on. */
  .tok-kw {
    color: oklch(78% 0.11 320);
  }

  .tok-fn {
    color: oklch(86% 0.11 95);
  }

  .tok-num {
    color: oklch(84% 0.1 145);
  }
</style>
