<script lang="ts">
  import Button from "$lib/atoms/Button.svelte";
  import Checkbox from "$lib/atoms/Checkbox.svelte";
  import Input from "$lib/atoms/Input.svelte";
  import Radio from "$lib/atoms/Radio.svelte";
  import Select from "$lib/atoms/Select.svelte";
  import Switch from "$lib/atoms/Switch.svelte";
  import Tag from "$lib/atoms/Tag.svelte";
  import FormField from "$lib/molecules/FormField.svelte";
  import Slip from "$lib/molecules/Slip.svelte";
  import LedgerTable from "$lib/organisms/LedgerTable.svelte";
  import Shell from "$lib/templates/Shell.svelte";

  interface Props {
    mode: "light" | "dark";
    hue: number;
    density: string;
  }

  let {
    mode = $bindable("light"),
    hue = $bindable(282),
    density = $bindable("comfortable"),
  }: Props = $props();

  // Specimen states
  let organic = $state(true);
  let shadeGrown = $state(false);
  let season = $state("spring");
  let published = $state(true);
  let gardenName = $state("");
  let price = $state("−12.00");
  let activeCol = $state("Price");

  const links = [
    { href: "#concept", label: "Concept" },
    { href: "#color", label: "Color & themes" },
    { href: "#status", label: "Status colors" },
    { href: "#type", label: "Typography" },
    { href: "#wave-s", label: "The wave edge" },
    { href: "#ledger", label: "Ledger & cells" },
    { href: "#atoms", label: "Component recipes" },
    { href: "#slips", label: "Slips" },
    { href: "#density", label: "Density" },
    { href: "#scroll", label: "Scrollbars" },
    { href: "#rules", label: "Rules" },
  ];

  function toggleDensity(newDensity: string) {
    density = newDensity;
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-density", newDensity);
    }
  }

  const setComfortable = () => toggleDensity("comfortable");
  const setCompact = () => toggleDensity("compact");
</script>

<Shell
  wordmark="A Forest"
  wordmarkSub="Design system · v0.2"
  {links}
  bind:mode
  bind:hue
>
  <section id="concept" class="concept-sec">
    <span class="eyebrow">Concept</span>
    <h1>The interface is a tea box.</h1>
    <p class="lede">
      Two materials, one seam. Paper carries the work; ink carries the tools.
      They never meet in a straight line — the boundary is the wave. Light
      mode is the closed lid; dark mode is the opened box, tone-on-tone. One
      thing never changes: the linen tan, the fixed point of the system. Every
      rule below is derivable from this paragraph. If a component decision
      isn't, the decision is wrong or the paragraph is.
    </p>
  </section>

  <section id="color" class="section-spaced">
    <span class="eyebrow">Foundations</span>
    <h2>Color &amp; themes — OKLCH</h2>
    <p>
      All ink colors live in OKLCH as an <strong>ink ladder</strong>: five
      lightness steps at one chroma band (0.045–0.055) and one hue. Theming an
      app means rotating <code>--hue</code> — try the slider in the spine. Paper,
      the tan accent, and the status hues never rotate; they are the materials that
      stay on the table while the ink changes.
    </p>

    <h3>Surfaces &amp; ink</h3>
    <div class="swatch-grid">
      <div class="swatch">
        <div class="swatch-chip swatch-spine"></div>
        <div class="swatch-meta">
          <strong>spine</strong><code>ink-2 / ink-1</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip swatch-panel"></div>
        <div class="swatch-meta">
          <strong>panel</strong><code>ink-3 / ink-2</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip swatch-canvas"></div>
        <div class="swatch-meta">
          <strong>canvas</strong><code>paper / ink-3</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip swatch-raised"></div>
        <div class="swatch-meta">
          <strong>raised</strong><code>paper+ / ink-4</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip swatch-accent"></div>
        <div class="swatch-meta">
          <strong>accent · fixed</strong><code>oklch(73.5% .058 70)</code>
        </div>
      </div>
      <div class="swatch">
        <div class="swatch-chip swatch-text3"></div>
        <div class="swatch-meta">
          <strong>text-3</strong><code>warm / ink-tinted</code>
        </div>
      </div>
    </div>
  </section>

  <section id="status" class="section-spaced">
    <span class="eyebrow">Foundations</span>
    <h2>Status colors</h2>
    <p>
      Ledger logic: status is <strong>ink, not paint</strong>. Red ink for
      negative numbers is two centuries of bookkeeping — status colors appear
      as text, icons, thin rules, and dots, never as large fills or tinted
      panels. Fixed hues; only lightness flips between modes.
    </p>
    <div class="demo-row">
      <span class="status-indicator danger-text"
        ><i class="dot"></i>Overdue · −1 240.00</span
      >
      <span class="status-indicator success-text"
        ><i class="dot"></i>Paid in full</span
      >
      <span class="status-indicator warning-text"
        ><i class="dot"></i>Stock below reorder point</span
      >
    </div>
  </section>

  <section id="type" class="section-spaced">
    <span class="eyebrow">Foundations</span>
    <h2>Typography</h2>
    <p>
      One family, two voices: <strong>Lexend</strong> for text,
      <strong>Illinois Mono</strong> for numbers. No display serif — brand moments
      are letterspacing, weight 500, uppercase. The mono/sans split doubles as data
      typing.
    </p>
    <div class="spec">
      <div class="spec-label">Wordmark · Lexend 500 · .5em</div>
      <div class="spec-val wordmark-demo">A Forest</div>
    </div>
    <div class="spec">
      <div class="spec-label">Title · 30/1.3 · Lexend 300</div>
      <div class="spec-val title-demo">A seat among mountains</div>
    </div>
    <div class="spec">
      <div class="spec-label">Body · 15/1.75 · Lexend 300</div>
      <div class="spec-val">Rolled by hand, dried on woven trays.</div>
    </div>
    <div class="spec">
      <div class="spec-label">Micro-label · 11 · 500 · .35em</div>
      <div class="spec-val micro-demo">Mountain and river</div>
    </div>
    <div class="spec">
      <div class="spec-label">Numbers · Illinois Mono · tabular</div>
      <div class="spec-val num-demo">17 901.50 · =C5*B5 · ⌘K</div>
    </div>
  </section>

  <section id="ledger" class="section-spaced">
    <span class="eyebrow">Patterns</span>
    <h2>Ledger &amp; cells</h2>
    <p>
      Horizontal hairlines only; vertical structure is a wash, never a line.
      The 1.5 px strong rule means <em>total</em>. Negative numbers set in
      danger ink.
    </p>
    <LedgerTable bind:activeCol />

    <h3 class="sub-title">Cell states</h3>
    <div class="demo-row">
      <div class="state-item">
        <span class="cellbox">45.00</span>
        <div class="state-label">Idle</div>
      </div>
      <div class="state-item">
        <span class="cellbox hover-state">45.00</span>
        <div class="state-label">Hover</div>
      </div>
      <div class="state-item">
        <span class="cellbox selected">45.00</span>
        <div class="state-label">Selected</div>
      </div>
      <div class="state-item">
        <span class="cellbox editing">45.0|</span>
        <div class="state-label">Editing</div>
      </div>
    </div>
  </section>

  <section id="atoms" class="section-spaced">
    <span class="eyebrow">Component recipes</span>
    <h2 class="sec-title">Atoms</h2>

    <h3 class="sub-title">Buttons</h3>
    <div class="demo-row">
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete garden</Button>
      <Button variant="primary" disabled>Save changes</Button>
    </div>

    <h3 class="sub-title">Inputs</h3>
    <div class="demo-row demo-row-top">
      <FormField
        label="Garden name"
        id="in1"
        hint="Visible on the harvest ledger."
      >
        <Input id="in1" placeholder="Eastern ridge" bind:value={gardenName} />
      </FormField>
      <FormField
        label="Price / kg"
        id="in2"
        error="Price can't be negative."
        invalid={true}
      >
        <Input id="in2" bind:value={price} invalid={true} isNumeric={true} />
      </FormField>
      <FormField label="Season" id="in3">
        <Select id="in3" bind:value={season}>
          <option value="spring">Spring</option>
          <option value="autumn">Autumn</option>
        </Select>
      </FormField>
    </div>

    <h3 class="sub-title">Checkbox · Radio · Switch</h3>
    <div class="demo-row">
      <Checkbox bind:checked={organic}>Organic</Checkbox>
      <Checkbox bind:checked={shadeGrown}>Shade-grown</Checkbox>
      <Radio name="season" bind:group={season} value="spring">Spring</Radio>
      <Radio name="season" bind:group={season} value="autumn">Autumn</Radio>
      <Switch bind:checked={published}>Published</Switch>
    </div>

    <h3 class="sub-title">Tags &amp; micro-labels</h3>
    <div class="demo-row">
      <Tag>Oolong</Tag>
      <Tag>Spring 2026</Tag>
      <Tag variant="accent">Featured</Tag>
    </div>
  </section>

  <section id="slips" class="section-spaced">
    <span class="eyebrow">Component recipes</span>
    <h2 class="sec-title">Slips — the card, disciplined</h2>
    <p>
      Shadow exists in one state only: while dragged. Otherwise they remain
      flat against the page.
    </p>
    <div class="demo-row demo-row-stretch">
      <Slip>
        <div class="stat-num">17 901.50</div>
        <div class="stat-label">Revenue · Spring</div>
      </Slip>
      <Slip>
        <div class="stat-num neg-stat">−4.2%</div>
        <div class="stat-label">Vs. last harvest</div>
      </Slip>
      <Slip dragging={true}>
        <div class="stat-num">Order 5511</div>
        <div class="stat-label">Dragging · only shadow state</div>
      </Slip>
    </div>
  </section>

  <section id="wave-s" class="section-spaced">
    <span class="eyebrow">Signature</span>
    <h2 class="sec-title">The wave edge</h2>
    <div class="wave-demo" aria-hidden="true">
      <div class="left"></div>
      <div class="join">
        <svg viewBox="0 0 26 130" preserveAspectRatio="none">
          <path
            d="M0,0 L14,0 C22,12 6,25 12,40 C18,55 4,66 10,82 C17,98 5,110 11,122 C13,127 10,128 12,130 L0,130 Z"
          />
        </svg>
      </div>
      <div class="right"></div>
    </div>
    <p class="caption">
      One wave per <strong>persistent</strong> surface. Transient surfaces — palette,
      drawer, toast — may carry it, because they are pieces of the box moving. Amplitude:
      26 px documents, 12 px spreadsheets. Irregular control points; a perfect sine
      reads as decoration.
    </p>
  </section>

  <section id="density" class="section-spaced">
    <span class="eyebrow">Modes</span>
    <h2 class="sec-title">Density</h2>
    <p>
      A second attribute next to mode: <code
        >data-density="comfortable | compact"</code
      >. It remaps three tokens — <code>--pad-cell-y</code>,
      <code>--pad-control-y</code>, and <code>--font-data</code> — and every table,
      input, and button follows.
    </p>
    <div class="demo-row">
      <Button
        onclick={setComfortable}
        variant={density === "comfortable" ? "primary" : "secondary"}
        >Comfortable</Button
      >
      <Button
        onclick={setCompact}
        variant={density === "compact" ? "primary" : "secondary"}
        >Compact</Button
      >
    </div>
  </section>

  <section id="scroll" class="section-spaced">
    <span class="eyebrow">Modes</span>
    <h2 class="sec-title">Scrollbars</h2>
    <p>
      Default scrollbars are foreign chrome on paper. Two sanctioned
      treatments: <strong>styled-minimal</strong> (default) — thin thumb in
      <code>--scroll-thumb</code>
      (ink at 20% / paper at 18%), transparent track; and
      <strong>hidden</strong> — allowed only where the component carries its own
      position indicator. Never hidden on long-form reading surfaces.
    </p>
    <div class="scroll-demo">
      <p>
        Steep at ninety degrees, forty seconds, and the room smells of rain on
        warm stone.
      </p>
      <p>
        The spring harvest opens with mist over the eastern ridge; leaves are
        picked before the sun clears the valley floor.
      </p>
      <p>
        Rolled by hand, dried on woven trays, the oolong keeps the shape of
        the wind that crossed it.
      </p>
      <p>One cup, one journey.</p>
    </div>
  </section>

  <section id="rules" class="section-spaced-bottom">
    <span class="eyebrow">Discipline</span>
    <h2 class="sec-title">Rules</h2>
    <div class="rules">
      <div class="rule do">
        <div class="cap">Do</div>
        Theme by rotating<code>--hue</code> only; a theme is one number plus passing
        contrast tests.
      </div>
      <div class="rule dont">
        <div class="cap">Don't</div>
        Rotate paper, accent, or status hues — the materials stay on the table.
      </div>
      <div class="rule do">
        <div class="cap">Do</div>
        Use status as ink: text, dots, thin rules, negative numbers.
      </div>
      <div class="rule dont">
        <div class="cap">Don't</div>
        Paint status: no tinted panels, no filled red buttons, no large fills.
      </div>
      <div class="rule do">
        <div class="cap">Do</div>
        Prefer ledger rows and hairline regions; use slips only for truly bounded
        objects.
      </div>
      <div class="rule dont">
        <div class="cap">Don't</div>
        Shadow anything at rest. Elevation is a z-token; shadow is drag or entry.
      </div>
      <div class="rule do">
        <div class="cap">Do</div>
        Reserve Svelte transitions for transient surfaces; move position via transform
        only.
      </div>
      <div class="rule dont">
        <div class="cap">Don't</div>
        Animate persistent layout, scroll position, or anything at all under reduced-motion.
      </div>
      <div class="rule do">
        <div class="cap">Do</div>
        Keep the tan accent to three appearances per view; focus ring is always
        tan.
      </div>
      <div class="rule dont">
        <div class="cap">Don't</div>
        Ship default scrollbars, mono text-strings, a second resting wave, or neutral
        greys on ink.
      </div>
    </div>
  </section>
</Shell>

<style>
  .concept-sec {
    margin-top: 0;
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
    display: block;
  }

  .lede {
    font-size: 16px;
    max-width: 62ch;
  }

  .section-spaced {
    margin-top: 84px;
  }

  .section-spaced-bottom {
    margin-top: 84px;
    padding-bottom: 96px;
  }

  .sec-title {
    font-size: 21px;
    font-weight: 400;
    letter-spacing: 0.03em;
    color: var(--text-1);
    margin: 0 0 16px;
  }

  .sub-title {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--text-1);
    margin: 34px 0 10px;
  }

  /* Swatches styling */
  .swatch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
    gap: 12px;
    margin: 20px 0 8px;
  }

  .swatch {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    overflow: hidden;
  }

  .swatch-chip {
    height: 62px;
  }

  .swatch-spine {
    background: var(--spine);
  }
  .swatch-panel {
    background: var(--panel);
  }
  .swatch-canvas {
    background: var(--canvas);
    border-bottom: 1px solid var(--line-mid);
  }
  .swatch-raised {
    background: var(--raised);
    border-bottom: 1px solid var(--line-mid);
  }
  .swatch-accent {
    background: var(--accent);
  }
  .swatch-text3 {
    background: var(--text-3);
  }

  .swatch-meta {
    padding: 9px 12px 11px;
    font-size: 12px;
    line-height: 1.5;
  }

  .swatch-meta strong {
    display: block;
    font-weight: 500;
    color: var(--text-1);
    letter-spacing: 0.04em;
  }

  .swatch-meta code {
    background: none;
    padding: 0;
    color: var(--text-3);
    font-size: 11px;
  }

  /* Specimens list styling */
  .spec {
    border-top: 1px solid var(--line-soft);
    padding: 15px 0;
    display: flex;
    gap: 24px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .spec-label {
    width: 190px;
    flex-shrink: 0;
    font-size: 11.5px;
    color: var(--text-3);
    letter-spacing: 0.06em;
    line-height: 1.6;
  }

  .spec-val {
    color: var(--text-1);
  }

  .wordmark-demo {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5em;
    text-transform: uppercase;
  }

  .title-demo {
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 0.04em;
  }

  .micro-demo {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .num-demo {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
  }

  .demo-row {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    align-items: center;
    margin: 16px 0 4px;
  }

  .demo-row-top {
    align-items: flex-start;
  }

  .demo-row-stretch {
    align-items: stretch;
  }

  .status-indicator {
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-right: 22px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    background: currentColor;
  }

  .danger-text {
    color: var(--danger);
  }

  .success-text {
    color: var(--success);
  }

  .warning-text {
    color: var(--warning);
  }

  .state-item {
    text-align: center;
  }

  .hover-state {
    background: var(--wash-hover);
  }

  .state-label {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-top: 8px;
  }

  .neg-stat {
    color: var(--danger);
  }

  /* Wave and Scroll Specimen styling */
  .wave-demo {
    display: flex;
    height: 130px;
    border-radius: var(--radius-m);
    overflow: hidden;
    border: 1px solid var(--line-mid);
    margin: 18px 0 6px;
    max-width: 640px;
  }

  .wave-demo .left {
    width: 90px;
    background: var(--spine);
    transition: background var(--t-slow) var(--ease);
  }

  .wave-demo .join {
    width: 26px;
    position: relative;
  }

  .wave-demo .join svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .wave-demo .join path {
    fill: var(--spine);
    transition: fill var(--t-slow) var(--ease);
  }

  .wave-demo .right {
    flex: 1;
    background: var(--canvas);
    transition: background var(--t-slow) var(--ease);
  }

  .scroll-demo {
    max-width: 640px;
    height: 110px;
    overflow-y: auto;
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    padding: 12px 16px;
    font-size: 13px;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .scroll-demo::-webkit-scrollbar {
    width: 8px;
  }

  .scroll-demo::-webkit-scrollbar-track {
    background: transparent;
  }

  .scroll-demo::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .rules {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 14px;
    margin-top: 20px;
  }

  .rule {
    border: 1px solid var(--line-mid);
    border-radius: var(--radius-m);
    padding: 15px 18px;
    font-size: 13.5px;
  }

  .rule .cap {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .rule.do .cap {
    color: var(--accent-ink);
  }

  .rule.dont .cap {
    color: var(--text-3);
    text-decoration: line-through;
    text-decoration-thickness: 1px;
  }
</style>
