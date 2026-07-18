<script lang="ts">
  import Divider from "$lib/atoms/Divider.svelte";
  import SealButton from "$lib/atoms/SealButton.svelte";
  import TableCell from "$lib/atoms/TableCell.svelte";
  import Tabs from "$lib/molecules/Tabs.svelte";
  import AppHeader from "$lib/organisms/AppHeader.svelte";
  import ContextualStrip from "$lib/organisms/ContextualStrip.svelte";
  import StatusBar from "$lib/organisms/StatusBar.svelte";
  import Shell from "$lib/templates/Shell.svelte";

  interface Props {
    mode: "light" | "dark";
    hue: number;
    viewMode: string;
    paletteOpen: boolean;
    triggerCommand: (cmdId: string) => void;
  }

  let {
    mode = $bindable("light"),
    hue = $bindable(282),
    viewMode = $bindable("spreadsheet"),
    paletteOpen = $bindable(false),
    triggerCommand,
  }: Props = $props();

  // Spreadsheet interactive states
  let activeSheetTab = $state("harvest");
  let selectedCell = $state({ row: 3, col: "price" }); // Default selected cell D5 (River bend Price)
  let isEditingCell = $state(false);

  let sheetData = $state([
    { id: 1, garden: "Eastern ridge", kg: 128.4, price: 42.0 },
    { id: 2, garden: "Valley floor · refund", kg: 96.0, price: -38.5 },
    { id: 3, garden: "Mist terrace", kg: 54.2, price: 61.0 },
    { id: 4, garden: "River bend", kg: 73.6, price: 45.0 },
    { id: 5, garden: "Stone garden", kg: 41.8, price: 52.5 },
  ]);

  let sumKg = $derived(sheetData.reduce((acc, r) => acc + r.kg, 0));
  let sumTotal = $derived(
    sheetData.reduce((acc, r) => acc + r.kg * r.price, 0),
  );
  let avgPrice = $derived(
    sheetData.reduce((acc, r) => acc + Math.abs(r.price), 0) / sheetData.length,
  );

  let formulaBarVal = $derived.by(() => {
    if (selectedCell.row === null) return "";
    const row = sheetData[selectedCell.row];
    if (selectedCell.col === "garden") return row.garden;
    if (selectedCell.col === "kg") return `${row.kg}`;
    if (selectedCell.col === "price") return `${row.price}`;
    if (selectedCell.col === "total") return `=${row.kg}*${row.price}`;
    return "";
  });

  // Select a cell
  function selectCell(rowIdx: number, colKey: string) {
    selectedCell = { row: rowIdx, col: colKey };
    isEditingCell = false;
  }
</script>

<div class="app-mockup-wrapper">
  <Shell bind:mode bind:hue showControls={false} collapsed={true}>
    <!-- Custom Left Rail Snippet -->
    {#snippet rail()}
      <div class="rail-top">
        <!-- App logo icon -->
        <div class="app-logo">
          <svg viewBox="0 0 24 24" class="app-logo-svg">
            <path d="M12 2L4 16h5v6h6v-6h5L12 2z" />
          </svg>
        </div>
        <Divider orientation="horizontal" class="rail-divider" />
        <!-- Circular navigation seal buttons -->
        <SealButton
          variant={viewMode === "specimen" ? "active" : "default"}
          onclick={() => (viewMode = "specimen")}
          aria-label="Specimen Guide"
        >
          <svg viewBox="0 0 24 24"
            ><path d="M4 6H2v14c0 1.1.89 2 1.99 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" /></svg
          >
        </SealButton>
        <SealButton
          variant={viewMode === "editor" ? "active" : "default"}
          onclick={() => (viewMode = "editor")}
          aria-label="Text Editor Mode"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
            /></svg
          >
        </SealButton>
        <SealButton
          variant={viewMode === "spreadsheet" ? "active" : "default"}
          onclick={() => (viewMode = "spreadsheet")}
          aria-label="Spreadsheet Mode"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"
            /></svg
          >
        </SealButton>
      </div>
      <div class="rail-bottom">
        <div class="wordmark-vertical">A FOREST</div>
        <SealButton
          onclick={() => triggerCommand("toggle-mode")}
          aria-label="Toggle Box Mode"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L12 15v5c0 .35.15.66.41.87l.59.06z"
            /></svg
          >
        </SealButton>
      </div>
    {/snippet}

    <!-- Custom Header Snippet -->
    {#snippet header()}
      <AppHeader
        breadcrumbs={[
          { label: "Harvest ledger" },
          { label: "SPRING 2026" },
        ]}
        onsearch={() => (paletteOpen = true)}
      >
        <SealButton
          variant="primary"
          onclick={() => triggerCommand("export-ledger")}
          aria-label="Export CSV"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"
            /></svg
          >
        </SealButton>
      </AppHeader>
    {/snippet}

    <!-- Custom Formula Bar Strip Snippet -->
    {#snippet strip()}
      <ContextualStrip>
        <!-- Current cell index bubble -->
        <div class="formula-cell-indicator">
          {#if selectedCell.row !== null}
            {String.fromCharCode(
              65 +
                ["garden", "kg", "price", "total"].indexOf(
                  selectedCell.col,
                ),
            )}{selectedCell.row + 2}
          {:else}
            --
          {/if}
        </div>

        <!-- Dynamic editable formula input -->
        <div class="formula-bar-wrapper">
          <span class="formula-equals">=</span>
          <input
            type="text"
            class="formula-input"
            value={formulaBarVal}
            aria-label="Formula editor"
            oninput={(e) => {
              if (
                selectedCell.row !== null &&
                selectedCell.col !== "total"
              ) {
                const inputElement = e.currentTarget;
                if (selectedCell.col === "garden") {
                  sheetData[selectedCell.row].garden = inputElement.value;
                } else if (selectedCell.col === "kg") {
                  sheetData[selectedCell.row].kg =
                    parseFloat(inputElement.value) || 0;
                } else if (selectedCell.col === "price") {
                  sheetData[selectedCell.row].price =
                    parseFloat(inputElement.value) || 0;
                }
              }
            }}
          />
        </div>

        <Divider orientation="vertical" />
        <span class="strip-label">Range</span>
        <SealButton aria-label="Auto sum"
          ><svg viewBox="0 0 24 24"
            ><path d="M18 4H6v2l6 5-6 5v2h12v-3H9.5l4.5-4-4.5-4H18z" /></svg
          ></SealButton
        >
        <SealButton aria-label="Sort ledger"
          ><svg viewBox="0 0 24 24"
            ><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" /></svg
          ></SealButton
        >
      </ContextualStrip>
    {/snippet}

    <!-- Interactive Spreadsheet Data View -->
    <div class="spreadsheet-container">
      <table class="ledger-grid">
        <thead>
          <tr>
            <th class="row-index-head"></th>
            <th>GARDEN</th>
            <th class="num">KG</th>
            <th class="num col-active">PRICE</th>
            <th class="num">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {#each sheetData as row, rIdx (row.id)}
            <tr>
              <td class="row-index-cell">{rIdx + 1}</td>
              <!-- Garden name cell -->
              <TableCell
                selected={selectedCell.row === rIdx &&
                  selectedCell.col === "garden"}
                onclick={() => selectCell(rIdx, "garden")}
              >
                {row.garden}
              </TableCell>

              <!-- Kg cell -->
              <TableCell
                type="numeric"
                selected={selectedCell.row === rIdx &&
                  selectedCell.col === "kg"}
                onclick={() => selectCell(rIdx, "kg")}
              >
                {row.kg.toFixed(1)}
              </TableCell>

              <!-- Price cell (active col wash) -->
              <TableCell
                type="numeric"
                active={true}
                negative={row.price < 0}
                selected={selectedCell.row === rIdx &&
                  selectedCell.col === "price"}
                onclick={() => selectCell(rIdx, "price")}
              >
                {row.price < 0 ? "−" : ""}{Math.abs(row.price).toFixed(2)}
              </TableCell>

              <!-- Total computed cell -->
              <TableCell
                type="numeric"
                negative={row.kg * row.price < 0}
                selected={selectedCell.row === rIdx &&
                  selectedCell.col === "total"}
                onclick={() => selectCell(rIdx, "total")}
              >
                {row.kg * row.price < 0 ? "−" : ""}{Math.abs(
                  row.kg * row.price,
                ).toFixed(2)}
              </TableCell>
            </tr>
          {/each}

          <!-- SUM calculation row -->
          <tr class="sum-row">
            <td class="row-index-cell"></td>
            <td class="sum-label-cell">SUM</td>
            <td class="num sum-val-cell">{sumKg.toFixed(1)}</td>
            <td class="num col-active"></td>
            <td class="num sum-val-cell" class:neg={sumTotal < 0}>
              {sumTotal < 0 ? "−" : ""}{Math.abs(sumTotal).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Status Bar Footer Snippet -->
    {#snippet footer()}
      <StatusBar>
        {#snippet left()}
          <Tabs
            items={[
              { id: "harvest", label: "Harvest" },
              { id: "pricing", label: "Pricing" },
              { id: "notes", label: "Notes" },
            ]}
            bind:activeId={activeSheetTab}
          />
        {/snippet}
        {#snippet right()}
          <div class="metrics-summary">
            <span>Ø</span> <span class="metric">{avgPrice.toFixed(2)}</span>
            <span class="sep">·</span>
            <span>Σ</span>
            <span class="metric" class:neg-text={sumTotal < 0}
              >{sumTotal < 0 ? "−" : ""}{Math.abs(sumTotal).toFixed(
                2,
              )}</span
            >
          </div>
          <SealButton
            onclick={() => triggerCommand("theme-matcha")}
            aria-label="Toggle theme"
          >
            <svg viewBox="0 0 24 24"
              ><path
                d="M12 3a9 9 0 1 0 9 9 9.003 9.003 0 0 0-9-9zm0 16.2a7.2 7.2 0 1 1 7.2-7.2 7.208 7.208 0 0 1-7.2 7.2z"
              /></svg
            >
          </SealButton>
        {/snippet}
      </StatusBar>
    {/snippet}
  </Shell>
</div>

<style>
  /* App layouts container shell */
  .app-mockup-wrapper {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }

  /* Custom Left Rail styles inside mockups */
  .rail-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
  }

  .app-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
  }

  .app-logo-svg {
    width: 20px;
    height: 20px;
    fill: var(--accent);
  }

  :global(.rail-divider) {
    width: 24px !important;
    margin: 4px 0 !important;
  }

  .rail-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .wordmark-vertical {
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5em;
    color: oklch(94.5% 0.012 95 / 40%);
    writing-mode: vertical-lr;
    text-orientation: mixed;
    transform: rotate(180deg);
    user-select: none;
    margin: 32px 0;
  }

  /* Spreadsheet mockup layout */
  .spreadsheet-container {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .spreadsheet-container::-webkit-scrollbar {
    width: 8px;
  }

  .spreadsheet-container::-webkit-scrollbar-thumb {
    background: var(--scroll-thumb);
    border-radius: 4px;
  }

  .ledger-grid {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .ledger-grid th,
  .ledger-grid td {
    padding: var(--pad-cell-y) 12px;
    font-size: var(--font-data);
    text-align: left;
    transition: padding var(--t-fast) var(--ease);
  }

  .ledger-grid th {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    border-bottom: 1.5px solid var(--line-mid);
  }

  .ledger-grid .num {
    text-align: right;
  }

  .ledger-grid th.num {
    font-family: var(--font-body);
    color: var(--text-3);
  }

  .ledger-grid .col-active {
    background: var(--wash);
  }

  .ledger-grid tr {
    border-bottom: 1px solid var(--line-soft);
  }

  .row-index-head,
  .row-index-cell {
    width: 48px;
    text-align: center !important;
    font-family: var(--font-num);
    color: var(--text-3);
    font-size: 11px;
    user-select: none;
    background: transparent !important;
    border-right: 1px solid var(--line-soft);
  }

  /* Sum totals calculations row */
  .sum-row {
    border-top: 1.5px solid var(--line-strong) !important;
    border-bottom: none !important;
  }

  .sum-label-cell {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-1);
    font-weight: 500;
  }

  .sum-val-cell {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-weight: 500;
    color: var(--text-1);
  }

  .sum-val-cell.neg {
    color: var(--danger) !important;
  }

  /* Formula Bar elements */
  .formula-cell-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    font-family: var(--font-num);
    font-size: 12px;
    color: var(--text-1);
    height: 28px;
    width: 40px;
    font-weight: 400;
  }

  .formula-bar-wrapper {
    display: flex;
    align-items: center;
    background: var(--raised);
    border: 1.5px solid var(--line-mid);
    border-radius: var(--radius-s);
    padding: 0 10px;
    height: 28px;
    flex: 1;
    max-width: 320px;
  }

  .formula-equals {
    font-family: var(--font-num);
    font-size: 14px;
    color: var(--text-3);
    margin-right: 6px;
    user-select: none;
  }

  .formula-input {
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-num);
    font-size: 13px;
    color: var(--text-1);
    width: 100%;
    padding: 0;
  }

  .metrics-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 11.5px;
    color: var(--text-3);
  }

  .metrics-summary .sep {
    opacity: 0.4;
  }

  .neg-text {
    color: var(--danger) !important;
  }
</style>
