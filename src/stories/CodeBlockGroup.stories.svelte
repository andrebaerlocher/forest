<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CodeBlockGroup from '../lib/organisms/CodeBlockGroup.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/CodeBlockGroup',
    component: CodeBlockGroup,
    tags: ['autodocs']
  });

  const threeFiles = [
    {
      id: 'recommender',
      filename: 'recommender.ts',
      language: 'typescript',
      code: `export function topExercises(mastery: Mastery, graph: SkillGraph, k = 3): Exercise[] {
  const eligible = graph.exercises.filter((ex) => meetsPrereqs(ex, mastery));
  return eligible
    .map((ex) => ({ ex, score: informationGain(ex, mastery) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ ex }) => ex);
}`
    },
    {
      id: 'diagnosis',
      filename: 'diagnosis.ts',
      language: 'typescript',
      code: `export function updateMastery(prior: Mastery, response: Response): Mastery {
  const pLearn = bktTransition(prior, response.skillId);
  const pSlip = 0.1;
  const pGuess = 0.2;
  return applyBayesUpdate(prior, response, { pLearn, pSlip, pGuess });
}`
    },
    {
      id: 'types',
      filename: 'types.ts',
      language: 'typescript',
      code: `export interface Exercise {
  id: string;
  skillId: string;
  prerequisites: string[];
  threshold: number;
}

export type Mastery = Map<string, number>;`
    }
  ];

  const singleFile = [
    {
      id: 'types',
      filename: 'types.ts',
      language: 'typescript',
      code: `export interface Exercise {
  id: string;
  skillId: string;
  prerequisites: string[];
  threshold: number;
}

export type Mastery = Map<string, number>;`
    }
  ];
</script>

<Story name="Standard" args={{ files: threeFiles }} />

<Story name="Single file" args={{ files: singleFile }} />
