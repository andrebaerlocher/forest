<script lang="ts">
  import Divider from "$lib/atoms/Divider.svelte";
  import Progress from "$lib/atoms/Progress.svelte";
  import SealButton from "$lib/atoms/SealButton.svelte";
  import Textarea from "$lib/atoms/Textarea.svelte";
  import ListRow from "$lib/molecules/ListRow.svelte";
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
    viewMode = $bindable("editor"),
    paletteOpen = $bindable(false),
    triggerCommand,
  }: Props = $props();

  // Text Editor interactive states
  let activeDocId = $state("doc-1");
  const documents = [
    {
      id: "doc-1",
      title: "Mountain and river",
      text: "One cup, one journey. The spring harvest opens with mist over the eastern ridge; the leaves are picked before the sun clears the valley floor.\n\nRolled by hand, dried on woven trays, the oolong keeps the shape of the wind that crossed it.\n\nSteep at ninety degrees, forty seconds, and the room smells of rain on warm stone.",
    },
    {
      id: "doc-2",
      title: "Tea notes, spring",
      text: "Notes from the spring harvest of 2026.\n\nThe Matcha fields have shown exceptional yield this year. The shade-grown process was extended by three days to enhance the chlorophyll intensity and sweet umami notes.",
    },
    {
      id: "doc-3",
      title: "Harvest ledger",
      text: "Harvest ledgers and transactions.\n\nTotal weight gathered: 394.0 kg.\nAverage price per kg: 45.00 oklch.\nTotal revenue estimate: 17 901.50 oklch.",
    },
    {
      id: "doc-4",
      title: "Packaging brief",
      text: "A Forest brand packaging guidelines.\n\nUse textured dark indigo paper wrapper with a linen tan ribbon seal. The edge boundary must represent the soft vertical wave pattern.",
    },
  ];
  let activeDoc = $derived(
    documents.find((d) => d.id === activeDocId) || documents[0],
  );
  let editorText = $state("");

  $effect(() => {
    // Sync text area value when active doc changes
    editorText = activeDoc.text;
  });

  let wordCount = $derived(
    editorText.trim().split(/\s+/).filter(Boolean).length,
  );
</script>

<div class="app-mockup-wrapper">
  <Shell bind:mode bind:hue showControls={false} hasSecondaryPanel={true}>
    <!-- Custom Left Rail Navigation Snippet -->
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

    <!-- Custom Secondary Nav Panel Snippet (List of docs) -->
    {#snippet spineChildren()}
      <span class="panel-section-title">Documents</span>
      <div class="documents-list">
        {#each documents as doc (doc.id)}
          <ListRow
            title={doc.title}
            subtitle="Tea ledger record"
            active={activeDocId === doc.id}
            onclick={() => (activeDocId = doc.id)}
          >
            {#snippet icon()}
              <svg viewBox="0 0 24 24"
                ><path
                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                /></svg
              >
            {/snippet}
          </ListRow>
        {/each}
      </div>
    {/snippet}

    <!-- Custom Header Snippet -->
    {#snippet header()}
      <AppHeader
        breadcrumbs={[{ label: "一席山水" }, { label: activeDoc.title }]}
        onsearch={() => (paletteOpen = true)}
      >
        <!-- Header action triggers -->
        <SealButton
          variant="primary"
          onclick={() => triggerCommand("export-ledger")}
          aria-label="Export document"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"
            /></svg
          >
        </SealButton>
      </AppHeader>
    {/snippet}

    <!-- Contextual Selection Strip Snippet -->
    {#snippet strip()}
      <ContextualStrip label="Selection">
        <SealButton aria-label="Bold font"
          ><svg viewBox="0 0 24 24"
            ><path
              d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10.25 6.5h3c1.1 0 2 .9 2 2s-.9 2-2 2h-3v-4zm3.5 9h-3.5v-4h3.5c1.1 0 2 .9 2 2s-.9 2-2 2z"
            /></svg
          ></SealButton
        >
        <SealButton aria-label="Italic font"
          ><svg viewBox="0 0 24 24"
            ><path
              d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"
            /></svg
          ></SealButton
        >
        <SealButton aria-label="Underline font"
          ><svg viewBox="0 0 24 24"
            ><path
              d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
            /></svg
          ></SealButton
        >
        <Divider orientation="vertical" />
        <SealButton aria-label="Delete text"
          ><svg viewBox="0 0 24 24"
            ><path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            /></svg
          ></SealButton
        >
        <SealButton aria-label="Share document"
          ><svg viewBox="0 0 24 24"
            ><path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"
            /></svg
          ></SealButton
        >
      </ContextualStrip>
    {/snippet}

    <!-- Interactive Text Editor Layout view -->
    <div class="editor-view-container">
      <input
        type="text"
        class="editor-title-input"
        value={activeDoc.title}
        aria-label="Document Title"
        readonly
      />
      <!-- dynamic wave progress as an active line loader spinner -->
      <Progress
        value={Math.min(100, Math.round((wordCount / 120) * 100))}
        class="editor-progress"
      />
      <Textarea
        class="editor-textarea"
        bind:value={editorText}
        placeholder="Start typing notes..."
        aria-label="Document Content"
      />
    </div>

    <!-- Status Bar Footer Snippet -->
    {#snippet footer()}
      <StatusBar>
        {#snippet left()}
          <span class="metric">{wordCount} words</span>
        {/snippet}
        {#snippet right()}
          <span class="metric">Page 1 of 1</span>
          <SealButton
            variant="default"
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

  /* Secondary panel documents styles */
  .panel-section-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: oklch(94.5% 0.012 95 / 40%);
    margin-bottom: 18px;
    padding-left: 12px;
  }

  .documents-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* Interactive Text Editor mockup layout */
  .editor-view-container {
    flex: 1;
    padding: 32px clamp(24px, 6vw, 64px);
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  .editor-title-input {
    background: transparent;
    border: none;
    font-family: var(--font-body);
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: var(--text-1);
    outline: none;
    margin-bottom: 6px;
    width: 100%;
  }

  :global(.editor-progress) {
    margin-bottom: 24px;
    width: 100%;
    max-width: 600px;
  }

  :global(.editor-textarea) {
    flex: 1;
    background: transparent;
    border: none;
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-2);
    resize: none;
    outline: none;
    width: 100%;
    padding: 0;
  }
</style>
