<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Callout from '../lib/molecules/Callout.svelte';
  import PullQuote from '../lib/molecules/PullQuote.svelte';
  import StackManifest from '../lib/molecules/StackManifest.svelte';
  import Standfirst from '../lib/molecules/Standfirst.svelte';
  import BenchmarkTable from '../lib/organisms/BenchmarkTable.svelte';
  import CodeBlockGroup from '../lib/organisms/CodeBlockGroup.svelte';
  import DecisionRecord from '../lib/organisms/DecisionRecord.svelte';
  import DeepDive from '../lib/organisms/DeepDive.svelte';
  import Figure from '../lib/organisms/Figure.svelte';
  import Section from '../lib/organisms/Section.svelte';
  import CaseStudyShell from '../lib/templates/CaseStudyShell.svelte';

  const { Story } = defineMeta({
    title: 'Templates/CaseStudyShell',
    component: CaseStudyShell,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen'
    }
  });

  const metrics = [
    { label: 'p99 latency', value: '165µs', detail: 'excluding network hops' },
    { label: 'Exercises ranked', value: '3', detail: 'next-best, per request' },
    { label: 'Active learners', value: '12.4k', detail: 'peak concurrent' },
    { label: 'Skill graph nodes', value: '2 840', detail: 'CbKST competence states' }
  ];

  const stageBudget = [
    { label: 'Fetch candidate skill graph', value: 38, detail: 'in-memory, no allocation' },
    { label: 'BKT posterior lookup', value: 22, detail: 'precomputed per learner' },
    { label: 'Candidate ranking', value: 91, detail: 'top-3 of ~180 candidates' },
    { label: 'Response serialization', value: 14 }
  ];

  const total = { label: 'Total, excluding network', value: 165 };

  const stack = [
    {
      category: 'Service',
      items: ['Rust', 'axum', 'tokio'],
      constraint: 'p99 < 200µs, excluding network'
    },
    {
      category: 'Modelling',
      items: ['CbKST', 'BKT', 'ndarray']
    },
    {
      category: 'Platform',
      items: ['PostgreSQL', 'Redis', 'Kubernetes'],
      constraint: 'state refreshed off the hot path'
    }
  ];

  const files = [
    {
      id: 'rank',
      filename: 'rank.rs',
      language: 'rust',
      lineNumbers: true,
      highlightLines: [6, 7],
      code: `pub fn next_best(state: &LearnerState, graph: &SkillGraph) -> [ExerciseId; 3] {
    let mut heap = TopK::<3>::new();

    for candidate in graph.fringe(state.mastered) {
        let gain = expected_gain(state, candidate);
        // Fringe order is stable, so ties resolve deterministically —
        // the same learner never sees the set reshuffle between requests.
        heap.push(candidate.id, gain);
    }

    heap.into_sorted()
}`
    },
    {
      id: 'bkt',
      filename: 'bkt_lookup.rs',
      language: 'rust',
      lineNumbers: true,
      code: `#[inline]
pub fn posterior(cache: &CohortCache, learner: LearnerId, skill: SkillId) -> f32 {
    // One flat array indexed by (learner_slot * n_skills + skill).
    // No hashing on the hot path.
    cache.slab[cache.slot(learner) * cache.n_skills + skill.0 as usize]
}`
    }
  ];
</script>

{#snippet pipelineDiagram()}
  <svg viewBox="0 0 720 120" width="720" height="120" role="img" aria-label="Four stage request pipeline">
    <title>Request pipeline</title>
    {#each ['Skill graph', 'BKT lookup', 'Ranking', 'Serialize'] as stage, i (stage)}
      <rect
        x={12 + i * 176}
        y="34"
        width="140"
        height="52"
        rx="6"
        fill="var(--canvas)"
        stroke="var(--line-strong)"
        stroke-width="1.5"
      />
      <text
        x={82 + i * 176}
        y="64"
        text-anchor="middle"
        font-size="13"
        font-family="var(--font-body)"
        fill="var(--text-1)">{stage}</text>
      {#if i < 3}
        <line
          x1={152 + i * 176}
          y1="60"
          x2={188 + i * 176}
          y2="60"
          stroke="var(--accent)"
          stroke-width="1.5"
        />
      {/if}
    {/each}
  </svg>
{/snippet}

{#snippet body()}
  <Section id="problem" number="01" title="The problem">
    <Standfirst>
      A learner finishing an exercise waits on one synchronous call: what should
      they do next? Every millisecond of that call sits between them and the
      answer, and the naive implementation spent most of it waiting on the
      network rather than deciding anything.
    </Standfirst>

    <p>
      The platform models competence with CbKST — a partial order over skill
      states — and tracks mastery with Bayesian Knowledge Tracing. Both are cheap
      to evaluate and expensive to fetch. The whole engineering problem was
      moving the fetch off the request path without letting learner state go
      meaningfully stale.
    </p>

    <Callout tone="info" label="Constraint">
      The 200µs budget is compute only. It deliberately excludes network hops,
      because those are the platform's problem to amortise and this service's job
      is to never be the reason a request is slow.
    </Callout>

    <StackManifest groups={stack} />
  </Section>

  <DeepDive
    id="deepdive-recommender"
    title="Recommendation engine: next-best exercises in under 200µs"
    summary="Ranks the three next-best exercises from precomputed BKT and CbKST state, entirely off the request's network hot path."
  >
    <Section id="rec-pipeline" title="Pipeline">
      <Figure
        id="fig-pipeline"
        number={1}
        wide
        caption="Request pipeline. Each stage is CPU-bound; nothing crosses a network boundary."
      >
        {@render pipelineDiagram()}
      </Figure>
    </Section>

    <Section id="rec-budget" title="Latency budget">
      <BenchmarkTable
        rows={stageBudget}
        {total}
        unit="µs"
        showBars
        caption="Measured p99 per stage, 12.4k concurrent learners."
      />
    </Section>

    <Section id="rec-cache" title="The cache decision">
      <DecisionRecord
        id="adr-recommender-cache"
        title="In-process skill-state cache vs. a network KV lookup"
        status="accepted"
        level={4}
        context="The 200µs budget excludes network hops, but a naive implementation would still call out to Redis for per-learner BKT state on every single request."
        decision="Precompute and pin the active cohort's BKT and CbKST state in-process, refreshed asynchronously off the hot path, rather than reading it per request."
        consequences={[
          'Ranking stays entirely CPU-bound and measurable in isolation.',
          'Learner state can be up to one refresh interval stale.',
          'Memory scales with concurrently active learners, not total learners.'
        ]}
        alternatives={[
          {
            option: 'Per-request Redis GET',
            rejectedBecause:
              'Even a same-AZ round trip of 300–800µs blows the entire budget on its own.'
          },
          {
            option: 'Read-through local cache with a TTL',
            rejectedBecause:
              'Still pays a cold-cache network penalty on the p99 tail — exactly the tail this budget exists to protect.'
          }
        ]}
      />

      <CodeBlockGroup {files} />
    </Section>
  </DeepDive>

  <Section id="outcome" number="02" title="Outcome">
    <p>
      The service holds its budget at peak load, and the ranking logic became
      testable in isolation because it no longer depends on anything it cannot
      hold in memory.
    </p>

    <PullQuote>
      {#snippet attribution()}
        <span>Placeholder attribution — replace with a real one or drop the block.</span>
      {/snippet}
      Recommendations stopped being the thing we blamed when a lesson felt slow.
    </PullQuote>

    <Callout label="Retrospective">
      The refresh interval is a single global constant. It should be per-cohort:
      a class working through new material needs fresher state than one revising,
      and treating them identically wastes refresh budget on the wrong learners.
    </Callout>
  </Section>
{/snippet}

<Story name="Full case study">
  <CaseStudyShell
    title="Learning platform: diagnosis and recommendation at interactive latency"
    subtitle="Case study & architectural deep dive"
    tags={['Software Architecture', 'Rust', 'Learning Science']}
    {metrics}
    children={body}
  />
</Story>

<Story name="Prose only, no metrics">
  <CaseStudyShell title="A study with nothing but sections" children={proseOnly} />
</Story>

{#snippet proseOnly()}
  <Section id="one" number="01" title="First section">
    <p>The shell is usable before any figure, table or code block exists.</p>
  </Section>
  <Section id="two" number="02" title="Second section">
    <p>The outline still builds itself from whatever mounted.</p>
  </Section>
{/snippet}
