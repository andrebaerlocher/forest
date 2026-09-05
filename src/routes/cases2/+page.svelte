<script lang="ts">
    import Divider from "$lib/atoms/Divider.svelte";
    import FormattedText from "$lib/atoms/FormattedText.svelte";
    import SealButton from "$lib/atoms/SealButton.svelte";
    import Wordmark from "$lib/atoms/Wordmark.svelte";
    import { isPhone } from "$lib/breakpoints.svelte.js";
    import type { CaseStudySummaryData, ChainStep, DecisionStatus, MetricItem, RejectedAlternative, StepItem } from "$lib/domain.js";
    import Callout from "$lib/molecules/Callout.svelte";
    import Disclosure from "$lib/molecules/Disclosure.svelte";
    import StackManifest from "$lib/molecules/StackManifest.svelte";
    import Chain from "$lib/organisms/Chain.svelte";
    import DecisionRecord from "$lib/organisms/DecisionRecord.svelte";
    import DeepDive from "$lib/organisms/DeepDive.svelte";
    import Section from "$lib/organisms/Section.svelte";
    import Stepper from "$lib/organisms/Stepper.svelte";
    import TreeView, { type TreeNodeData } from "$lib/organisms/TreeView.svelte";
    import CaseStudyIndex from "$lib/templates/CaseStudyIndex.svelte";
    import CaseStudyShell from "$lib/templates/CaseStudyShell.svelte";
    import Shell from "$lib/templates/Shell.svelte";

    type DecisionRecordProps = {
      title: string;
      context: string;
      decision: string;
      consequences: string[];
      alternatives: RejectedAlternative[];
      gains?: string[];
      costs?: string[];
      status?: DecisionStatus;
      sectionTitle: string;
      callouts: {label: string, tone: 'neutral' | 'info' | 'warning' | 'success', text: string}[]
    };

    const decisionRecordProps: DecisionRecordProps[] = [
          {
            sectionTitle: 'Backend-Programmiersprache',
            title: 'Go vs. Rust vs. V vs. Swift',
            context: 'Beim Neuaufbau des Systems war die Wahl der Sprache ein zentraler Baustein für Wartbarkeit und Performance. Trotz Erfahrung mit TypeScript und Ruby fehlte diesen Sprachen die nötige Performance für hochkonkurrente Microservices und Echtzeit-Auswertungen, weshalb leistungsstärkere Backend-Sprachen evaluiert wurden.',
            decision: '**Go**',
            gains: [
              'Hohe Entwicklungsgeschwindigkeit und exzellente Concurrency-Features.',
              'Nativer Cloud-Native-Ursprung (hervorragendes Tooling).',
              'Minimale Server-Ressourcen und winzige Container-Images (Distroless Builds via ko).'
            ],
            costs: [
              'Geringe, aber vorhandene Garbage-Collection-Pausen (im direkten Vergleich zu Rust).'
            ],
            consequences: [],
            alternatives: [
              { option: 'Rust', rejectedBecause: 'Bietet zwar maximale Performance und striktere Typensicherheit, wies aber eine höhere Komplexität in der Entwicklung (DX) und ein damals für Web-Services weniger ausgereiftes Ökosystem auf. Der reine Performancevorsprung gegenüber Go war für den Projektfokus vernachlässigbar.' },
              { option: 'V', rejectedBecause: 'Sprachkonzept extrem vielversprechend ("neues C"), in der Praxis jedoch noch nicht produktionsreif. Unbeständiges Ökosystem und nicht belegbare Tooling-Behauptungen.' },
              { option: 'Swift', rejectedBecause: 'Exzellente Sprache, jedoch im Linux/Server-Umfeld mit einer deutlich kleineren Community und weniger ausgereiften Cloud-Native/Microservice-Bibliotheken als Go.' },
            ],
            status: 'final',
            callouts: []
          },
          {
            sectionTitle: 'Datenbank-Technologien',
            title: 'PostgreSQL vs. Polyglot Persistence',
            context: 'Ursprünglich war ein Polyglot-Persistence-Ansatz geplant (Graph-Datenbank wie NebulaGraph für Lernstände, Time-Series-DB wie TimescaleDB für Metriken, PostgreSQL für relationalen Content). Für einen Solo-Backend-Entwickler bedeutet eine solche Architektur jedoch einen enormen operativen Overhead (Backup-Strategien, Schema-Synchronisation, Monitoring).',
            decision: '**PostgreSQL** als Single-Source-of-Truth.',
            gains: [
              'Massive Reduktion der operationalen Komplexität und der Infrastrukturkosten.'
            ],
            consequences: [
              'Nutzung nativer Postgres-Features (JSONB/LTREE) reicht für aktuelle und mittelfristige Workloads völlig aus.',
              'Definitive Validierung und Auslagerung einzelner Workloads erfolgt erst nach dediziertem Load-Testing in Produktion.'
            ],
            alternatives: [
              { option: 'Polyglot Persistence (Multi-DB)', rejectedBecause: 'Der operative Aufwand für Wartung und Datensynchronisation stand in keinem Verhältnis zum tatsächlichen Performance-Gewinn in dieser Projektphase.' }
            ],
            status: 'accepted',
            callouts: []
          },
          {
            sectionTitle: 'Inter-Service-Kommunikation',
            title: 'REST vs. GraphQL vs. gRPC',
            context: 'Die Kommunikation zwischen dem SvelteKit-Frontend und den Microservices sowie der Services untereinander benötigte ein striktes, performantes und vor allem typsicheres Protokoll.',
            decision: '**gRPC via ConnectRPC**',
            gains: [
              'Garantierte Typsicherheit über Systemgrenzen hinweg durch automatisch generierte Protobuf-Schemas.',
              'Direkte, performante gRPC-Kommunikation aus dem Browser ohne zusätzlichen Proxy.',
              'Elegante Middleware-Architektur über gRPC Interceptors (JWT-Authentifizierung, Audit Logging).'
            ],
            costs: [
              'Weniger intuitives Tooling für Testing/Debugging als im REST-Ökosystem.',
              'Protobuf-Kompilierung als zusätzlicher Build-Schritt (Buf) im Frontend-Workflow.'
            ],
            consequences: [],
            alternatives: [
              { option: 'REST / JSON API', rejectedBecause: 'Riesiges Ökosystem und einfach zu testen, bietet jedoch keine native Typsicherheit und erzeugt Overhead durch Text-Serialisierung im Vergleich zu binärem Protobuf.' },
              { option: 'GraphQL', rejectedBecause: 'Sehr flexibel für Clients, bringt jedoch enormen Schema-Overhead, komplexeres Caching und Overengineering bei simplen Service-to-Service-Aufrufen mit sich.' },
              { option: 'Standard gRPC', rejectedBecause: 'Erfordert zwingend einen HTTP-Proxy (z.B. Envoy) zwischen Browser und Backend, was die Deployment-Architektur für dieses Setup unnötig verkompliziert hätte.' },
              {
                option: 'Standard-gRPC mit grafana/dskit',
                rejectedBecause: '`dskit` bietet exzellente Bausteine, deckt jedoch keine direkte Browser-Kommunikation ab. Anfänglich eingesetzt, dann durch ConnectRPC ersetzt.'
              }
            ],
            status: 'final',
            callouts: []
          },
          {
            sectionTitle: 'Architektur: Microservices vs. Hexagonal Modular Monolith',
            title: 'Modularer Monolith-Microservice-Hybrid vs. reine Microservices',
            context: 'Geplant waren rund 15 eigenständige Microservices. Da etwa die Hälfte davon reine CRUD-Dienste waren, hätte eine strikte Service-Trennung zu massivem Netzwerk-Overhead, hoher Distributed-Tracing-Komplexität und aufwendigen Deployments geführt.',
            decision: '**Hybrider Ansatz:** Hexagonaler Modul-Monolith für CRUD, isolierte Microservices für AI-Workloads.',
            gains: [
              'Drastische Reduktion der Deployment- und Wartungskomplexität.',
              'Vereinfachte Datenbank-Joins und Transaction Boundaries für Domänen mit identischem Skalierungsprofil.'
            ],
            consequences: [
              'Dienste mit CPU- und GPU-lastigen Workloads (`recommendation-service`, `llm-tutor-service`) laufen weiterhin komplett isoliert.',
              'Jedes konsolidierte Modul (User, Class, Assignment) ist im Monolithen strikt nach der Hexagonal Architecture aufgebaut.',
              'Die zukünftige Entkopplung in Einzel-Services wurde architektonisch bereits vorbereitet (Design for Replaceability).'
            ],
            alternatives: [
              { option: 'Strikte Verteilung auf 15 Microservices', rejectedBecause: 'Unnötige Netzwerklatenz und zu hohe DevOps-Komplexität ohne sofortigen Business-Nutzen bei der Skalierung.' }
            ],
            status: 'accepted',
            callouts: []
          }
        ];

    const METRICS: MetricItem[] = [
      { label: 'Lernende', value: `~10'000`, detail: 'erwartet nach Go-Live'},
      { label: 'Aufgaben', value: '144', detail: 'In zwei Monaten implementiert' },
      { label: 'Architektur-Effizienz', value: '15 zu 8', detail: 'Microservices konsolidiert' },
      { label: 'Recommendation Latenz', value: 'sub-ms p99', detail: 'Lokale Baseline (M1 16GB RAM)' },
    ];

    const TAGS: string[] = [
      "Softwarearchitektur",
      "Backend & AI Engineering",
      "Datenschutz & Hardening",
    ];

    const studies: CaseStudySummaryData[] = [
      {
        slug: 'lernplattform-mit-ki-tutor',
        href: '/cases/lernplattform-mit-ki-tutor',
        title: 'Lernplattform mit KI-Tutor',
        standfirst: 'Eine Lernplattform, die KI-Tutor nutzt, um Lerninhalte in Echtzeit zu personalisieren.',
        tags: [],
      }
    ]

    type CrudNodeData = { comment?: string };

    const crudTreeNodes: TreeNodeData<CrudNodeData>[] = [
      {
        id: 'crud-service',
        label: 'crud-service/',
        expanded: true,
        children: [
          {
            id: 'cmd',
            label: 'cmd/',
            expanded: true,
            children: [
              {
                id: 'cmd-server',
                label: 'server/',
                expanded: true,
                children: [
                  {
                    id: 'cmd-server-main',
                    label: 'main.go'
                  }
                ]
              }
            ]
          },
          {
            id: 'internal',
            label: 'internal/',
            expanded: true,
            children: [
              {
                id: 'internal-modules',
                label: 'modules/',
                expanded: true,
                children: [
                  {
                    id: 'mod-assignment',
                    label: 'assignment/',
                    expanded: true,
                    data: { comment: 'Exemplarisches Hexagonales Modul' },
                    children: [
                      {
                        id: 'mod-assign-core',
                        label: 'core/',
                        data: { comment: 'Domain Logic & Interfaces (Ports)' },
                        children: [],
                      },
                      {
                        id: 'mod-assign-handlers',
                        label: 'handlers/',
                        data: { comment: 'gRPC / ConnectRPC Handlers (Inbound Adapters)' },
                        children: [],
                      },
                      {
                        id: 'mod-assign-repositories',
                        label: 'repositories/',
                        data: { comment: 'DB-Zugriff / Postgres (Outbound Adapters)' }
                      },
                      {
                        id: 'mod-assign-sql',
                        label: 'sql/',
                        data: { comment: 'sqlc Queries & Schemas' }
                      },
                      {
                        id: 'mod-assign-module',
                        label: 'module.go',
                        data: { comment: 'Modul-Registrierung & Dependency Injection' }
                      }
                    ]
                  },
                  {
                    id: 'mod-class',
                    label: 'class/...',
                    data: { comment: 'Weitere 6 Domänen (currentexercise, history, issue, user...)' }
                  },
                  {
                    id: 'mod-exercise',
                    label: 'exercise/...'
                  },
                  {
                    id: 'mod-user',
                    label: 'user/...'
                  }
                ]
              },
              {
                id: 'internal-shared',
                label: 'shared/',
                expanded: true,
                children: [
                  {
                    id: 'shared-config',
                    label: 'config/'
                  },
                  {
                    id: 'shared-db',
                    label: 'db/migrations/'
                  },
                  {
                    id: 'shared-tests',
                    label: 'tests/',
                    data: { comment: 'Integration & Robustness Tests' }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    let collapsed = $state<boolean>(true);

    let panelOpen = $state(false);

    const phone = isPhone();


    // Desktop: the other case studies live in a panel beside the rail, which

    // `collapsed` shows and hides. A phone has nothing to put a panel beside,

    // so the same content arrives as the spine drawer instead. Reading `phone`

    // in a click handler is behaviour, not appearance — no hydration flash.

    function toggleCases() {

      if (phone.current) panelOpen = true;

      else collapsed = !collapsed;

    }

    $effect.pre(() => {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.style.setProperty('--hue', String(222));
    });

    const roles = [
      {
        category: 'Rollen',
        items: ['Lead Software Architect', 'AI Engineer', '...'],
      }
    ]

    const projectTeam = [
      {
        category: 'Geführt',
        items: ["1 Junior-Entwickler (Frontend)"],
      },
      {
        category: 'Fachlich',
        items: ["5+ Fachdidaktiker", "3 Autoren"],
      },
      {
        category: 'Extern',
        items: ["2+ UX/UI Designer", "1 Illustrator", "1 Typograf"],
      },
      {
        category: 'Intern',
        items: ["1 Projektassistenz", "1 Berater"],
      },
    ];

    const stack = [
      {
        category: 'Frontend',
        items: ['Svelte 5', 'SvelteKit', 'TypeScript'],
      },
      {
        category: 'Backend',
        items: ['Go', 'ConnectRPC', 'Buf'],
      },
      {
        category: 'Data Layer',
        items: ['PostgreSQL', 'Valkey', 'NATS JetStream', 'VictoriaLogs']
      },
      {
        category: 'Platform',
        items: ['Kubernetes', 'vLLM'],
      },
      {
        category: 'DevSecOps',
        items: ["ko", "Cosign", "Trivy", "OSV-Scanner", "Govulncheck", "GoSec", "Nuclei"],
      },
    ];

    const steps: StepItem[] = [
      { id: 'poc', label: 'PoC', detail: 'Ende \'23' },
      { id: 'prototyp', label: 'Prototyp', detail: 'Frühling \'24' },
      { id: 'projektstart', label: 'Projektstart', detail: 'Januar \'25' },
      { id: 'go-live', label: 'Go-Live', detail: 'Sommer \'27' },
    ];

    const bffChain: ChainStep[] = [
      { label: 'Panic Recovery' },
      { label: 'OpenTelemetry Tracing', detail: 'Root Trace Generation' },
      { label: 'Error Sanitizer', detail: 'Maskiert interne Systemfehler nach aussen' },
      { label: 'Context Deadline', detail: 'Max. 30s Hard Timeout' },
      { label: 'JWT Verifier', detail: 'RSA-Signatur & Audience-Validierung' },
      { label: 'BFF Authentication', detail: 'Valkey Token Revocation & Identity Extract' },
      { label: 'FADP Legal Audit', detail: 'Audit Compliance Logging' },
      { label: 'Valkey Rate Limiter', detail: 'Sliding Window pro User' },
      { label: 'Protovalidate Input', detail: 'Strikte Protobuf Schema Validation' },
    ];

    const crudChain: ChainStep[] = [
      { label: 'Panic Recovery', muted: true },
      { label: 'OpenTelemetry Tracing', detail: 'Erbt Parent Trace Context', muted: true },
      { label: 'Error Sanitizer', detail: 'Maskiert SQL-/Datenbankdetails' },
      { label: 'Identity Extractor', detail: 'Liest X-Identity-* Header' },
      { label: 'FADP Legal Audit', detail: 'Audit Trail für Zugriffe auf PII (Personal Data)' },
      { label: 'Context Deadline', detail: 'Bricht langsame DB-Queries ab' },
      { label: 'Cerbos RBAC', detail: 'Feingranularer Policy Decision Point' },
      { label: 'Idempotency Check', detail: 'Replay-Schutz via Idempotency-Key' },
      { label: 'Protovalidate Input', muted: true },
    ];

    const aiChain: ChainStep[] = [
      { label: 'Panic Recovery', muted: true },
      { label: 'OpenTelemetry Tracing', muted: true },
      { label: 'Error Sanitizer', muted: true },
      { label: 'Identity Extractor', muted: true },
      { label: 'FADP Legal Audit', muted: true },
      { label: 'Adaptive Load Shedder', detail: 'Verwirft niedrig priorisierte RPCs bei hoher CPU-Last dynamisch' },
      { label: 'Cerbos RBAC', muted: true },
      { label: 'Extended Context Deadline', detail: 'Angepasst für langlaufendes LLM-Streaming' },
    ];

    const devSecChain: ChainStep[] = [
      {
        label: 'Build & assess',
        detail:
          'ko → distroless/non-root image → OSV-Scanner + govulncheck + GoSec → Trivy image scan',
      },
      {
        label: 'Sign & publish',
        detail:
          'immutable OCI digest → Cosign keyless OIDC signature → registry publication',
      },
      {
        label: 'Promote, enforce & validate',
        detail:
          'GitOps PR pins digest → Kyverno verifies designated GitHub Actions OIDC signer at admission → deployment → Nuclei post-deployment checks',
      },
    ];

    const scoringFactors: ChainStep[] = [
      { label: 'cbkst-fringe', detail: 'Prioritäts-Boost (+100) für Konzepte exakt an der individuellen Wissensgrenze (CbKST).' },
      { label: 'format-proficiency', detail: 'Passt das Outcome an die bisherige Mastery von Eingabe- und Darstellungsformaten an.' },
      { label: 'cdm-difficulty', detail: 'Gewichtet die Aufgabenschwierigkeit mit der Cognitive-Diagnosis-Model-Wahrscheinlichkeit.' },
      { label: 'track-record', detail: 'Berücksichtigt den Leistungsdurchschnitt der aktuellen Lern-Session.' },
      { label: 'anti-monotony', detail: 'Malus (−25) bei direkt aufeinanderfolgenden, identischen Aufgabentypen.' },
      { label: 'confidence-booster', detail: 'Boost (+200) auf bereits gemasterte Konzepte nach 3 Misserfolgen, um Frustration vorzubeugen.' },
      { label: 'time-box', detail: 'Priorisiert Aufgaben, die in die Restzeit der Session passen (−100 bei drohender Overtime).' },
      { label: 'prerequisite-decay', detail: 'Malus (−50), wenn die BKT-Wahrscheinlichkeit von Grundlagen/Voraussetzungen unter 0.5 fällt.' },
      { label: 'session-coherence', detail: 'Bonus (+15) für den fokussierten Verbleib auf dem aktiven Fringe-Konzept.' },
      { label: 'recency', detail: 'Vergessens-Malus (bis −40), der über ein 7-Tage-Fenster linear abklingt.' },
      { label: 'graph-edge', detail: 'Erlerntes State-to-Exercise-Übergangsgewicht überschreibt Vorhersagen ab 3 Beobachtungen.' },
      { label: 'exploration', detail: 'UCB-Bonus für bisher vom System wenig explorierte State-Exercise-Paare (Vermeidung von Filterblasen).' },
      { label: 'band-activation', detail: 'Dreiecks-Aktivierungsbonus (+30) rund um die Ziel-Bucket-Zentren.' },
    ];
</script>

{#snippet rail()}
  <Wordmark text="Portfolio" />
  <SealButton onclick={toggleCases} aria-label="Weitere Fallstudien">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
  </SealButton>
{/snippet}

{#snippet spineChildren()}
  <CaseStudyIndex {studies} />
{/snippet}

{#snippet meta()}
  <StackManifest groups={roles} />
  <Section id="project-team" title="Projektteam" unlisted level={4}>
    <StackManifest groups={projectTeam} />
  </Section>
  <Stepper steps={steps} completedIds={['poc', 'prototyp']} activeId="projektstart" />
{/snippet}

<Shell wordmark="Portfolio" showControls={false} {spineChildren} {collapsed} {rail} bind:panelOpen>
	<CaseStudyShell lang="de" title="Architektur einer hochperformanten KI-Lernplattform" metrics={METRICS} tags={TAGS} {meta} subtitle="Eine Fallstudie: Von probabilistischer Lernstandanalyse (BKT) zu Sub-Millisekunden-Recommendations." tocTitle="Übersicht">
	<FormattedText block text={`Dieses Projekt begann als sechswöchiger Proof of Concept (PoC) in Zusammenarbeit mit einer KI-Agentur, um einen LLM-basierten Tutor für das Fachgebiet Mathematik ("Folgen und Reihen") zu evaluieren. Der durchschlagende Erfolg dieses PoCs – und der anschliessenden Prototyping-Phase, die bei Feldtests mit Schulklassen sowohl Lernende als auch Lehrpersonen überzeugte – führte zur Entscheidung, eine vollständige Lernplattform für voraussichtlich über 10'000 Lernende inklusive physischem Hauptlehrmittel zu entwickeln.

	**Die Herausforderung: Budget-Restriktionen & Pragmatische Architektur**
	Um aufwendige öffentliche Ausschreibungsverfahren (Regulierungen bei Kosten > 150'000 CHF für einzelne Anbieter) zu vermeiden, war eine maximale Konsolidierung der technischen Verantwortung zwingend erforderlich. Dies erforderte "Extreme Ownership" über den gesamten Software-Lebenszyklus. Erschwerend kam hinzu, dass "Microservices auf Kubernetes" als strategische Vorgabe des Managements gesetzt waren. Um diesen operationalen Overhead als Solo-Backend-Dev dennoch effizient und handhabbar zu gestalten, interpretierte ich diese Vorgaben stark pragmatisch – beispielsweise durch die architektonische Konsolidierung von Standard-CRUD-Operationen, während hochspezialisierte KI- und Analyse-Module als isolierte, flexibel skalierbare Services ausgelegt wurden.

	**Mein Verantwortungsbereich (Leadership & Execution):**

	- **Systemarchitektur:** Entwurf einer pragmatischen, ausfallsicheren Cloud-Native Service-Architektur. Als ein anhaltender Ausfall des K8s-Testclusters das Projekt zu blockieren drohte, entkoppelte ich das Frontend architektonisch vollständig und setzte proaktiv ein dediziertes VPS-Hosting auf. Dies stellte sicher, dass das didaktische Team ohne Unterbruch Aufgaben entwickeln und testen konnte.
	* **Backend & AI Engineering:** Solo-Entwicklung sämtlicher Backend-Services (inklusive Auth & Database-Design) sowie Evaluation und sichere Anbindung von Large Language Models unter strikten Datenschutzvorgaben (PII-Handling).
	* **Frontend & Skalierung:** Aufbau der Svelte-Architektur und intensives Mentoring eines Junior-Entwicklers. Dank des hochgradig modularen Ansatzes konnten über 140 komplexe, dynamisch visualisierte Aufgaben innerhalb von nur zwei Monaten umgesetzt werden (Logik & Funktionalität durch mich, UI/UX durch Junior-Entwickler).
	* **Domänenlogik:** Konzeption der kognitiven Modelle (CbKST-Skill Maps) für den didaktischen Kompetenzaufbau und Konzepte für die Lernplattform und das Lehrmittel.

	In dieser Rolle fungierte ich als Lead Software Architect und Full-Stack-Entwickler, bildete aber vor allem die entscheidende technische Schnittstelle, die didaktische Anforderungen, Infrastruktur-Vorgaben und Budget-Realitäten erfolgreich in Einklang brachte.`} />

	<Section id={`lpfOverview`} number={String(1).padStart(2, '0')} title={"Tech-Stack"}  >
	<StackManifest groups={stack}  />
	</Section>
	<Section id={`lpfDecisions`} number={String(2).padStart(2, '0')} title={"Architecture Records / Decisions"} >
	{#each decisionRecordProps as props, index (index)}
	<Section id={`lpf${index}-record`} number={`02.0${index + 1}`} title={props.sectionTitle} level={3}>
		<DecisionRecord id={`lpf${index}-record`} title={props.title} context={props.context} decision={props.decision} consequences={props.consequences} gains={props.gains} costs={props.costs} alternatives={props.alternatives} status={props.status} />
		{#each props.callouts as callout}
		<Callout label={callout.label} tone={callout.tone} >

		<FormattedText text={callout.text} />
		</Callout>
		{/each}
		{#if props.title===decisionRecordProps[3].title}
		{#snippet crudNodeSnippet(node: TreeNodeData<CrudNodeData>)}
			{@const isFolder = node.isFolder ?? (node.children !== undefined || node.label.endsWith('/') || node.label.endsWith('/...'))}
			{@const isOpen = isFolder && Boolean(node.expanded)}
			{@const isGoMod = node.label === 'go.mod' || node.label.endsWith('.mod')}
			{@const isGo = node.label.endsWith('.go')}
			<span class="node-icon">
				{#if node.icon}
					{node.icon}
				{:else if isGoMod}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
						<path fill="none" stroke="#85c1dc" stroke-linecap="round" stroke-linejoin="round" d="m2.5 8.51-2 .01m1.5 2h1.5m-2-4h1m6.73-2.19a1.5 1.5 0 10-2.16.58m2.16-.58 2.78-.74.75 2.78m.57 2.16.75 2.79-7.73 2.07-2.07-7.73 2.78-.75m6.28 3.63a1.5 1.5 0 10-.58-2.17" />
					</svg>
				{:else if isGo}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
						<path fill="none" stroke="#85c1dc" stroke-linecap="round" stroke-linejoin="round" d="m15.48 8.06-4.85.48m4.85-.48a4.98 4.98 0 01-4.54 5.42 5 5 0 112.95-8.66l-1.7 1.84a2.5 2.5 0 00-4.18 2.06c.05.57.3 1.1.69 1.51.25.27 1 .83 1.78.82.8-.02 1.58-.25 2.07-.81 0 0 .8-.96.68-1.88M2.5 8.5l-2 .01m1.5 2h1.5m-2-3.99 2-.02" />
					</svg>
				{:else if isFolder}
					{#if isOpen}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
							<path fill="none" stroke="#c6d0f5" stroke-linecap="round" stroke-linejoin="round" d="m1.87 8 .7-2.74a1 1 0 01.96-.76h10.94a1 1 0 01.97 1.24l-1.75 7a1 1 0 01-.97.76H2A1.5 1.5 0 01.5 12V3.5a1 1 0 011-1h5a1 1 0 011 1v1" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
							<path fill="none" stroke="#c6d0f5" stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5H12c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H2A1.5 1.5 0 01.5 12V3.5a1 1 0 011-1h5a1 1 0 011 1v1" />
						</svg>
					{/if}
				{:else}
					📄
				{/if}
			</span>
			<span class="node-label">{node.label}</span>
			{#if node.data?.comment}
				<span class="node-comment"># {node.data.comment}</span>
			{/if}
		{/snippet}

		<div class="crud-tree-container">
			<div class="crud-tree-title">Struktur der CRUD-Service-Module (Modul-Monolith)</div>
			<TreeView nodes={crudTreeNodes} nodeSnippet={crudNodeSnippet} ontoggle={(node) => { node.expanded = !node.expanded; }} />
		</div>
		{/if}
	</Section>
	{/each}
		</Section>
		<Section id={`lpfDeepDive`} number={String(3).padStart(2, '0')} title={"Deep Dives"} >
			<DeepDive
				id="lpfDeepDive1"
				title="Mehrkriterielle Recommendation Engine"
				eyebrow="Algorithmen & Performance"
				level={3}
				sectionNumber={3}
				diveNumber={1}
				summary="Wahl der optimalen Lernaufgabe in Echtzeit über eine 13-Faktoren-Pipeline mit automatischer Bucketing-Strategie und p99-Latenzen unter 1 ms."
			>
				<FormattedText block text={`Das Herzstück der Lernplattform ist der \`recommendation-service\`. Statt einer starren Empfehlung liefert die Engine für ein gewähltes Thema (oder themenübergreifend via Spaced Repetition) stets **drei nach Schwierigkeit gestaffelte Optionen**, um den Lernenden Selbstwirksamkeit und Wahlfreiheit zu ermöglichen:`} />

				<Section id="lpfRecBucketing" title="1. Bucketing-Strategie & Explainability" level={4}>
					<FormattedText block text={`Jedes Candidate-Exercise wird auf einer Skala von 0.0 bis 5.0 in eines von drei Ziel-Buckets eingestuft. Lücken dienen als Pufferzone (\`closest-fallback\` füllt unbesetzte Buckets auf):

* **Challenge (1.0 – 2.0)**: Anspruchsvolle Aufgabe zur gezielten Überwindung von Hürden.
* **Goldilocks Zone (3.0 – 4.0)**: Die optimale Lernzone (Erfolg mit minimaler Unterstützung).
* **Easier (4.0+)**: Leichtes Review oder gezielter Aufbau von Selbstvertrauen.

Die Einteilung in diese Buckets erfolgt gemäss Aufgabenausgang (nicht nur richtig/falsch, sondern mehrstufig) und ist selbstlernend.

Jede Empfehlung enthält eine **Explainability-Trace**, welche die mathematische Zusammensetzung der Faktoren für Entwickler, Pädagogen und Audits transparent und nachvollziehbar macht.`} />
				</Section>

				<Section id="lpfRecPipeline" title="2. Die 13-Faktoren Scoring-Pipeline" level={4}>
					<FormattedText block text={`Kandidaten durchlaufen sequentiell eine Pipeline aus 13 gewichteten Heuristiken und probabilistischen Modellen (\`LearningBenefit\` & \`PredictedOutcome\`). Frühe Stufen der Pipeline setzen die pädagogische Priorität, während spätere Stufen dynamisch gegen Langeweile, Vergessen und Explorationsdefizite korrigieren.`} />

					<Disclosure
						id="lpfRecFactors"
						label="Alle 13 Faktoren und Gewichtungen im Detail"
						count={13}
						hint="Reihenfolge entspricht der Ausführung in der Pipeline."
					>
						<Chain title="scoring pipeline" steps={scoringFactors} />
					</Disclosure>
				</Section>

				<Section id="lpfRecPerformance" title="3. Performance & Parallelisierungs-Benchmarks" level={4}>
					<FormattedText block text={`Um Echtzeit-Feedback ohne spürbare UI-Verzögerungen zu gewährleisten, ist der Dienst architektonisch auf maximale CPU-Effizienz und parallelen I/O ausgelegt:

* **Pure CPU Scoring (100 Aufgaben, i.d.R. zwischen 40 und 60 Aufgaben pro Thema)**: p50 bei ~0.15 ms – 0.30 ms | p99 < 1.0 ms (> 5.000 Req/s pro CPU-Core).
* **Entkoppelte I/O Stage-Pipeline**: Externe Aufrufe (\`crud-service\`, \`cdm-service\`, \`learning-diagnosis-service\`) werden intelligent in zwei parallelen Stufen ausgeführt (Stage 1: User-State & Session; Stage 2: Kandidaten-Details & CbKST Maps).
* **Gesamtlatenz (E2E)**: In-Cluster LAN ~1.2 ms – 1.5 ms (inklusive gRPC Round-Trip-Time).

*Hinweis zur Testumgebung: Gemessen auf lokaler Entwickler-Hardware (Apple M1, 16GB RAM). Da Go nativ nach ARM64 kompiliert und der Go-Runtime-Scheduler extrem effizient skaliert, liefert dies eine beeindruckende Baseline für Single-Thread/Local Performance. Synthetische Multi-Node Load-Tests auf K8s-Linux-Clustern folgen in der Pre-Go-Live-Phase.*`} />
				</Section>
			</DeepDive>
			<DeepDive
				id="lpfDeepDive2"
				title="Probabilistische Lernstand-Analyse (BKT & CbKST)"
				eyebrow="Pedagogical Domain Engine"
				level={3}
				sectionNumber={3}
				diveNumber={2}
				summary="Echtzeit-Schätzung des individuellen Wissensstands mittels Bayesian Knowledge Tracing und Competence-based Knowledge Space Theory."
			>
				<FormattedText block text={`Der \`learning-diagnosis-service\` modelliert den sich kontinuierlich verändernden Wissensstand von Lernenden über den gesamten Lehrplan. Er beantwortet in Echtzeit zwei zentrale fachliche Fragen: *(1) Was ist gemastert und was ist als Nächstes lernbereit (Fringe)?* und *(2) Wie hoch ist die mathematische Konfidenz unter Berücksichtigung von Vergessen und vergangenen Übungsergebnissen?*`} />

				<Section id="lpfDiagAlgorithms" title="1. CbKST & Bayesian Knowledge Tracing" level={4}>
					<FormattedText block text={`Der Dienst kombiniert performant zwei etablierte mathematische Modelle der Kognitionswissenschaft:

* **Surmise Systems & DNF-Voraussetzungen**: Kompetenz-Abhängigkeiten werden als Disjunktive Normalform (DNF) modelliert. Statt eines unhandlichen $2^N$ Zustandsraums evaluiert das System zur Laufzeit nur die tatsächlichen *Feasible Knowledge States*.
* **Dual Estimator Engine**:
  * **Joint Estimator (Exakte Bayes-Inferenz)**: Wird bei ≤ 1000 zulässigen Zuständen genutzt und führt exakte Vektor-Updates durch.
  * **Marginal Estimator (Fallback)**: Dient als speichereffizienter Fallback bei riesigen, stark vernetzten Wissensräumen.
* **BKT & Hystereseband**: Bayesianische Updates über 6 Evidenz-Stufen (\`Failed\` bis \`SucceededFast\`). Ein Hystereseband ($P(\\text{Mastery}) \\ge 0.85$ für Vergabe, $P(\\text{Mastery}) \\le 0.75$ für Revokation) verhindert sprunghafte Änderungen in der Benutzeroberfläche (UI-Flackern).`} />
				</Section>

				<Section id="lpfDiagDecayFairness" title="2. Vergessenskurve, Nachteilsausgleich & Audit-Trail" level={4}>
					<FormattedText block text={`- **Zeitlicher Vergessenszerfall (Temporal Decay)**: BKT-Wahrscheinlichkeiten verfallen exponentiell basierend auf Halbwertszeiten ($T_{1/2}$). Um Ressourcen zu sparen, erfolgt die Berechnung hochperformant **on-read** anstatt über asynchrone Hintergrund-Batchjobs.
- **Nachteilsausgleich via Accommodation Flags**: Für Lernende mit Nachteilsausgleich oder Sprachbarrieren werden definierte Evidenz-Stufen (\`SucceededSlow\` & \`SucceededFast\`) zusammengeführt, um eine systemische Benachteiligung durch reine Reaktionszeiten zu vermeiden.
- **Audit-Trail für System-Transparenz**: Lückenlose Speicherung von Vorher-/Nachher-Deltas (\`marginal_before\` $\\to$ \`marginal_after\`) für FADP-konforme Erklärbarkeit gegenüber Auditoren und Lehrpersonen.`} />
				</Section>

				<Section id="lpfDiagPerformance" title="3. Sub-Millisekunden-Performance & Outbox Pattern" level={4}>
					<FormattedText block text={`* **Sub-Millisekunden CPU-Inferenz**: Durch vorberechnete Bitmasken (\`stateMask\`) erfolgen die Bayes-Updates via ultraschnellen Bitwise-Operationen. Ein Update für ein Set aus 20 bis 50 Kompetenzen benötigt lediglich **0.05 bis 0.2 ms** CPU-Zeit.
- **Transactional Outbox**: Logische Status-Änderungen (\`MasteryGranted\`, \`MasteryRevoked\`) werden in exakt derselben PostgreSQL-Transaktion wie das Update in eine In-Database-Outbox geschrieben – das System garantiert so atomare Konsistenz ohne teure, verteilte 2PC-Sperren.`} />
				</Section>
			</DeepDive>
			<DeepDive
			 level={3}
				sectionNumber={3}
				diveNumber={3}
				id="lpfDeepDive3"
				title="Entkoppelte Cross-Cutting Concerns via gRPC Interceptors"
				eyebrow="Architektur & Security"
				summary="Einheitliche Durchsetzung von Security, OpenTelemetry Tracing, Auditierbarkeit und Adaptive Load Shedding über dedizierte Middleware-Chains."
			>
				<FormattedText block text={`Um komplexe Geschäftslogik strikt von infrastrukturellen Aufgaben zu trennen, wird sämtlicher Cross-Cutting Code elegant in **ConnectRPC / gRPC Interceptors** gebündelt. Sämtliche Requests passieren je nach Endpunkt eine von vier zentral definierten Interceptor-Ketten:`} />

				<Section id="lpfInterceptorsBFF" title="1. Edge Gateway Chain (BFF)" level={4}>
					<FormattedText block text={`Der öffentliche Eintrittspunkt für sämtliche Anfragen aus dem Browser. Erzwingt Authentifizierung, Rate Limiting und Legal Audits vor der Weiterleitung an interne Microservices. Die drei folgenden Ketten leiten sich hiervon ab — hervorgehoben ist jeweils nur der spezifische Unterschied.`} />
					<Chain
						title="BFF Server Execution Order"
						entry="Client Request"
						exit="Interner Microservice"
						steps={bffChain}
					/>
				</Section>

				<Section id="lpfInterceptorsCRUD" title="2. CRUD Service Chain" level={4}>
					<FormattedText block text={`Wird gezielt von Persistenz-Diensten genutzt. Übernimmt die Autorisierung via Cerbos RBAC, führt Idempotenz-Prüfungen durch und implementiert Schutzmechanismen für die Datenbank.`} />
					<Disclosure id="lpfCrudChain" label="Ausführungsreihenfolge (CRUD)" count="9 Stufen">
						<Chain title="CRUD Server Execution Order" entry="Inbound RPC" exit="Handler" steps={crudChain} />
					</Disclosure>
				</Section>

				<Section id="lpfInterceptorsAI" title="3. AI & Analytics Service Chain" level={4}>
					<FormattedText block text={`Speziell optimiert für rechenintensive Dienste (\`recommendation-service\`, \`llm-tutor-service\`). Schützt das Gesamtsystem proaktiv vor Überlastung durch dynamisches, priorisiertes Verwerfen von Requests (Adaptive Load Shedding).`} />
					<Disclosure id="lpfAiChain" label="Ausführungsreihenfolge (AI)" count="8 Stufen">
						<Chain title="AI Server Execution Order" entry="Inbound RPC" exit="Handler" steps={aiChain} />
					</Disclosure>
				</Section>

				<Section id="lpfInterceptorsClient" title="4. Outbound Client & Mesh Architecture" level={4}>
					<FormattedText block text={`Bei der internen Service-zu-Service Kommunikation injiziert die **Client Chain** völlig transparent Tracing-Kontexte und Identitäts-Header (\`X-Identity-User-Id\`, \`X-Identity-Role\`) in ausgehende Calls.

Ergänzt wird diese robuste Pipeline durch das **Linkerd Service Mesh** (mTLS, Circuit Breaking & Automatic Retries) sowie **VictoriaLogs** als extrem speichereffizienter Append-Only Stream für LLM- & Audit-Logs.`} />
				</Section>
			</DeepDive>
			<DeepDive
				id="lpfVerifiablePromotion"
				title="Verifizierbare Artefakt-Promotion statt vertrauensbasierter Deployments"
				eyebrow="Technisches Hardening"
				level={3}
				sectionNumber={3}
				diveNumber={4}
				summary="Jeder Release durchläuft automatisierte Security-Scans, keyless OIDC-Signierung und GitOps-Promotion als unveränderlicher Image-Digest; Deployments sind damit lückenlos verifizierbar statt tag-basiert und manuell."
			>
				<FormattedText block text={`Um vertrauensbasierte Deployments und veraltete oder manipulierte Container-Tags (z. B. \`:latest\` oder manuelles \`:v1.2.3\`) in Produktion vollständig auszuschliessen, setzt die Plattform auf eine strikte, kryptographisch verifizierbare DevSecOps-Supply-Chain.`} />

				<Section id="lpfDevSecBuildScan" title="1. Shift-Left Security & Distroless Builds (ko & Scanner-Suite)" level={4}>
					<FormattedText block text={`* **Go-native Distroless Builds (\`ko\`)**: Container-Images werden ohne Dockerfile-Overhead und ohne Docker Daemon direkt aus dem Go-Code als extrem kleine, gehärtete **Non-Root / Distroless** Images gebaut. Dies minimiert die Angriffsfläche im Cluster drastisch.
* **Mehrstufige Statische Code- & Vulnerability-Analyse**: Bevor ein Image signiert wird, durchläuft die Pipeline automatisiert:
  * **\`GoSec\`**: Statische Code-Analyse (SAST) auf Sicherheitsschwachstellen im Go-Quellcode.
  * **\`govulncheck\`**: Offizielle Go-Schwachstellen-Analyse gegen die Go Vulnerability Database.
  * **\`OSV-Scanner\` & \`Trivy\`**: Überprüfung sämtlicher Abhängigkeiten und OCI-Layer auf bekannte CVEs.`} />
				</Section>

				<Section id="lpfDevSecKeylessKyverno" title="2. Keyless Signierung & Admission Control (Sigstore/Cosign + Kyverno)" level={4}>
					<FormattedText block text={`Container-Images werden unmittelbar nach dem erfolgreichen Build über **Sigstore/Cosign** mittels kurzlebiger OIDC-Identität (via GitHub Actions Workload Identity Federation) signiert. Dadurch entfällt das Risiko langlebiger, manueller Signing-Keys in Secrets.

**Kyverno Admission Control** erzwingt beim Kubernetes Ingress / Cluster Admission Control die Verifikation dieser Signatur:
* Nur überprüfbare Artefakte gelangen in den Cluster.
* Die Kyverno-Policy akzeptiert ausschliesslich Images aus freigegebenen Registries mit gültiger Cosign-Signatur und immutable Digest-Referenz (\`@sha256:...\`).`} />
				</Section>

				<Section id="lpfDevSecGitOpsDAST" title="3. GitOps Digest Promotion & Post-Deployment DAST (ArgoCD + Nuclei)" level={4}>
					<FormattedText block text={`* **GitOps Promotion**: Releases werden über automatisierte Pull Requests in den GitOps-Repositories aktualisiert. Dabei werden nie veränderliche Tags, sondern ausschliesslich der exakte, unmanipulierbare **OCI Digest** (\`@sha256:...\`) gepinnt.
* **Automatisierte DAST-Scans (\`Nuclei\`)**: Nach der erfolgreichen K8s-Deployment-Promovierung führt \`Nuclei\` dynamische Sicherheitstests durch (u. a. TLS-Konfigurationen, HTTP Security Headers, Ingress-Schwachstellen), um die Laufzeit-Sicherheit in Produktion kontinuierlich zu bestätigen.`} />

					<Chain
						title="DevSecOps & Supply Chain Pipeline"
						entry="Git Push / Commit"
						exit="K8s Production Cluster"
						steps={devSecChain}
					/>
				</Section>
			</DeepDive>
		</Section>
		<Section id={`lpfOutcome`} number={String(4).padStart(2, '0')} title={"Business Outcome & Ausblick"} >
			<FormattedText block text={`Da das Projekt kurz vor dem Go-Live steht und die Algorithmen für die Lernstandanalyse und die Recommendation-Engine in der Praxis noch final feinjustiert werden, liegt der Fokus aktuell auf den vielversprechenden Vorab-Metriken (System-Performance und Entwicklungsgeschwindigkeit).

			Ich erwarte durch die personalisierten Lernwege ein stark erhöhtes Engagement der Lernenden, was sich messbar in besseren Leistungen und einem robusteren Kompetenzaufbau im Fach Mathematik niederschlagen wird. Durch die tiefgehende Lernstandanalyse erhalten Lehrpersonen zudem einen datengetriebenen, aber intuitiv verständlichen Einblick in die individuellen Fähigkeiten ihrer Klassen, wodurch sich der Präsenzunterricht deutlich zielgerichteter steuern lässt.

			**Meine langfristige Vision** als ehemalige Lehrperson ist es, dass durch kontinuierliches, präzises Knowledge Tracing mittelfristig komplett auf punktuelle, oft nicht-repräsentative Prüfungen verzichtet werden kann – zugunsten einer fortlaufenden, stressfreien Kompetenzmessung.`} />
		</Section>

		<Divider />

		<Section id={`lpfRetro`} title="Lessons Learned & Next Steps" number={String(5).padStart(2, '0')}>
  			<FormattedText block text={`Da sich das Projekt in der aktiven Weiterentwicklung befindet und die Architektur iterativ anpassbar ist, rückt die klassische "Was hätte ich anders gemacht"-Frage in den Hintergrund. Viel relevanter ist die Frage der Skalierung nach dem Go-Live: Wie entwickeln wir das System von einem initialen Prototypen zu einer autonomen Plattform weiter?`} />

		<Callout label="Vom LLM-Wrapper zum Data Flywheel" tone="success">
		  <FormattedText text={`Aktuell verlässt sich die Plattform auf hochperformante, aber generalistische API-basierte Large Language Models. Mein mittelfristiges Architektur-Ziel ist es, den **Datenschatz der Lerninteraktionen (Data Flywheel)** nach dem Go-Live systematisch zu nutzen.

		  Statt ein neues Diffusions-Sprachmodell von Grund auf neu zu trainieren (was enorme Compute-Ressourcen binden würde), liegt der Fokus auf **Domain-Specific Fine-Tuning (z.B. via LoRA)**. Indem wir kleinere, lokale Open-Weights-Modelle (SLMs) auf die verifizierten, pädagogisch wertvollen Interaktionen unserer Fachdidaktiker und Lernenden finetunen, erreichen wir drei Ziele gleichzeitig:
		  * **Massive Reduktion der Latenz (Inference Speed)** für echte Echtzeit-Interaktionen.
		  * **Volle Datenhoheit (Privacy/Ethik)**, da keine PII-Daten mehr an externe LLM-Provider fliessen.
		  * **Kostenkontrolle**, da wir nicht für Milliarden unnötiger Parameter zahlen.`} />
		</Callout>

		<Callout label="Pragmatismus als Solo-Developer" tone="info">
		  <FormattedText text={`Die grösste nicht-technische Herausforderung war es, als Solo-Backend-Developer die "weichen" pädagogischen und visuellen Konzepte der Fachexperten und Designer in deterministische Mathematik (Bayesian Knowledge Tracing) und stabile Systemarchitekturen zu übersetzen.

		  Die wichtigste Lektion hierbei: **Jede technologische Abstraktion muss ihre Existenz rechtfertigen.** Die Entscheidung, auf komplexe verteilte Caching-Strategien oder Event-Sourcing zu verzichten und stattdessen die PostgreSQL-Fähigkeiten voll auszureizen, war überlebenswichtig. Architekturfehler macht man nicht beim Coden, sondern wenn man vergisst, wer das System nachts warten muss.`} />
		</Callout>
		</Section>

	</CaseStudyShell>
</Shell>

<style>

  .crud-tree-container {
      margin-top: 16px;
      border: 1px solid var(--line-mid);
      border-radius: var(--radius-s);
      background: var(--raised);
      overflow: hidden;
  }

  .crud-tree-title {
      padding: 8px 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-2);
      background: var(--wash);
      border-bottom: 1px solid var(--line-mid);
  }

  .crud-tree-container :global(.tree-view.root) {
      border: none;
      border-radius: 0;
      background: transparent;
  }

  :global(.node-comment) {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-3);
      margin-left: 8px;
      opacity: 0.85;
  }

  :global(.node-icon) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
  }
</style>
