<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DecisionRecord from '../lib/organisms/DecisionRecord.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/DecisionRecord',
    component: DecisionRecord,
    tags: ['autodocs']
  });
</script>

<Story
  name="Proposed"
  args={{
    id: 'adr-001',
    title: 'Cache recommendation scores for 30 seconds',
    status: 'proposed',
    context: 'Recommendation **latency** is our *p99 constraint*. Current average is `380µs`, but we need to handle 10,000 concurrent users. See [architecture docs](https://example.com/docs).',
    decision: 'Implement a **30-second TTL cache** for recommendation scores, keyed by `(learner_id, knowledge_state_hash)`.',
    consequences: [
      'Reduces database queries by **85%** in *normal operation*',
      'Introduces **30-second staleness** in knowledge state updates',
      'Requires cache invalidation strategy for *curriculum changes*',
      'Cache misses on cold starts cost `120µs` additional latency'
    ],
    alternatives: [
      {
        option: 'No caching; optimize *query layer* instead',
        rejectedBecause: 'Database layer already uses **indexes** and **connection pooling**. Further gains require hardware scaling.'
      },
      {
        option: 'Longer TTL (`60s` or `120s`)',
        rejectedBecause: 'Pedagogically risky; staleness could recommend already-mastered content.'
      }
    ]
  }}
/>

<Story
  name="Accepted"
  args={{
    id: 'adr-002',
    title: 'Use LLM-based evaluation for essay scoring',
    status: 'accepted',
    context: 'Manual essay grading cannot scale to 1M+ submissions per semester. We need an automated approach with human-level agreement.',
    decision: 'Train a fine-tuned LLM on 50K human-scored essays with rubric annotations. Use ensemble methods to reach 0.91 agreement with human raters.',
    consequences: [
      'Reduces grading latency from 2 hours (human) to 8 seconds (model)',
      'Agreement metric (κ = 0.81) is acceptable but not perfect',
      'Requires ongoing monitoring for data distribution drift',
      'Model updates take 1–2 weeks; human grading changes are instant'
    ],
    alternatives: [
      {
        option: 'Heuristic-based scoring (keyword/structure matching)',
        rejectedBecause: 'Ceiling agreement ~0.65; misses nuance in student reasoning and feedback quality.'
      },
      {
        option: 'Crowdsourced grading (Mechanical Turk-style)',
        rejectedBecause: 'Quality control difficult; cost approaches manual grading; latency still 10+ minutes per essay.'
      }
    ]
  }}
/>

<Story
  name="Final"
  args={{
    id: 'adr-002-b',
    title: 'Adopt PostgreSQL as primary relational storage',
    status: 'final',
    context: 'The system requires a highly reliable transactional storage engine with robust extension support.',
    decision: 'Standardize on PostgreSQL 16 for all relational data and transactional boundaries.',
    consequences: [
      'Guarantees ACID compliance across core entities',
      'Leverages JSONB support for flexible payload attributes',
      'Simplifies operational backups and replication'
    ],
    alternatives: [
      {
        option: 'MySQL 8',
        rejectedBecause: 'Inferior JSON query performance and less rich extension ecosystem.'
      }
    ]
  }}
/>

<Story
  name="Superseded"
  args={{
    id: 'adr-003',
    title: 'Store user sessions in-process (memory)',
    status: 'superseded',
    context: 'Early prototype used Node.js in-memory session store for speed. With single-server deployment this was adequate.',
    decision: 'Upgrade to Redis for distributed session storage to support multi-server deployments.',
    consequences: [
      'Session storage now survives server restarts',
      'Enables horizontal scaling across 3+ instances',
      'Adds ~5µs latency per session lookup',
      'Redis failover requires manual intervention'
    ],
    alternatives: [
      {
        option: 'Continue using in-memory store with data replication',
        rejectedBecause: 'Synchronization complexity and data loss risk outweigh single-instance simplicity gain.'
      }
    ]
  }}
/>

<Story
  name="Deprecated"
  args={{
    id: 'adr-004',
    title: 'Synchronous recommendation API (request/response)',
    status: 'deprecated',
    context: 'Original design returned recommendations in the HTTP response, blocking on LLM inference.',
    decision: 'Replace with asynchronous job queue (Celery/Bull). Return job ID immediately; client polls for results.',
    consequences: [
      'User interface must handle pending states',
      'Allows background processing and batching',
      'Job queue resilience improved from ~98% to 99.98%',
      'API contract changed; requires client migration'
    ],
    alternatives: [
      {
        option: 'Implement HTTP streaming (Server-Sent Events)',
        rejectedBecause: 'Browser compatibility concerns; queue provides better job auditing and replay capability.'
      }
    ]
  }}
/>

<Story
  name="Combined Gains, Costs and Neutral Consequences"
  args={{
    id: 'adr-005',
    title: 'PostgreSQL vs. Polyglot Persistence',
    status: 'accepted',
    context: 'Ursprünglich war ein Polyglot-Persistence-Ansatz geplant. Für einen Solo-Backend-Entwickler bedeutet eine solche Architektur jedoch einen enormen operativen Overhead.',
    decision: 'Reduktion auf **PostgreSQL** als Single-Source-of-Truth statt einer fragmentierten Multi-Datenbank-Architektur.',
    gains: ['Massive Reduktion der operationalen Komplexität und der Infrastrukturkosten.'],
    costs: ['Keine spezialisierte Graph-Abfragesprache out-of-the-box.'],
    consequences: [
      'Nutzung nativer Postgres-Features (JSONB/LTREE) reicht für aktuelle und mittelfristige Workloads völlig aus.',
      'Definitive Validierung und Auslagerung einzelner Workloads erfolgt erst nach dediziertem Load-Testing in Produktion.'
    ],
    alternatives: [
      {
        option: 'Polyglot Persistence (Multi-DB)',
        rejectedBecause: 'Der operative Aufwand für Wartung und Datensynchronisation stand in keinem wirtschaftlichen Verhältnis zum tatsächlichen Performance-Gewinn.'
      }
    ]
  }}
/>
