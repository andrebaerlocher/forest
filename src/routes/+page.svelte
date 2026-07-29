<script lang="ts">
  import SegmentedControl from "$lib/molecules/SegmentedControl.svelte";
  import CommandPalette from "$lib/organisms/CommandPalette.svelte";
  import ToastRegion from "$lib/organisms/ToastRegion.svelte";
  import { toaster } from "$lib/stores/toaster.svelte.js";
  import CrmView from "$lib/templates/CrmView.svelte";
  import EditorView from "$lib/templates/EditorView.svelte";
  // Import the extracted views
  import SpecimenView from "$lib/templates/SpecimenView.svelte";
  import SpreadsheetView from "$lib/templates/SpreadsheetView.svelte";

  // View state switcher
  let viewMode = $state("specimen"); // 'specimen' | 'editor' | 'spreadsheet' | 'crm'

  // Global design states
  let mode: "light" | "dark" = $state("light");
  let hue = $state(282);
  let density = $state("comfortable");

  // Global overlay triggers
  let paletteOpen = $state(false);

  // The palette owns no data of its own — the app supplies its commands
  const commands = [
    { id: "open-doc", label: "Open document...", shortcut: "⌘O" },
    { id: "new-doc", label: "Create new tea note", shortcut: "⌘N" },
    { id: "export-ledger", label: "Export ledger to CSV", shortcut: "⌘E" },
    { id: "theme-matcha", label: "Switch to Matcha theme", shortcut: "⌥M" },
    { id: "theme-oolong", label: "Switch to Oolong theme", shortcut: "⌥O" },
    {
      id: "toggle-mode",
      label: "Open / close the box lid (Toggle Mode)",
      shortcut: "⌘D",
    },
  ];

  function triggerCommand(cmdId: string) {
    if (cmdId === "toggle-mode") {
      mode = mode === "light" ? "dark" : "light";
      toaster.push(
        mode === "light"
          ? "Closed the dark box (Light Mode)"
          : "Opened the dark box (Dark Mode)",
      );
    } else if (cmdId === "theme-matcha") {
      hue = 165;
      toaster.success("Switched to Matcha green theme");
    } else if (cmdId === "theme-oolong") {
      hue = 282;
      toaster.success("Switched to Oolong indigo theme");
    } else {
      toaster.push(`Command executed: ${cmdId}`);
    }
  }
</script>

<div class="app-theme-ground" data-mode={mode} style="--hue: {hue};">
  <!-- Top View Switcher Menu Bar -->
  <div class="view-mode-bar">
    <span class="bar-title">View Showcase</span>
    <SegmentedControl
      items={[
        { id: "specimen", label: "Specimen Guide" },
        { id: "editor", label: "Text Editor Mockup" },
        { id: "spreadsheet", label: "Spreadsheet Mockup" },
        { id: "crm", label: "CRM Mockup" },
      ]}
      bind:activeId={viewMode}
    />
  </div>

  {#if viewMode === "specimen"}
    <SpecimenView bind:mode bind:hue bind:density />
  {:else if viewMode === "editor"}
    <EditorView
      bind:mode
      bind:hue
      bind:viewMode
      bind:paletteOpen
      {triggerCommand}
    />
  {:else if viewMode === "spreadsheet"}
    <SpreadsheetView
      bind:mode
      bind:hue
      bind:viewMode
      bind:paletteOpen
      {triggerCommand}
    />
  {:else if viewMode === "crm"}
    <CrmView
      bind:mode
      bind:hue
      bind:viewMode
      bind:paletteOpen
      {triggerCommand}
    />
  {/if}

  <!-- One region for the whole app; toasts stack rather than replace -->
  <ToastRegion />

  <!-- Command Palette modal overlay -->
  <CommandPalette
    open={paletteOpen}
    {commands}
    onclose={() => (paletteOpen = false)}
    onselect={triggerCommand}
  />
</div>

<style>
  .app-theme-ground {
    min-height: 100vh;
    background: var(--canvas);
    color: var(--text-1);
    transition: background var(--t-slow) var(--ease), color var(--t-slow) var(--ease);
  }
  /* Floating switch bar styles */
  .view-mode-bar {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    background: var(--raised);
    border: 1.5px solid var(--accent);
    border-radius: var(--radius-m);
    box-shadow: var(--shadow-drag);
  }

  /* The app rail becomes a fixed bottom bar below 760px; lift the demo
     switcher clear of it so both stay usable. */
  @media (max-width: 760px) {
    .view-mode-bar {
      bottom: calc(72px + env(safe-area-inset-bottom, 0px));
      max-width: calc(100vw - 24px);
      gap: 8px;
      padding: 6px 10px;
    }
  }

  /* Adjust theme modes for the float bar */
  [data-mode="dark"] .view-mode-bar {
    background: var(--panel);
  }

  .bar-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-3);
  }
</style>
