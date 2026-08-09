<script lang="ts">
    import Divider from "$lib/atoms/Divider.svelte";
    import FormattedText from "$lib/atoms/FormattedText.svelte";
import type { CaseStudySummaryData, DecisionStatus, MetricItem, RejectedAlternative } from "$lib/domain.js";
    import Callout from "$lib/molecules/Callout.svelte";
    import StackManifest from "$lib/molecules/StackManifest.svelte";
    import CodeBlock from "$lib/organisms/CodeBlock.svelte";
    import DecisionRecord from "$lib/organisms/DecisionRecord.svelte";
    import DeepDive from "$lib/organisms/DeepDive.svelte";
    import Section from "$lib/organisms/Section.svelte";
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
        context: 'Da das System neu aufgebaut wurde, war die Wahl der Sprache ein zentraler Baustein für Wartbarkeit und Performanz. Frühere Erfahrungen lagen vor allem bei TypeScript und Ruby. Für hochkonkurrente Microservices und Echtzeit-Auswertung fehlte hier jedoch die nötige Performanz, weshalb performantere Backend-Sprachen evaluiert wurden.',
        decision: 'Entscheidung für **Go**, aufgrund der Entwicklungsgeschwindigkeit, des Cloud-Native-Ursprungs und der Concurrency-Features.',
        consequences: [
          'Minimale Server-Ressourcen und winzige Container-Images (Distroless Builds via ko).',
          'Garbage Collection-Pausen'
        ],
        alternatives: [
          { option: 'Rust', rejectedBecause: 'Bietet zwar maximale Performanz und striktere Typensicherheit, wies aber eine höhere Komplexität in der Entwicklung (DX) und ein damals für Web-Services weniger ausgereiftes Ökosystem auf. Der rohe Performanzvorsprung zu Go war für dieses Projekt vernachlässigbar.' },
          { option: 'V', rejectedBecause: 'Sprachkonzept vielversprechend ("neues C"), in der Praxis jedoch noch nicht produktionsreif, unbeständiges Ökosystem und nicht-belegbare Tooling-Behauptungen.' },
          { option: 'Swift', rejectedBecause: 'Exzellente Sprache, jedoch im Linux/Server-Umfeld mit kleinerer Community und weniger ausgereiften Cloud-Native/Microservice-Bibliotheken als Go.' },
        ],
        status: 'final',
        callouts: []
      },
      {
        sectionTitle: 'Datenbank-Technologien',
        title: 'PostgreSQL vs. Polyglot',
        context: 'Ursprünglich war ein Polyglot-Persistence-Ansatz geplant (Graph-Datenbank wie Neo4j oder NebulaGraph für Lernstände, Time-Series-DB wie TimescaleDB oder InfluxDB für Metriken, PostgreSQL für relationalen Content). Als Solo-Backend-Entwickler führt eine solche Komplexität jedoch zu extrem hohem operationalen Overhead (Backup-Strategien, Schema-Synchronisation, Monitoring, ...)',
        decision: 'Reduktion auf **PostgreSQL**, statt verschiedener Datenbank-Technologien.',
        consequences: [
          'Wegfallen von zusätzlicher operationaler Komplexität.',
          'Nutzen nativer Postgres-Features und somit genügend Performanz für alle aktuellen Workloads.',
          'JSONB/LTREE sind Workarounds, jedoch für die aktuelle Datenstruktur nicht relevant.',
          'Definitive Validierung und Entscheidung erfolgt nach Load-Testing.'
        ],
        alternatives: [
          { option: 'Polyglot Persistence (Multi-DB)', rejectedBecause: 'Der operative Aufwand für Wartung und Datensynchronisation stand in keinem Verhältnis zum tatsächlichen Nutzen in der aktuellen Projektphase.' }
        ],
        status: 'accepted',
        callouts: []
      },
      {
        sectionTitle: 'Inter-Service-Kommunikation',
        title: 'REST vs. GraphQL vs. gRPC',
        context: 'Die Kommunikation zwischen dem SvelteKit-Frontend und den Microservices sowie den Services untereinander benötigte ein striktes, performantes und typsicheres Protokoll.',
        decision: '**gRPC via ConnectRPC**.',
        gains: [
          'Garantierte Typsicherheit über Systemgrenzen hinweg durch automatisch generierten Protobuf.',
          'Direkte gRPC-Kommunikation aus dem Browser ohne zusätzlichen Proxy.',
          'Middleware-Architektur über gRPC Interceptors (JWT-Authentifizierung, Audit Logging).'
        ],
        costs: [
          'Weniger Tooling für Testing als im REST-Ökosystem.',
          'Protobuf-Schemas als zusätzlicher Build-Schritt (Buf) im Frontend-Workflow.'
        ],
        consequences: [

        ],
        alternatives: [
          { option: 'REST / JSON API', rejectedBecause: 'Hohe Testbarkeit und riesiges Ökosystem, aber keine native Typsicherheit und spürbarer Overhead durch Text-Serialisierung im Vergleich zu Protobuf.' },
          { option: 'GraphQL', rejectedBecause: 'Flexibel für komplexe Client-Queries, bringt jedoch enormen Schema-Overhead, schlechteres Caching und Komplexität bei einfachen Service-to-Service-Calls mit sich.' },
          { option: 'Standard gRPC', rejectedBecause: 'Erfordert zwingend einen HTTP-Proxy (z.B. Envoy) zwischen Browser und Backend, was die Deployment-Architektur unnötig verkompliziert hätte.' },
          {
            option: 'Standard-gRPC mit grafana/dskit',
            rejectedBecause: '`dskit` bietet exzellente Bausteine für Service-Lifecycle und RPC-Middleware, deckt jedoch keine Browser-Kommunikation ab. Anfänglich eingesetzt, dann durch ConnectRPC ersetzt; gRPC-Web-Support ohne Envoy-Proxy und idiomatische TS-Client-Generierung für SvelteKit vereinfachten Architektur und DX erheblich. Viele Features von `dskit` sind für dieses Projekt nicht relevant.'
          }
        ],
        status: 'final',
        callouts: []
      },
      {
        sectionTitle: 'Reine Microservice-Architektur vs. Hexagonal Modular Monolith',
        title: 'Hexagonal Modul-Monolith vs. reine Microservices',
        context: 'Geplant waren ca. 15 eigenständige Microservices. Rund die Hälfte davon waren reine CRUD-Dienste. Eine strikte Service-Trennung bei CRUD-Domänen hätte zu massivem Netzwerk-Overhead, Distributed-Tracing-Komplexität und aufwendigem Deployment geführt.',
        decision: `Statt starr 15 Microservices zu betreiben oder einen riesigen Monolithen zu bauen, wurden die Services nach Skalierungsmuster und Latenzprofil gruppiert:

        **Dienste mit identischem Skalierungsprofil (CRUD)** wurden im crud-service als hexagonal strukturierter Modul-Monolith konsolidiert (gemeinsame DB-Verbindung, 0 Netzwerklatenz zwischen CRUD-Domänen, einfache Transaction Boundaries).
        **Dienste mit abweichendem Ressourcenprofil (AI / Analytics)** wie recommendation-service oder llm-tutor-service laufen als echte, isolierte Microservices, um CPU-/GPU-Heavy Workloads unabhängig zu skalieren und abzufedern.`,
        consequences: [
          'Reduktion der Komplexität während des Deployments und der Wartbarkeit.',
          'Reduktion von Latenzen und vereinfachte Datenbank-Joins.',
          'Jedes Modul (User, Class, Assignment etc.) ist strikt nach Hexagonal Architecture aufgebaut.',
          'Finale Entscheidung erst nach Load-Testing und Performance-Monitoring final bzw. revidiert.',
          'Entkoppeln musste bereits vorgedacht und konzipiert werden.'
        ],
        alternatives: [
          { option: 'Strikte Verteilung auf 15 Microservices', rejectedBecause: 'Unnötige Netzwerklatenz und hohe Deployment-Komplexität ohne sofortigen Nutzen bei der Skalierung.' }
        ],
        status: 'accepted',
        callouts: [

        ]
      }
    ];

    const METRICS: MetricItem[] = [
      { label: 'Lernende', value: `~10'000`, detail: 'erwartet'},
      { label: 'Aufgaben solo', value: '144', detail: 'In zwei Monaten programmiert' },
      { label: 'Microservices konsolidert', value: '15 zu 8', detail: 'Komplexitätsreduktion' },
      { label: 'Aufgaben-Empfehlungen', value: 'p99 < 1.0ms', detail: 'Lokale Baseline (M1 16GB RAM)' },

    ];

    const TAGS: string[] = [
      "Softwarearchitektur",
      "Technisches Hardening",
      "Datenschutz",
      "AI-Engineering"
    ];

    const studies: CaseStudySummaryData[] = [
      {
        slug: 'lernplattform-mit-ki-tutor',
        href: '/cases/lernplattform-mit-ki-tutor',
        title: 'Lernplattform mit KI-Tutor',
        standfirst: 'Eine Lernplattform, die KI-Tutor nutzt, um Lerninhalte zu personalisieren.',
        tags: [],
      }
    ]

    let collapsed = $state<boolean>(true);

    $effect.pre(() => {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.style.setProperty('--hue', String(222));
    });

    const roles = [
      {
        category: 'Rollen',
        items: ['Lead Software Architect', 'AI Engineer'],
      },
      {
        category: 'Meilensteine',
        items: [`PoC: Sommer '24`, `Prototyp: Herbst/Winter '24`, `Projektstart: Januar '25`, `Go-Live: Sommer '27`],
      },
      {
        category: 'Projektteam',
        items: ['Projektassistenz x1', 'Autoren x3', 'Junior-Entwickler x1', 'Fachdidaktiker x5'],
      }
    ]

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
      }
    ];
</script>

{#snippet rail()}
  <div class="wordmark">Portfolio</div>
  <button onclick={() => collapsed = !collapsed}>o</button>
{/snippet}

{#snippet spineChildren()}
  <CaseStudyIndex {studies} />
{/snippet}

<Shell wordmark="Portfolio" showControls={false} {spineChildren} {collapsed} {rail}>
	<CaseStudyShell title="Architektur einer hochperformanten KI-Lernplattform" metrics={METRICS} tags={TAGS} subtitle="Eine Fallstudie: Von probabilistischer Lernstandanalyse (BKT) zu Sub-Millisekunden-Recommendations." tocTitle="Übersicht">
	<StackManifest groups={roles} />
	<FormattedText block text={`Dieses Projekt begann als sechswöchiger Proof of Concept (PoC) in Zusammenarbeit mit einer KI-Agentur, um einen LLM-basierten Tutor für das Thema "Folgen und Reihen" zu evaluieren. Der Erfolg dieses PoCs – und der anschliessenden Prototyping-Phase, die bei Tests mit mehreren Schulklassen nicht nur die Schülerinnen und Schüler, sondern auch Lehrpersonen und Dozenten überzeugte – führte zum Entscheid, eine vollständige Lernplattform für ~10'000 Lernende inklusive physischem Hauptlehrmittel zu entwickeln.

	**Die Herausforderung: Budget-Restriktionen & Pragmatische Architektur**
	Um aufwändige öffentliche Ausschreibungsverfahren (Regulierungen bei Budgets > 150'000 CHF) zu vermeiden, war eine maximale Konsolidierung der Verantwortung zwingend. Dies erforderte "Extreme Ownership" über den gesamten Lebenszyklus. Erschwerend kam hinzu, dass "Microservices auf Kubernetes" als Management-Vorgabe gesetzt waren. Um den Overhead als Solo-Backend-Dev dennoch handhabbar zu halten, interpretierte ich diese Vorgaben pragmatisch – beispielsweise durch die Konsolidierung von Standard-CRUD-Operationen, während hochspezialisierte KI- und Analyse-Module als isolierte Services liefen.

	**Mein Verantwortungsbereich umfasste:**

	- **Systemarchitektur:** Entwurf einer pragmatischen, Cloud-Native Service-Architektur. Als ein anhaltender Ausfall des K8s-Clusters das Projekt zu blockieren drohte, entkoppelte ich das Frontend architektonisch vollständig und setzte ein dediziertes VPS-Hosting auf. So stellte ich sicher, dass das didaktische Team ohne Unterbruch Aufgaben entwickeln und testen konnte.
	* **Backend & AI Engineering:** Solo-Entwicklung sämtlicher Backend-Services (inkl. Auth, DB-Design) sowie Evaluation und sichere Anbindung von LLMs unter strikten Datenschutzvorgaben (PII-Handling).
	* **Frontend & Output-Skalierung:** Architektur des Svelte-Frontends und Mentoring eines Junior-Entwicklers. Dank des hochgradig modularen Aufbaus konnte ich zuletzt als Solo-Dev über 140 komplexe, dynamisch visualisierte Aufgaben innerhalb von nur zwei Monaten umsetzen.
	* **Domänenlogik & Leadership:** Entwicklung der Lernplattform- und Lehrmittelkonzepte und der kognitiven Modelle (CbKST-Skill Maps) für den didaktischen Kompetenzaufbau für den Go-Live im Sommer 2027.

	Diese Rolle forderte mich nicht nur als Lead Software Architect und Full-Stack-Entwickler, sondern auch als technische Schnittstelle, die zwischen didaktischen Anforderungen, Infrastruktur-Experten und Budget-Realitäten übersetzen und liefern musste.`} />

	<Section id={`lpfOverview`} number={String(1).padStart(2, '0')} title={"Tech-Stack"} canCollapse >
	<StackManifest groups={stack}  />
	</Section>
	<Section id={`lpfDecisions`} number={String(2).padStart(2, '0')} title={"Entscheidungen"} >
	{#each decisionRecordProps as props, index (index)}
	<Section id={`lpf${index}-record`} number={`02.0${index + 1}`} title={props.sectionTitle} level={3}>
		<DecisionRecord id={`lpf${index}-record`} title={props.title} context={props.context} decision={props.decision} consequences={props.consequences} gains={props.gains} costs={props.costs} alternatives={props.alternatives} status={props.status} />
		{#each props.callouts as callout}
		<Callout label={callout.label} tone={callout.tone} >

		<FormattedText text={callout.text} />
		</Callout>
		{/each}
		{#if props.title===decisionRecordProps[3].title}
		<CodeBlock filename="Struktur der CRUD-Service-Module" code={`crud-service/
├── cmd/server/main.go
├── internal/
│   ├── modules/
│   │   ├── assignment/                  # Exemplarisches Hexagonales Modul
│   │   │   ├── core/                    # Domain Logic & Interfaces (Ports)
│   │   │   ├── handlers/                # gRPC / ConnectRPC Handlers (Inbound Adapters)
│   │   │   ├── repositories/            # DB-Zugriff / Postgres (Outbound Adapters)
│   │   │   ├── sql/                     # sqlc Queries & Schemas
│   │   │   └── module.go                # Modul-Registrierung & Dependency Injection
│   │   ├── class/...                    # (Weitere 6 Domänen folgen exakt demselben Schema:
│   │   ├── exercise/...                 #  currentexercise, history, issue, user)
│   │   └── user/...
│   └── shared/
│       ├── config/
│       ├── db/migrations/
│       └── tests/                       # Integration & Robustness Tests`}>

		</CodeBlock>
		{/if}
	</Section>
	{/each}
		</Section>
		<Section id={`lpfDeepDive`} number={String(2).padStart(2, '0')} title={"Deep Dives"} >
			<DeepDive
				id="lpfDeepDive1"
				title="Mehrkriterielle Recommendation Engine"
				eyebrow="Algorithmen & Performance"
				level={3}
				summary="Wahl der optimalen Lernaufgabe in Echtzeit über eine 13-Faktoren-Pipeline mit automatischer Bucketing-Strategie und p99-Latenzen unter 1 ms."
			>
				<FormattedText block text={`Das Herzstück der Lernplattform ist der \`recommendation-service\`. Statt einer einzelnen starren Empfehlung liefert die Engine für ein gewähltes Thema stets **drei nach Schwierigkeit gestaffelte Optionen**, um Lernenden Selbstwirksamkeit und Wahlfreiheit zu ermöglichen:`} />

				<Section id="lpfRecBucketing" title="1. Bucketing-Strategie & Nachvollziehbarkeit" level={4} canCollapse startsClosed>
					<FormattedText block text={`Jedes Candidate-Exercise wird auf einer Skala von 0.0 bis 5.0 in eines von drei Ziel-Buckets eingestuft. Lücken dienen als Pufferzone (\`closest-fallback\` füllt unbesetzte Buckets):

* **Challenge (1.0 – 2.0)**: Anspruchsvolle Aufgabe zur gezielten Überwindung von Hürden.
* **Goldilocks Zone (3.0 – 4.0)**: Die optimale Lernzone (Erfolg mit minimaler Unterstützung).
* **Easier (4.0+)**: Leichtes Review oder Aufbau von Selbstvertrauen.

Jede Empfehlung enthält eine **Explainability-Trace**, welche die mathematische Zusammensetzung der Faktoren für Entwickler und Pädagogen transparent macht.`} />
				</Section>

				<Section id="lpfRecPipeline" title="2. Die 13-Faktoren Scoring-Pipeline" level={4} canCollapse startsClosed>
					<FormattedText block text={`Kandidaten durchlaufen sequentiell eine Pipeline aus 13 gewichteten Heuristiken und probabilistischen Modellen (\`LearningBenefit\` & \`PredictedOutcome\`):

1. **\`cbkst-fringe\`**: Prioritäts-Boost (+100) für Konzepte an der Wissensgrenze (Competence-based Knowledge Space Theory).
2. **\`format-proficiency\`**: Anpassung des Outcomes basierend auf der bisherigen Mastery von Eingabe- und Darstellungsformaten.
3. **\`cdm-difficulty\`**: Gewichtet Aufgabenschwierigkeit mit der Cognitive Diagnosis Model (CDM) Probabilität.
4. **\`track-record\`**: Berücksichtigt den bisherigen Leistungsdurchschnitt der aktuellen Lernsession.
5. **\`anti-monotony\`**: Malus (-25) bei direkt aufeinanderfolgenden identischen Aufgabentypen.
6. **\`confidence-booster\`**: Starker Boost (+200) auf gemasterte Konzepte nach 3 Misserfolgen (<2.0).
7. **\`time-box\`**: Priorisiert Aufgaben, die in die verbleibende Zeit der Session passen (-100 bei Overtime).
8. **\`prerequisite-decay\`**: Malus (-50), wenn die BKT-Probabilität (Bayesian Knowledge Tracing) von Voraussetzungen unter 0.5 fällt.
9. **\`session-coherence\`**: Bonus (+15) für den Verbleib auf dem aktiven Fringe-Konzept.
10. **\`recency\`**: Malus (bis zu -40), der über ein 7-Tage-Fenster linear abklingt.
11. **\`graph-edge\`**: Gelerntes State-to-Exercise Übergangsgewicht überschreibt Vorhersagen ab $\\ge 3$ Beobachtungen.
12. **\`exploration\`**: UCB-Bonus (Upper Confidence Bound) für bisher wenig explorierte State-Exercise-Paare.
13. **\`band-activation\`**: Dreiecks-Aktivierungsbonus (+30) rund um die Ziel-Bucket-Zentren.`} />
				</Section>

				<Section id="lpfRecPerformance" title="3. Performanz & Parallelisierungs-Benchmarks" level={4} canCollapse startsClosed>
					<FormattedText block text={`Um Echtzeit-Feedback ohne spürbare UI-Verzögerung zu gewährleisten, ist der Dienst auf maximale CPU-Effizienz und parallelen I/O ausgelegt:

* **Pure CPU Scoring (100 Aufgaben)**: p50 bei ~0.15ms – 0.30ms | p99 < 1.0ms (> 5.000 Req/s pro CPU-Core).
* **Entkoppelte I/O Stage-Pipeline**: Externe Aufrufe (\`crud-service\`, \`cdm-service\`, \`learning-diagnosis-service\`) werden in 2 parallelen Stufen ausgeführt (Stage 1: User-State & Session; Stage 2: Kandidaten-Details & CbKST Maps).
* **Gesamtlatenz (E2E)**: In-Cluster LAN ~1.2ms – 1.5ms (Inklusive gRPC RTT).

*Hinweis zur Testumgebung: Gemessen auf lokaler Entwickler-Hardware (Apple M1, 16GB RAM). Da Go nativ nach ARM64 kompiliert und der Go-Runtime-Scheduler extrem effizient skaliert, liefert dies eine beeindruckende Baseline für Single-Thread/Local Performance. Synthetische Multi-Node Load-Tests auf K8s-Linux-Clustern folgen vor dem Go-Live.*`} />
				</Section>
			</DeepDive>
			<DeepDive
				id="lpfDeepDive2"
				title="Probabilistische Lernstand-Analyse (BKT & CbKST)"
				eyebrow="Pedagogical Domain Engine"
				level={3}
				summary="Echtzeit-Schätzung des individuellen Wissensstands mittels Bayesian Knowledge Tracing und Competence-based Knowledge Space Theory."
			>
				<FormattedText block text={`Der \`learning-diagnosis-service\` modelliert den sich kontinuierlich verändernden Wissensstand von Lernenden über den gesamten Lehrplan. Er beantwortet in Echtzeit zwei zentrale Fragen: *(1) Was ist gemastert und was ist als Nächstes lernbereit (Fringe)?* und *(2) Wie hoch ist die mathematische Konfidenz unter Berücksichtigung von Vergessen und Übungsergebnissen?*`} />

				<Section id="lpfDiagAlgorithms" title="1. CbKST & Bayesian Knowledge Tracing" level={4} canCollapse startsClosed>
					<FormattedText block text={`Der Dienst kombiniert zwei etablierte mathematische Modelle der Kognitionswissenschaft:

* **Surmise Systems & DNF-Voraussetzungen**: Kompetenz-Abhängigkeiten werden als Disjunktive Normalform (DNF) modelliert. Statt eines unhandlichen $2^N$ Zustandsraums evaluiert das System nur *Feasible Knowledge States*.
* **Dual Estimator Engine (\`estimator.go\`)**:
  * **Joint Estimator (Exakte Bayes-Inferenz)**: Wird bei $\\le 1000$ zulässigen Zuständen genutzt und führt exakte Vektor-Updates durch.
  * **Marginal Estimator (Fallback)**: Dient als speichereffizienter Fallback bei riesigen Wissensräumen.
* **BKT & Hystereseband (\`state.go\`)**: Bayesianische Updates über 6 Evidenz-Stufen (\`Failed\` bis \`SucceededFast\`). Ein Hystereseband ($P(Mastery) \\ge 0.85$ für Vergabe, $\\le 0.75$ für Revokation) verhindert UI-Flackern.`} />
				</Section>

				<Section id="lpfDiagDecayFairness" title="2. Vergessenskurve, Fairness & FADP-Audit" level={4} canCollapse startsClosed>
					<FormattedText block text={`- **Zeitlicher Vergessenszerfall (Temporal Decay)**: BKT-Wahrscheinlichkeiten verfallen exponentiell basierend auf Halbwertszeiten ($T_{1/2}$). Die Berechnung erfolgt performant **on-read** ohne Hintergrund-Batchjobs.
- **Chancengleichheit via Accommodation Flags**: Für Lernende mit Nachteilsausgleich oder Sprachbarrieren werden Evidenz-Stufen (\`SucceededSlow\` & \`SucceededFast\`) zusammengeführt, um Benachteiligung durch reine Reaktionszeiten zu vermeiden.
- **Audit-Trail für Lehrpersonen (\`observation_history.go\`)**: Lückenlose Speicherung von Vorher/Nachher-Deltas (\`marginal_before\` $\\to$ \`marginal_after\`) für FADP/DSGVO-konforme Erklärbarkeit.`} />
				</Section>

				<Section id="lpfDiagPerformance" title="3. Sub-Millisekunden Performanz & Outbox Pattern" level={4} canCollapse startsClosed>
					<FormattedText block text={`* **Sub-Millisekunden-CPU-Inferenz**: Durch vorberechnete Bitmasken (\`stateMask\`) erfolgen Bayes-Updates via ultraschnellen Bitwise-Operationen. Ein Update für $N \\approx 20\\text{--}50$ Kompetenzen benötigt **$\\le 0.05\\text{--}0.2\\text{ ms}$** CPU-Zeit.
- **Transactional Outbox (\`outbox.go\`)**: Status-Änderungen (\`MasteryGranted\`, \`MasteryRevoked\`) werden in derselben PostgreSQL-Transaktion wie das Update in eine In-Database-Outbox geschrieben – garantiert atomar ohne verteilte 2PC-Sperren.`} />
				</Section>
			</DeepDive>
			<DeepDive
			 level={3}
				id="lpfDeepDive3"
				title="Entkoppelte Cross-Cutting Concerns via gRPC Interceptors"
				eyebrow="Architektur & Security"
				summary="Einheitliche Durchsetzung von Security, OpenTelemetry Tracing, FADP/DSGVO-Compliance und Adaptive Load Shedding über dedizierte Middleware-Chains."
			>
				<FormattedText block text={`Um Geschäftslogik strikt von infrastrukturellen Aufwänden zu trennen, wird sämtlicher Cross-Cutting Code in **ConnectRPC / gRPC Interceptors** gebündelt. Sämtliche Requests passieren eine von vier zentral definierten Interceptor-Ketten:`} />

				<Section id="lpfInterceptorsBFF" title="1. Edge Gateway Chain (BFF)" level={3}>
					<FormattedText block text={`Öffentlicher Eintrittspunkt für Anfragen aus dem Browser. Erzwingt Authentifizierung, Rate Limiting und Legal Audits vor der Weiterleitung an interne Microservices.`} />
					<CodeBlock filename="BFF Server Execution Order" code={`Client Request ──> [1. Panic Recovery]
└──> [2. OpenTelemetry Tracing]   (Root Trace Generation)
└──> [3. Error Sanitizer]          (Masking internal system errors)
└──> [4. Context Deadline]         (Max 30s Hard Timeout)
└──> [5. JWT Verifier]             (RSA Signature & Audience Validation)
└──> [6. BFF Authentication]       (Valkey Token Revocation & Identity Extract)
└──> [7. FADP Legal Audit]         (DSGVO/FADP Compliance Logging)
└──> [8. Valkey Rate Limiter]      (Sliding Window per User)
└──> [9. Protovalidate Input]      (Protobuf Schema Validation)`} />
				</Section>

				<Section id="lpfInterceptorsCRUD" title="2. CRUD Service Chain" level={3}>
					<FormattedText block text={`Wird von Persistenz-Diensten genutzt. Übernimmt Autorisierung via Cerbos RBAC, Idempotenz-Prüfungen und Datenbankschutz.`} />
					<CodeBlock filename="CRUD Server Execution Order" code={`Inbound RPC ──> [1. Panic Recovery]
└──> [2. OpenTelemetry Tracing]   (Inherits Parent Trace Context)
└──> [3. Error Sanitizer]          (Masks SQL/Database details)
└──> [4. Identity Extractor]       (Parses X-Identity-* Headers)
└──> [5. FADP Legal Audit]         (Audit trail for PII reads/writes)
└──> [6. Context Deadline]         (Cancels slow DB queries on timeout)
└──> [7. Cerbos RBAC]              (Fine-grained Policy Decision Point)
└──> [8. Idempotency Check]        (Replay Protection via Idempotency-Key)
└──> [9. Protovalidate Input]      (Request Payload Verification)`} />
				</Section>

				<Section id="lpfInterceptorsAI" title="3. AI & Analytics Service Chain" level={3}>
					<FormattedText block text={`Optimiert für rechenintensive Dienste (recommendation-service, llm-tutor-service). Schützt das System vor Überlastung durch dynamisches Verwürfen von Requests.`} />
					<CodeBlock filename="AI Server Execution Order" code={`Inbound RPC ──> [1. Panic Recovery]
└──> [2. OpenTelemetry Tracing]
└──> [3. Error Sanitizer]
└──> [4. Identity Extractor]
└──> [5. FADP Legal Audit]
└──> [6. Adaptive Load Shedder]    (Drops low-priority RPCs under high CPU/Latency)
└──> [7. Cerbos RBAC]
└──> [8. Extended Context Deadline] (Supports long-running LLM Streaming)`} />
				</Section>

				<Section id="lpfInterceptorsClient" title="4. Outbound Client & Mesh Architecture" level={3}>
					<FormattedText block text={`Bei interner Service-zu-Service Kommunikation injiziert die **Client Chain** automatisch Tracing-Kontexte und Identitäts-Header (X-Identity-User-Id, X-Identity-Role) in ausgehende Calls.

Ergänzt wird die Pipeline durch **Linkerd Service Mesh** (mTLS, Circuit Breaking & Automatic Retries) und **VictoriaLogs** als hochperformanter Append-Only Stream für Legal & Audit Logs.`} />
				</Section>
			</DeepDive>
		</Section>
			<Section id={`lpfOutcome`} number={String(5).padStart(2, '0')} title={"Outcome"} >
				<FormattedText block text={`Da das Projekt noch nicht in Produktion ist und sowohl Lernstand wie auch Recommendation Engine noch nicht kalibriert sind, ist dies schwierig zu evaluieren.

				Ich erwarte durch die personalisierten Lernwege ein hohes Engagement der Lernenden und dadurch bessere Lernleistung und bessere Mathematik-Kompetenzen. Durch die Lernstandanalyse sollten die Lehrpersonen einen feingranulareren Einblick in die Fähigkeiten der einzelnen Lernenden erhalten, wodurch sie ihren Unterricht zielgerichteter halten können.

				Als ehemalige Lehrperson wäre für mich eine Utopie, wenn dadurch auf Prüfungen verzichtet werden könnte.`} />
			</Section>
			<Divider />
<Section id={`lpfRetro`} title="Retrospektive" number={String(5).padStart(2, '0')}>
  			<FormattedText block text={`Eine Retrospektive bei einem laufenden Projekt, an dem noch Änderungen eingebracht werden können, ist etwas schwierig, deswegen hier die Frage: *"Was wäre wenn..?"*`} />
<Callout label="Unendlich Compute & Zeit" tone="success">
  <FormattedText text="Ich würde ein eigenes Modell von Grund auf trainieren, nämlich ein **MoE-Diffusions-Sprachmodell**, ähnlich `LLaDA2.1`. Nicht nur aus persönlicher Neugierde, sondern auch aufgrund der Effizienz durch parallele Generierung. So wären die Tutor-Interaktionen schneller und es könnten mehr Nutzer parallel bedient werden.

    Unendlich Compute deswegen, weil die Accuracy und Antwortqualität geringer ist als bei autoregressiven Modellen und es dadurch voraussichtlich mehr Iterationen und Ablationen benötigt." />

</Callout>
</Section>
	</CaseStudyShell>
</Shell>

<style>
  .wordmark {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      margin-bottom: 6px;
      writing-mode: vertical-lr;
      text-orientation: mixed;
      transform: rotate(180deg);
  }
</style>
