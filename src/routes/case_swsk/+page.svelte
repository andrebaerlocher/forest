<script lang="ts">
    import FormattedText from "$lib/atoms/FormattedText.svelte";
    import type { CaseStudySummaryData, ChainStep, DecisionStatus, MetricItem, RejectedAlternative, StepItem } from "$lib/domain.js";
    import Callout from "$lib/molecules/Callout.svelte";
    import Disclosure from "$lib/molecules/Disclosure.svelte";
    import StackManifest from "$lib/molecules/StackManifest.svelte";
    import Chain from "$lib/organisms/Chain.svelte";
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
            sectionTitle: 'Datenschutz & Deployment',
            title: 'Lokale Modelle vs. SOTA-APIs (OpenAI/Anthropic)',
            context: 'Da die Aufsätze besonders schützenswerte Daten (persönliche Erlebnisse, PII) von Lernenden enthielten, war ein Versand an externe Cloud-Anbieter in den USA rechtlich und ethisch ausgeschlossen.',
            decision: '**Lokales Deployment via Ollama**',
            gains: [
              '100% Data Privacy und rechtliche Compliance.',
              'Keine variablen Token-Kosten bei der Evaluierung von 1\'750 Texten mit Multi-Modell-Ansatz.'
            ],
            costs: [
              'Hardware-Limitierungen erforderten den Einsatz kleinerer Modelle (< 15B Parameter) anstelle massiver State-of-the-Art Modelle.'
            ],
            consequences: [
              'Die mangelnde Kapazität einzelner lokaler Modelle zwang zur architektonischen Innovation (Ensemble-Methode).'
            ],
            alternatives: [
              { option: 'Cloud SOTA-APIs (GPT-4 / Claude)', rejectedBecause: 'Trotz initialer Tests ausgeschlossen aufgrund von strikten Datenschutzvorgaben bei Bildungsdaten.' }
            ],
            status: 'final',
            callouts: []
          },
          {
            sectionTitle: 'Modell-Architektur',
            title: 'Single-Model vs. Multi-Model Ensemble',
            context: 'Vorprojekt-Tests durch Fachexperten mit einzelnen Modellen ergaben, dass die automatische Bewertung von Aufsätzen zu inkonsistent und fehleranfällig sei. LLMs tendierten dazu, Kriterien zu vermischen und wiesen eine hohe Varianz auf.',
            decision: '**Multi-Model Ensemble mit Synthese-Schritt**',
            gains: [
              'Drastische Reduktion von Modell-Bias und Einzel-Halluzinationen.',
              'Spezialisierung: Kleinere, lokale Modelle (z.B. Phi-3, Gemma2) reichten im Verbund für die Einzelkriterien völlig aus.'
            ],
            costs: [
              'Höherer Rechenaufwand (3x Evaluierung + 1x Synthese pro Text).'
            ],
            consequences: [
              'Die Architektur erforderte eine Orchestrierung in Go, da die Evaluierung eines Textes nun ein komplexer asynchroner Flow war.'
            ],
            alternatives: [
              { option: 'Ein grosser Call an ein lokales 70B Modell', rejectedBecause: 'Zu langsam für den Durchsatz und ein einzelnes Modell liefert keine inhärente Konfidenzmetrik.' }
            ],
            status: 'final',
            callouts: []
          },
          {
            sectionTitle: 'Pragmatismus vs. AI-Hype',
            title: 'LLM vs. Regelbasierte Systeme für Orthografie',
            context: 'Bei den Dimensionen "Rechtschreibung und Grammatik" halluzinierten die damaligen Modelle häufig Fehler oder übersahen offensichtliche Mängel, da LLMs auf semantischer und nicht auf syntaktischer Zeichenebene operieren.',
            decision: '**LanguageTool (Regelbasiert)**',
            gains: [
              '100% deterministische, korrekte Grammatik- und Rechtschreibprüfung.',
              'Massive Entlastung der LLM-Pipeline für diese spezifische Metrik.'
            ],
            consequences: [],
            alternatives: [
              { option: 'Starkes Prompt-Engineering für Orthografie', rejectedBecause: 'Führte zu Dead-Ends. Die Erkenntnis: Ein guter AI-Engineer weiss, wann man besser keine KI einsetzt.' }
            ],
            status: 'accepted',
            callouts: []
          }
        ];

    const METRICS: MetricItem[] = [
      { label: 'Kernsystem', value: '3 Monate', detail: 'Entwicklung AI-Pipeline & HitL-GUI' },
      { label: 'Evaluationen', value: `1'750`, detail: 'Aufsätze asynchron bewertet'},
      { label: 'Modell-Ensemble', value: '3 + 1', detail: 'Lokale Rater-Modelle + Synthese-Judge' },
      { label: 'IRR-Analytics', value: '100% Custom', detail: 'Statistik-Engine in TS geschrieben' },
    ];

    const TAGS: string[] = [
      "LLMOps & Orchestration",
      "Data Privacy (Local LLMs)",
      "Statistical Analysis (IRR)",
      "Full-Stack Development"
    ];

    const studies: CaseStudySummaryData[] = [
      {
        slug: 'lernplattform-mit-ki-tutor',
        href: '/cases/lernplattform-mit-ki-tutor',
        title: 'Lernplattform mit KI-Tutor',
        standfirst: 'Architektur einer hochperformanten KI-Lernplattform.',
        tags: [],
      }
    ];

    let collapsed = $state<boolean>(true);

    $effect.pre(() => {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.style.setProperty('--hue', String(222));
    });

    const roles = [
      {
        category: 'Rollen',
        items: ['Lead AI Engineer', 'Co-Founder', 'Full-Stack Developer'],
      }
    ];

    const stack = [
      {
        category: 'Modelle (Lokal via Ollama)',
        items: ['Gemma2-9b-SimPO', 'Phi-3-14B-Reasoning', 'Llama 3'],
      },
      {
        category: 'LLM Orchestration',
        items: ['Go (Backend)', 'Prompt Chaining', 'LLM-as-a-Judge'],
      },
      {
        category: 'Stats & Frontend',
        items: ['TypeScript', 'SvelteKit', 'Custom IRR-Engine']
      },
      {
        category: 'NLP Tools',
        items: ['LanguageTool (Deterministische Grammatik)'],
      },
      {
        category: 'PDF Generation',
        items: ['signintech/gopdf'],
      }
    ];

    const aiEnsembleChain: ChainStep[] = [
      { label: 'Input Sanitization', detail: 'Text-Bereinigung und Token-Längen-Prüfung' },
      { label: 'LanguageTool Scan', detail: 'Deterministische Prüfung von Grammatik/Orthografie' },
      { label: 'Dynamic Context Loading', detail: 'Lädt kriterien-spezifische Anchor-Texte in Go' },
      { label: 'Parallel Evaluation (Gemma2-9b)', detail: 'Lokaler Ollama API-Call (Blind)' },
      { label: 'Parallel Evaluation (Phi-3-14B)', detail: 'Lokaler Ollama API-Call (Blind)' },
      { label: 'Parallel Evaluation (Llama 3)', detail: 'Lokaler Ollama API-Call (Blind)' },
      { label: 'LLM-as-a-Judge Synthesis', detail: '4. Modell aggregiert die 3 Vektoren und schlichtet' },
      { label: 'Human-in-the-Loop Routing', detail: 'Bei tiefer Modell-Übereinstimmung -> Flag für manuelle Korrektur' },
    ];
</script>

{#snippet rail()}
  <div class="wordmark">Portfolio</div>
  <button onclick={() => collapsed = !collapsed}>o</button>
{/snippet}

{#snippet spineChildren()}
  <CaseStudyIndex {studies} />
{/snippet}

{#snippet meta()}
  <StackManifest groups={roles} />
{/snippet}

<Shell wordmark="Portfolio" showControls={false} {spineChildren} {collapsed} {rail}>
	<CaseStudyShell title="Automatische Aufsatzbewertung via LLM-Ensemble" metrics={METRICS} tags={TAGS} {meta} subtitle="Eine Fallstudie: 1'750 Texte, strikter Datenschutz und Custom-Statistiken." tocTitle="Übersicht">
	<FormattedText block text={`"Es ist mit dem aktuellen Stand der Technik nicht möglich." Das war das Fazit einer initialen Machbarkeitsstudie, nachdem Fachexperten diverse Tests mit SOTA-Sprachmodellen durchgeführt hatten. Zudem verschärfte sich das Problem durch strenge Datenschutzvorgaben: Da die Aufsätze hochsensible persönliche Daten enthielten, war die Nutzung von APIs wie OpenAI oder Anthropic rechtlich ausgeschlossen.

	Als der Leiter des Gesamtprojekts mich nach meiner Einschätzung fragte, baute ich an einem Sonntagmorgen einen Proof of Concept. Mein Ansatz: Die Evaluation musste auf kleine, datenschutzkonforme **lokale Modelle** heruntergebrochen und über eine strikte Pipeline orchestriert werden. Dieser PoC bewies, dass das Projekt realisierbar war. Das Commitment ging so weit, dass meine Frau und ich eigens für die offizielle Umsetzung dieses Projekts eine Firma gründeten.

	**Die Umsetzung: Voller Stack von Grund auf**
	Aufgrund administrativer Hürden blieben letztlich nur knapp drei Monate reine Entwicklungszeit für die initiale Systementwicklung. In dieser stark komprimierten Phase orchestrierte ich die asynchrone AI-Pipeline in Go zur Bewertung von ca. 1'750 Kurztexten und baute das Frontend inklusive Human-in-the-Loop GUI und Custom-Statistik-Engine in SvelteKit. Das aufwendige Rater-Training und die Etablierung breit abgestützter Anker-Texte erfolgten danach in einer dedizierten zweiten Projektphase.

	**Mein Verantwortungsbereich:**

	- **AI Engineering & Orchestration (Go):** Konzeption einer asynchronen Multi-Modell-Architektur (Gemma2, Phi-3, Llama via Ollama), die das fehlende Denkvermögen grosser Cloud-Modelle durch Ensembles ausglich.
	- **Custom Statistics Engine (TypeScript):** Verzicht auf Python/Pandas zugunsten einer nativen Implementierung akademischer Metriken (Krippendorff's Alpha, Gwet's AC2, ICC) direkt in TypeScript für die Evaluierung von Rater-Bias.
	- **Full-Stack & UX:** Bau des Human-in-the-Loop Interfaces (inklusive komplexer PDF-Reporting-Generierung mit \`gopdf\`), welches in der anschliessenden Trainingsphase für Workshops zur Konsensfindung genutzt wurde.`} />

	<Section id={`lpfOverview`} number={String(1).padStart(2, '0')} title={"Tech-Stack & Tools"}  >
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
	    </Section>
	{/each}
	</Section>

		<Section id={`lpfDeepDive`} number={String(3).padStart(2, '0')} title={"Deep Dives"} >

            <DeepDive
				id="aiDeepDive1"
				title="Das lokale LLM-Ensemble: Reduktion von Non-Determinismus"
				eyebrow="LLMOps & Orchestrierung in Go"
				level={3}
				sectionNumber={3}
				diveNumber={1}
				summary="Wie inkonsistente LLM-Outputs durch ein asynchrones Multi-Modell-Setup (Gemma, Phi, Llama) mathematisch stabilisiert wurden."
			>
				<FormattedText block text={`Um in einem Educational-Kontext eine verlässliche Bewertung zu garantieren, darf man sich nicht auf die stochastische Tagesform eines einzelnen Modells verlassen. Da aus Datenschutzgründen nur lokale Modelle in Frage kamen, entwickelte ich in Go eine komplexe Orchestrierungs-Pipeline, welche die lokalen Ollama-Instanzen parallel ansprach.`} />

				<Section id="aiPipelineSteps" title="Der Synthese-Workflow" level={4}>
					<FormattedText block text={`Jedes Bewertungskriterium wurde strikt isoliert (Dynamic Prompt Chaining). Die drei Hauptmodelle beurteilten den Text völlig unabhängig voneinander.

Ein viertes LLM fungierte anschliessend als **Judge/Synthesizer**. Es analysierte die drei generierten Scores und Begründungen. Stimmten die Modelle überein, wurde ein hoher \`Certainty\`-Wert vergeben. Gab es Diskrepanzen, wurde der Text für den Human-in-the-Loop geflaggt.`} />

                    <Disclosure id="aiEnsembleChain" label="Die Ausführungs-Pipeline im Detail" count="8 Stufen">
						<Chain title="Multi-Model Evaluation Chain" entry="Rohtext" exit="Bewertungsvektor & Certainty Score" steps={aiEnsembleChain} />
					</Disclosure>
				</Section>
			</DeepDive>

			<DeepDive
				id="aiDeepDive2"
				title="IRR-Statistik from Scratch (Kein Python, kein Pandas)"
				eyebrow="Data Science & TypeScript Engine"
				level={3}
				sectionNumber={3}
				diveNumber={2}
				summary="Implementierung akademischer Goldstandards zur Quantifizierung von Rater-Bias (Krippendorff, Gwet's AC2, ICC) rein in TypeScript."
			>
				<FormattedText block text={`Die beste KI-Bewertung ist wertlos, wenn sie nicht gegen verlässliche menschliche Baselines ("Ground Truth") gemessen werden kann. Statt auf bewährte Data-Science-Stacks wie Python oder SciPy zurückzugreifen, schrieb ich die komplette statistische Evaluierung nativ in TypeScript, um sie tief in die SvelteKit-Architektur zu integrieren.`} />

				<Section id="aiStatsIRR" title="1. Triangulation der Zuverlässigkeit (Das Kappa-Paradoxon)" level={4}>
					<FormattedText block text={`Sich auf eine einzige IRR-Metrik zu verlassen, ist gefährlich. Die Engine berechnete in Echtzeit:

* **Krippendorff's Alpha (Corrected)**: Nutzte *Interval Weights*, um grosse Diskrepanzen mathematisch härter abzustrafen.
* **Gwet's AC2**: Wurde bewusst implementiert, um das *Kappa-Paradoxon* zu lösen (bei welchem Metriken wie Cohen's Kappa trotz hoher Übereinstimmung eine tiefe Reliabilität anzeigen, wenn eine Bewertungskategorie dominiert).
* **Intraclass Correlation Coefficient (ICC)**: Auf Basis eines ANOVA-Frameworks berechnet, um zu messen, wie viel Score-Varianz auf echte qualitative Unterschiede der Texte zurückzuführen ist und wie viel auf Messfehler.`} />
				</Section>

				<Section id="aiStatsZScore" title="2. Rater-Outlier Detection (Severity vs. Inconsistency)" level={4}>
					<FormattedText block text={`Um zu erkennen, warum Rater (menschlich oder KI) vom Konsens abweichen, trennte das System die Fehler via **Z-Scores** in **Severity** (systematischer Bias) und **Inconsistency** (Rauschen). Ein Wert von $|Z| > 2$ flaggte Rater automatisch für gezielte Nachschulungen (Kalibrierung vs. Basis-Retraining).`} />
				</Section>

                <Section id="aiStatsAPD" title="3. Custom APD Consensus" level={4}>
					<FormattedText block text={`Neben den abstrakten akademischen Werten berechnete die Engine die **APD Consensus** Metrik (Mean Pairwise Absolute Difference), normalisiert auf eine Skala von 0-1. Dies erlaubte es nicht-technischen Stakeholdern, die Qualität sofort zu erfassen ("Die Rater liegen durchschnittlich nur 5% der Skala auseinander").`} />
				</Section>
			</DeepDive>

            <DeepDive
				id="aiDeepDive3"
				title="Der Human-in-the-Loop Workflow (Konsensfindung)"
				eyebrow="Frontend & UX (Phase 2)"
				level={3}
				sectionNumber={3}
				diveNumber={3}
				summary="Aufbau eines 4-stufigen, iterativen GUI-Workflows für 180 Anchor-Texte zur Etablierung einer stabilen menschlichen Ground Truth."
			>
				<FormattedText block text={`Nach der initialen Systementwicklung wurde das HitL-Interface in einer dedizierten Folgephase genutzt, um verlässliche Anker-Texte zu generieren und das Bewertungsteam zu trainieren.

Der Prozess für 180 Texte wurde in vier strikte Phasen unterteilt (Blind-Beurteilung, IRR-Auswertung, Workshop & Überarbeitung, Validierungs-Tranche). Dieses Tooling bildete das methodische Fundament, auf dem die LLM-Modelle final evaluiert werden konnten.

*(Side-Note: Eine der hartnäckigsten Hürden im Frontend/Reporting war kurioserweise keine AI-Metrik, sondern der zwingende Wunsch der Projektleitung nach einem lupenreinen Blocksatz in der PDF-Ausgabe der Resultate, was mit \`signintech/gopdf\` schliesslich erfolgreich gelöst wurde).*`} />
			</DeepDive>
		</Section>

		<Section id={`aiOutcome`} number={String(4).padStart(2, '0')} title={"Business Outcome & Erkenntnisse"} >
			<FormattedText block text={`Innerhalb von nur drei aktiven Entwicklungsmonaten wurde das Kernsystem für ein Vorhaben realisiert, das anfänglich als "technisch unmöglich" eingestuft worden war. 1'750 Aufsätze wurden unter strikten Datenschutzauflagen (lokale Inferenzen) asynchron und mit methodisch nachweisbarer Zuverlässigkeit ausgewertet.

Dieses Projekt zeigte eindrücklich, dass erfolgreiches AI Engineering selten bedeutet, einfach einen API-Key für das grösste Modell in den Code zu kleben. Es geht um Systemarchitektur, das Management von stochastischen Risiken (Ensembles) und das pragmatische Wissen, wann deterministische Tools (wie LanguageTool) der KI überlegen sind. Dafür eine eigene Firma zu gründen und die Architektur von Grund auf neu zu denken, war eine der prägendsten Erfahrungen meiner Laufbahn.`} />
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
