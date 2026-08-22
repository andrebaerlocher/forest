<script lang="ts">
  import Divider from "$lib/atoms/Divider.svelte";
  import FormattedText from "$lib/atoms/FormattedText.svelte";
  import type { CaseStudySummaryData, ChainStep, MetricItem, StepItem } from "$lib/domain.js";
  import Callout from "$lib/molecules/Callout.svelte";
  import Disclosure from "$lib/molecules/Disclosure.svelte";
  import StackManifest from "$lib/molecules/StackManifest.svelte";
  import Chain from "$lib/organisms/Chain.svelte";
  import DeepDive from "$lib/organisms/DeepDive.svelte";
  import Section from "$lib/organisms/Section.svelte";
  import Stepper from "$lib/organisms/Stepper.svelte";
  import CaseStudyIndex from "$lib/templates/CaseStudyIndex.svelte";
  import CaseStudyShell from "$lib/templates/CaseStudyShell.svelte";
  import Shell from "$lib/templates/Shell.svelte";

  const METRICS: MetricItem[] = [
    { label: "Test-Cases", value: "719", detail: "117 Testdateien, 726 Test/Fuzz-Funktionen" },
    { label: "Zero Daemon", value: "0 Dockerfiles", detail: "Direkt aus Go, ohne Docker daemon" },
    { label: "Reproduzierbarkeit", value: "100%", detail: "Bit-for-bit deterministische OCI-Digests" },
    { label: "Image-Groesse", value: "-80%", detail: "Distroless/Chainguard statt voller OS-Utilities" },
  ];

  const TAGS: string[] = [
    "Vibe-Coding",
    "AI Agentic Workflows",
    "Go",
    "OCI / Container",
    "DevSecOps",
  ];

  const studies: CaseStudySummaryData[] = [
    {
      slug: "pokkum-vibe-coded",
      href: "/case_pokkum",
      title: "Pokkum — 100% Vibe-Coded",
      standfirst: "Ein OCI-Compiler für SvelteKit, gebaut als bewusste Übung im Vibe-Coding: wo Agenten vorhersehbar gut sind, wo sie lügen und wie man mit Tests und Systemprompts Vertrauen zurückgewinnt.",
      tags: ["Vibe-Coding", "Go", "Container"],
      metric: { label: "Test-Cases", value: "719" },
    }
  ];

  let collapsed = $state(true);

  $effect.pre(() => {
    document.documentElement.setAttribute('data-mode', 'dark');
    document.documentElement.style.setProperty('--hue', String(222));
  });

  const roles = [
    {
      category: "Rollen",
      items: ["Solo-Developer", "Prompt-/System-Engineer", "QA-Verantwortlicher"],
    }
  ];

  const tools = [
    {
      category: "Coding-Agents",
      items: ["Claude Code", "Google Antigravity", "DeepSeek Harness", "Prime-Agent"],
    },
    {
      category: "IDE",
      items: ["Zed IDE"],
    },
    {
      category: "Recherche & Memory",
      items: ["Perplexity", "Serena MCP"],
    },
  ];

  const timeline: StepItem[] = [
    { id: "handstart", label: "Hand-Start", detail: "ko-Recherche" },
    { id: "exe", label: "Umbau", detail: "Hugo-Dz/exe + Bun" },
    { id: "vibe-gemini", label: "Vibe-Coding", detail: "Gemini 3.5→3.7 Flash" },
    { id: "verification", label: "Verification", detail: "Claude Code · Clean-Context Loop" },
  ];

  const verificationLoop: ChainStep[] = [
    { label: "Generate", detail: "Agent implementiert ein Feature / Refactor" },
    { label: "4-Step Suite", detail: "gofmt/vet · Adapter-Tests · CLI-Build · go test ./internal/..." },
    { label: "Clean-Context Sub-Agent", detail: "Isolierter Verifier ohne Konversations-Gedächtnis" },
    { label: "Adversarial Tests", detail: "2–3 Edge-Case-Tests jenseits des Happy Path" },
    { label: "Review", detail: "Statischer & semantischer Scan (Logic, Side Effects, Races)" },
    { label: "Diff-Verifikation", detail: "Jeder Befund gegen den echten git diff" },
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
  <Section id="pokkum-tools" title="Vibe-Coding-Tooling" unlisted level={4}>
    <StackManifest groups={tools} />
  </Section>
  <Stepper steps={timeline} completedIds={['handstart', 'exe', 'vibe-gemini']} activeId="verification" />
{/snippet}

<Shell wordmark="Portfolio" showControls={false} {spineChildren} {collapsed} {rail}>
  <CaseStudyShell title="Pokkum — 100% Vibe-Coded" metrics={METRICS} tags={TAGS} {meta} subtitle="Eine Methoden-Fallstudie über Vibe-Coding: was ein Agent vorhersehbar gut kann, wo er lügt – und wie man mit Tests und Systemprompts Vertrauen zurückgewinnt." tocTitle="Übersicht">
    <FormattedText block text={`Pokkum ist ein **zero-dependency OCI-Container-Image-Compiler für SvelteKit** – im Kern „ko für SvelteKit": kein Dockerfile, kein Docker daemon, bit-for-bit reproduzierbare Builds out of the box. Dieses Dokument ist aber bewusst **keine Architektur-Fallstudie**. Die eigentliche Geschichte ist die *Methode*: Pokkum habe ich zu 100 % per **Vibe-Coding** gebaut – und dabei herausgefunden, wo KI-gestützte Entwicklung vorhersehbar stark ist, wo sie lügt, und wie man Qualität zurückgewinnt, wenn man die massive Code-Menge nicht mehr selbst vollständig überblicken kann.

**Der Auslöser.** Eigentlich begann alles mit einem Sicherheitsproblem: Das bestehende SvelteKit-Image meines „zentralen" Projekts hat ein CVE-Problem – ich brauchte ein „wasserdichtes" Image. Daraus wurde die Idee eines eigenen, minimalen und deterministisch reproduzierbaren Compilers.

**Der Einstieg von Hand.** Zuerst recherchierte ich, was **ko** eigentlich ist – was es genau macht, welche Schritte dahinterstecken. Danach machte ich erste Versuche mit **Hugo-Dz/exe**, einem Tool, das SvelteKit-Apps via Bun in ein Single Binary bündelt. Das war es im Grunde.

**Der Schritt ins Vibe-Coding.** Es gab keinen konkreten Auslöser – vielmehr eine **Marktlücke**. Ich hatte viel AI-assisted Coding betrieben, aber noch nie *pur* Vibe-Coding. Wenn es am Markt verlangt wird, ich aber keine Erfahrung habe, ist das eine klare Lücke. Pokkum wurde damit zur bewussten Übung: *ich wollte herausfinden, was funktioniert, was nicht, wo die Grenzen sind, wo die Hürden und Stolperfallen.*`} />

    <Section id="pokkumWorkflow" number={String(1).padStart(2, '0')} title={"Der Vibe-Coding-Workflow"} >
      <DeepDive
        id="pokkumWorkflow1"
        title="Tooling & Arbeitsweise"
        eyebrow="Stack & Rollen"
        level={3}
        sectionNumber={1}
        diveNumber={1}
        summary="Der Vibe-Coding-Loop wird von mehreren spezialisierten Agents getrieben, gespeist aus einem persistenten Repo-Gedächtnis (Serena MCP) und einer Recherche-Quelle (Perplexity)."
      >
        <FormattedText block text={`Beim Vibe-Coding von Pokkum kam ein **breiter Tooling-Stack** zum Einsatz – jedes Tool mit einer eigenen Rolle im Loop:

* **Claude Code** – der primäre Coding-Agent; übernahm insbesondere die **Code-Reviews der Commits** und die Clean-Context-Sub-Agent-Verifikation.
* **Google Antigravity** – weiterer Agent, eingesetzt für Teile der Implementierung.
* **DeepSeek Harness** – weiterer Coding-Agent im Mix.
* **Zed IDE** – die Entwicklungsumgebung, in der ich selbst eingriff.
* **Perplexity** – für Recherche, wenn der Agent oder ich etwas nachschlagen mussten.
* **Serena MCP** – das **Repo-Gedächtnis**: ein persistenter Wissensgraph, der Architektur-Invarianten, Konventionen und den Tech-Stack für Agents zuverlässig bereithält. Damit entfällt der mühsame „jedes Mal neu einlesen"-Overhead.
* **Prime-Agent** – kurz ausprobiert als weiterer Kandidat im Tooling-Vergleich.

Wichtig ist die **Arbeitsteilung**: Es wird nicht nur ein einziger Agent alles machen lassen, sondern der Ablauf wird über mehrere, je nach Stärke eingesetzte Agents orchestriert.`} />
      </DeepDive>

      <DeepDive
        id="pokkumWorkflow2"
        title="Prompts vs. Systemprompts"
        eyebrow="Der eigentliche Hebel"
        level={3}
        sectionNumber={1}
        diveNumber={2}
        summary="Meine Prompts sind kurz und unspektakulär – der wahre Hebel liegt in den auf den jeweiligen Agent zugeschnittenen Systemprompts."
      >
        <FormattedText block text={`Eine meiner zentralen Erkenntnisse: **Meine Prompts sind eigentlich ziemlich lausig und kurz.** Die eigentliche Leistung steckt in den **Systemprompts**, die ich auf den jeweiligen Agent zuschneide.

Für Pokkum entstand daraus **pokkum_instructions.md** – ein Guidelines-Dokument, das dem Agent die Architektur-Invarianten, Quality Standards und das Verification Protokoll vorgibt:

* **Hexagonal Architecture Boundaries** – **internal/ports** als Leaf-Node, automatische Purity-Verifikation per AST-Analyse in **internal/architecture_test.go**.
* **Bit-for-Bit Reproduzierbarkeit** – kein Zugriff auf Systemuhren (**time.Now()** verboten), alles leitet sich aus **SourceDateEpoch** ab.
* **Zero-Mutation Build Sandbox** – Injektionen nur im virtuellen **.pokkum/**-Raum, nie in User-Quellcode.
* **Zero Fake Implementations** – Stubs und Platzhalter müssen explizit geflaggt werden und dürfen **nie** als „implementiert" gemeldet werden.
* **Task-Completion Verification Protocol** – eine 4-stufige Suite (Formatierung, Adapter-Tests, CLI-Build, volle Internal-Tests) vor jeder Fertigstellung.
* **Clean-Context Sub-Agent Verification** – dazu unten mehr.

Der Punkt ist: *Der Prompt ist kurz, aber die Spielregeln sind hart codiert.* Der Systemprompt macht aus einem generischen LLM einen disziplinierten Ingenieur, der die Architektur-Regeln des Projekts kennt und nicht einfach drauflos „erfindet".`} />
      </DeepDive>

      <DeepDive
        id="pokkumWorkflow3"
        title="Iterations- & Verification-Schleife"
        eyebrow="Learnings aus Fehlern"
        level={3}
        sectionNumber={1}
        diveNumber={3}
        summary="Automatisierte Code-Reviews offenbarten, wie unzuverlässig manche Agents sind – daraus entstand die Clean-Context-Sub-Agent-Verifikationsschleife mit adversialen Tests."
      >
        <FormattedText block text={`Die Iterationsschleife ist direkt aus meinen **Learnings** gewachsen. Ich arbeitete lange mit **Gemini 3.5 Flash**, dann **3.6 Flash**, jetzt **3.7 Flash** – und liess zunächst automatisierte Code-Reviews laufen.

Bis sich herausstellte: **Gemini baute viele Fehler ein, liess Stubs im Code, behauptete aber trotzdem, das Feature sei „implementiert".** Also begann ich, via **Claude Code** die Commits anschauen zu lassen – und es wurden **noch viel mehr Probleme gefunden**.

Daraus entstand die **Sub-Agent-Verification-Schlaufe**: Nach einem nicht-trivialen Feature wird ein **Sub-Agent mit sauberem, isoliertem Kontext** aufgerufen – ohne bisherige Konversations-Historie, nur mit der Liste der geänderten Dateien und einer knappen funktionalen Spezifikation.`} />
        <Disclosure id="pokkumVerificationLoop" label="Die Clean-Context-Verifikationsschleife" count={6} hint="Reihenfolge entspricht der Ausführung im Protokoll.">
          <Chain title="clean-context verification loop" entry="Feature implementiert" exit="Bug-Quarantine & Lessons.md" steps={verificationLoop} />
        </Disclosure>
        <FormattedText block text={`Der Verifier führt die volle Test-Suite aus, schreibt **2–3 adversiale Edge-Case-Tests** jenseits des Happy Path, scannt statisch und semantisch nach Logikfehlern, ungewollten Seiteneffekten und Race Conditions – und verifiziert jeden Befund gegen den echten **git diff**. **Silent Patching ist strikt verboten.** Jeder Defekt wird transparent samt Root-Cause in **Lessons.md** protokolliert.

Diese automatisierten Reviews waren von Anfang an **beabsichtigt** – genau dafür sollte Vibe-Coding erforscht werden: *herauszufinden, was funktioniert und was nicht.*`} />
      </DeepDive>
    </Section>

    <Section id="pokkumContrast" number={String(2).padStart(2, '0')} title={"Was funktioniert – und was nicht"} >
      <DeepDive
        id="pokkumGood"
        title="Vorhersehbar stark"
        eyebrow="Doku, Konzepte & Tests"
        level={3}
        sectionNumber={2}
        diveNumber={1}
        summary="Zuverlässig gut: Dokumentation und Feature-Beschreibungen zuerst, Konzepte für schwierige Features, und vor allem eine umfangreiche Test-Suite inklusive adversialer Tests."
      >
        <FormattedText block text={`Was wurde **vorhersehbar gut** geliefert?

* **Dokumentation & Feature-Beschreibungen zuerst.** Bei neuen Features liess ich zuerst die Doku und die Beschreibung erstellen, bevor Code entstand.
* **Konzepte für schwierige Features.** Bei komplexen Vorhaben liess ich zunächst Konzepte ausarbeiten.
* **Tests – und vor allem adversiale Tests.** Testen war der wichtigste Baustein überhaupt.

Das Ergebnis spricht für sich – die Test-Suite ist das Fundament des Vertrauens:`} />
        <Callout label="Die Test-Suite als Fundament" tone="success">
          <FormattedText text={`**117 Testdateien** (**_test.go**), **726** top-level **Test**/**Fuzz**-Funktionen, davon **719** echte Test-Cases (7 **TestMain**-Setups). Viele davon sind table-driven mit zusätzlichen **t.Run(...)**-Subtests – die tatsächliche Zahl an Assertions liegt also deutlich höher.`} />
        </Callout>
      </DeepDive>

      <DeepDive
        id="pokkumBad"
        title="Wo Agents lügen"
        eyebrow="Stubs & Falschbehauptungen"
        level={3}
        sectionNumber={2}
        diveNumber={2}
        summary="Die grösste Stolperfalle: Agents lassen Stubs im Code zurück und melden Features trotzdem als „implementiert“. Erkannt durch unabhängige Reviews, nicht durch Selbstauskunft."
      >
        <FormattedText block text={`Die grösste Stolperfalle beim Vibe-Coding war nicht mangelnde Intelligenz – sondern **fehlende Ehrlichkeit**:

* **Stubs im Code** – Platzhalter, die nie durch echte Logik ersetzt wurden.
* **Falschbehauptungen** – ein Feature wurde als „implementiert" gemeldet, obwohl es nur angerissen war.
* **Stille Fehler** – Fehler, die der Agent selbst nicht meldete, weil er sie nicht bemerkte oder nicht eingestehen wollte.

Genau hier greift die **Zero-Fake-Implementations-Regel** aus dem Systemprompt: Stubs und Platzhalter müssen explizit geflaggt werden und dürfen nie als fertig gemeldet werden. Und genau hier zeigt sich, warum die **unabhängige Clean-Context-Prüfung** so wichtig ist – ein isolierter Verifier mit frischem Kontext findet, was der Haupt-Agent aus Bestätigungs-Bias übersieht.`} />
      </DeepDive>
    </Section>

    <Section id="pokkumBoundaries" number={String(3).padStart(2, '0')} title={"Grenzen & Vertrauen"} >
      <FormattedText block text={`Bei der Frage, wo die Grenzen liegen, bin ich bewusst einen ungewöhnlichen Weg gegangen: **Ich versuche es wirklich komplett Vibe-Coded.**

Statt kritische Bereiche (Sigstore/Cosign, Reproduzierbarkeit, PID-1-Supervisor) von vornherein auszuklammern, habe ich bewusst versucht, *alles* von Agents bauen zu lassen – als kontrollierte Exploration dessen, was möglich ist.

Das heisst aber **nicht**, dass ich blind vertraue. Die Grenze liegt nicht bei „welche Domäne", sondern bei *„wie überprüfe ich es"*:`} />
      <StackManifest groups={[{ category: 'Vertrauensanker', items: ['Adversiale Tests', 'Clean-Context Reviews', 'git diff-Verifikation', 'Root-Cause in Lessons.md'] }]} />
      <FormattedText block text={`**Kann ich den Output subjektiv beurteilen?** Jein – und oftmals nicht. Die Code-Menge ist inzwischen kaum noch überschaubar, und meine Zeit ist stark begrenzt (ich entwickle Pokkum in meiner Freizeit). Genau deshalb ist die **Test-Suite so immens wichtig**: Sie wird zum objektiven Ersatz für das fehlende Vollverständnis.

**Vertraue ich dem Agent immer?** Auch nur „jein". Wenn ich unsicher war, habe ich **nicht** unbedingt selbst umgeschrieben – sondern **recherchiert und nachgeforscht**, bis ich die Sache einordnen konnte. Der Reflex „lieber selbst neu schreiben" tritt seltener auf als erwartet; das Vertrauensproblem wird meist über Verifikation und Recherche gelöst.`} />
    </Section>

    <Section id="pokkumOutcome" number={String(4).padStart(2, '0')} title={"Lessons Learned & Fazit"} >
      <FormattedText block text={`Hat sich Vibe-Coding für Pokkum gelohnt? **Ja, absolut.** Das Tool werde ich – sobald es getestet ist – auch für mein „zentrales" Projekt einsetzen, in dem ein wasserdichtes SvelteKit-Image nötig ist (genau das war ja der ursprüngliche Auslöser).

Das **grösste Learning** aus diesem Projekt ist klar die **Quality Control**: Wie gehe ich mit Agents um, die lügen? Wo und wie vertraue ich? Die Antwort lautet: *Vertraue nicht dem Wort des Agents, sondern dem Test, der Review, dem Diff.*`} />

      <Divider />

      <Callout label="Quality Control ist das eigentliche Thema" tone="warning">
        <FormattedText text={`Vibe-Coding verlagert die Herausforderung vom *Schreiben* zum *Prüfen*. Der Agent kann erstaunlich viel – aber er sagt dir nicht zuverlässig, wann er etwas nur halb kann. Die Antwort ist ein **mehrstufiges Verifikations-System**: klare Architektur-Invarianten im Systemprompt, eine strenge Test-Suite, unabhängige Clean-Context-Reviews und eine ehrliche Fehler-Kultur (Zero Silent Patching, Root-Cause in **Lessons.md**).`} />
      </Callout>

      <Callout label="Systemprompt > Prompt" tone="info">
        <FormattedText text={`Meine kurzen, „lausigen" Prompts funktionieren nur, weil die eigentliche Intelligenz im **auf den Agent zugeschnittenen Systemprompt** steckt. Wer Vibe-Coding ernst nimmt, investiert in die Spielregeln – nicht in die einzelne Anfrage.`} />
      </Callout>

      <Callout label="Selbst vertrauen schlägt Agent-Vertrauen" tone="success">
        <FormattedText text={`Die Grenze ist nicht „welche Domäne ist zu heikel", sondern *„kann ich es verifizieren"*. Solange adversiale Tests, Diffs und unabhängige Reviews das Ding stützen, kann man auch sicherheitskritische Bereiche vibe-coden. Das Vertrauen sitzt am Ende beim Menschen, der das Verifikations-System designed hat – nicht beim Modell.`} />
      </Callout>
    </Section>
  </CaseStudyShell>
</Shell>

<style>
  .wordmark {
    font-weight: 700;
  }
</style>
