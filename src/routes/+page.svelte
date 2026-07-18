<script lang="ts">
  import SegmentedControl from "$lib/molecules/SegmentedControl.svelte";
  import Toast from "$lib/molecules/Toast.svelte";
  import CommandPalette from "$lib/organisms/CommandPalette.svelte";
  import EditorView from "$lib/templates/EditorView.svelte";
  // Import the extracted views
  import SpecimenView from "$lib/templates/SpecimenView.svelte";
  import SpreadsheetView from "$lib/templates/SpreadsheetView.svelte";

  // View state switcher
  let viewMode = $state("specimen"); // 'specimen' | 'editor' | 'spreadsheet'

  // Global design states
  let mode: "light" | "dark" = $state("light");
  let hue = $state(282);
  let density = $state("comfortable");

  // Global overlay triggers
  let paletteOpen = $state(false);
  let toastOpen = $state(false);
  let toastMessage = $state("");
  let toastTimeout: any;

  function triggerCommand(cmdId: string) {
    if (typeof window !== "undefined") {
      clearTimeout(toastTimeout);
    }

    if (cmdId === "toggle-mode") {
      mode = mode === "light" ? "dark" : "light";
      toastMessage =
        mode === "light"
          ? "Closed the dark box (Light Mode)"
          : "Opened the dark box (Dark Mode)";
      toastOpen = true;
    } else if (cmdId === "theme-matcha") {
      hue = 165;
      toastMessage = "Switched to Matcha green theme";
      toastOpen = true;
    } else if (cmdId === "theme-oolong") {
      hue = 282;
      toastMessage = "Switched to Oolong indigo theme";
      toastOpen = true;
    } else {
      toastMessage = `Command executed: ${cmdId}`;
      toastOpen = true;
    }

    if (typeof window !== "undefined") {
      toastTimeout = setTimeout(() => {
        toastOpen = false;
      }, 3500);
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
  {/if}

  <!-- Toast message overlays -->
  <Toast
    open={toastOpen}
    message={toastMessage}
    onclose={() => (toastOpen = false)}
  />

  <!-- Command Palette modal overlay -->
  <CommandPalette
    open={paletteOpen}
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
