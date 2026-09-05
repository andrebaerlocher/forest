<script lang="ts">
  import Avatar from "../atoms/Avatar.svelte";
  import Divider from "../atoms/Divider.svelte";
  import SealButton from "../atoms/SealButton.svelte";
  import Wordmark from "../atoms/Wordmark.svelte";
  import ActivityItem from "../molecules/ActivityItem.svelte";
  import Combobox from "../molecules/Combobox.svelte";
  import DatePicker from "../molecules/DatePicker.svelte";
  import ListRow from "../molecules/ListRow.svelte";
  import StatusPill from "../molecules/StatusPill.svelte";
  import Tooltip from "../molecules/Tooltip.svelte";
  import AppHeader from "../organisms/AppHeader.svelte";
  import ContextualStrip from "../organisms/ContextualStrip.svelte";
  import DataTable from "../organisms/DataTable.svelte";
  import StatusBar from "../organisms/StatusBar.svelte";
  import Timeline from "../organisms/Timeline.svelte";
  import Shell from "./Shell.svelte";

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
    viewMode = $bindable("crm"),
    paletteOpen = $bindable(false),
    triggerCommand,
  }: Props = $props();

  // Phone only: the secondary panel drawer. Bindable through Shell -> Spine
  // so Escape and the scrim reach this trigger's aria-expanded.
  let panelOpen = $state(false);

  const views = [
    { id: "pipeline", label: "Pipeline" },
    { id: "accounts", label: "Accounts" },
    { id: "contacts", label: "Contacts" },
  ];
  let activeView = $state("pipeline");

  const owners = [
    { id: "u1", label: "Ada Fen", meta: "Sales" },
    { id: "u2", label: "Ren Okada", meta: "Sales" },
    { id: "u3", label: "Mira Holt", meta: "Partnerships" },
    { id: "u4", label: "Jonas Weiss", meta: "Sales" },
  ];
  let ownerFilter = $state<string | null>(null);
  let followUp = $state("2026-08-14");

  const columns = [
    { key: "account", label: "Account", sortable: true },
    { key: "owner", label: "Owner", width: "18%" },
    { key: "stage", label: "Stage", width: "16%" },
    {
      key: "value",
      label: "Value",
      type: "numeric" as const,
      width: "16%",
      sortable: true,
      active: true,
    },
  ];

  const deals = [
    { id: 1, account: "Eastern Ridge Tea Co.", owner: "Ada Fen", stage: "won", value: 48200 },
    { id: 2, account: "Valley Floor Imports", owner: "Ren Okada", stage: "at-risk", value: -3696 },
    { id: 3, account: "Mist Terrace Roasters", owner: "Mira Holt", stage: "open", value: 21400 },
    { id: 4, account: "River Bend Provisions", owner: "Ada Fen", stage: "open", value: 15750 },
    { id: 5, account: "Stone Garden Group", owner: "Jonas Weiss", stage: "stalled", value: 9300 },
  ];

  const stageStatus: Record<string, "neutral" | "success" | "warning" | "danger"> = {
    won: "success",
    open: "neutral",
    stalled: "warning",
    "at-risk": "danger",
  };

  const stageLabel: Record<string, string> = {
    won: "Won",
    open: "Open",
    stalled: "Stalled",
    "at-risk": "At risk",
  };

  let sort = $state<{ key: string; dir: "asc" | "desc" } | null>({
    key: "value",
    dir: "desc",
  });
  let selectedIds = $state<Array<string | number>>([]);

  let filtered = $derived(
    ownerFilter
      ? deals.filter((d) => d.owner === owners.find((o) => o.id === ownerFilter)?.label)
      : deals,
  );

  let sortedDeals = $derived.by(() => {
    if (!sort) return filtered;
    const { key, dir } = sort;
    return [...filtered].sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  let pipelineTotal = $derived(filtered.reduce((acc, d) => acc + d.value, 0));

  function money(n: number): string {
    const abs = Math.abs(n).toLocaleString("de-CH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${n < 0 ? "−" : ""}${abs}`;
  }
</script>

<div class="app-mockup-wrapper">
  <Shell bind:mode bind:hue showControls={false} bind:panelOpen hasSecondaryPanel={true}>
    {#snippet rail()}
      <div class="rail-top">
        <div class="app-logo">
          <svg viewBox="0 0 24 24" class="app-logo-svg">
            <path d="M12 2L4 16h5v6h6v-6h5L12 2z" />
          </svg>
        </div>
        <Divider orientation="horizontal" class="rail-divider" />
        <SealButton
          variant={viewMode === "specimen" ? "active" : "default"}
          onclick={() => (viewMode = "specimen")}
          aria-label="Specimen Guide"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M4 6H2v14c0 1.1.89 2 1.99 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"
            /></svg
          >
        </SealButton>
        <SealButton
          variant="active"
          onclick={() => (viewMode = "crm")}
          aria-label="CRM"
        >
          <svg viewBox="0 0 24 24"
            ><path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            /></svg
          >
        </SealButton>
      </div>
    {/snippet}

    {#snippet railFooter()}
      <div class="rail-bottom">
        <Wordmark text="A Forest" />
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

    {#snippet spineChildren()}
      <span class="panel-section-title">Views</span>
      <div class="views-list">
        {#each views as view (view.id)}
          <ListRow
            variant="nav"
            title={view.label}
            active={activeView === view.id}
            onclick={() => (activeView = view.id)}
          >
            {#snippet icon()}
              <svg viewBox="0 0 24 24"
                ><path d="M3 5h18M3 12h18M3 19h18" /></svg
              >
            {/snippet}
          </ListRow>
        {/each}
      </div>
    {/snippet}

    {#snippet header()}
      <AppHeader
        breadcrumbs={[{ label: "一席山水" }, { label: "Pipeline" }]}
        onsearch={() => (paletteOpen = true)}
      >
        {#snippet leading()}
          <span class="nav-trigger">
            <SealButton
              onclick={() => (panelOpen = true)}
              aria-label="Open navigation"
              aria-expanded={panelOpen}
              aria-haspopup="dialog"
            >
              <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </SealButton>
          </span>
        {/snippet}
        <Tooltip text="New deal">
          <SealButton
            variant="primary"
            onclick={() => triggerCommand("new-deal")}
            aria-label="New deal"
          >
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          </SealButton>
        </Tooltip>
      </AppHeader>
    {/snippet}

    {#snippet strip()}
      <ContextualStrip label="Filter">
        <div class="filter-control">
          <Combobox
            items={owners}
            bind:value={ownerFilter}
            placeholder="All owners"
          />
        </div>
        <Divider orientation="vertical" />
        <span class="strip-label">Follow-up</span>
        <DatePicker bind:value={followUp} />
        {#if selectedIds.length > 0}
          <Divider orientation="vertical" />
          <span class="selection-count">{selectedIds.length} selected</span>
        {/if}
      </ContextualStrip>
    {/snippet}

    <div class="crm-body">
      <section class="table-region">
        <DataTable
          {columns}
          rows={sortedDeals}
          bind:sort
          bind:selectedIds
          selectable
          emptyTitle="No deals"
          emptyDescription="No deals match this owner filter."
          onrowclick={() => {}}
        >
          {#snippet cell(row, col)}
            {#if col.key === "owner"}
              <span class="owner-cell">
                <Avatar name={row.owner} size="sm" />
                <span>{row.owner}</span>
              </span>
            {:else if col.key === "stage"}
              <StatusPill status={stageStatus[row.stage]} label={stageLabel[row.stage]} />
            {:else if col.key === "value"}
              {money(row.value)}
            {:else}
              {(row as Record<string, unknown>)[col.key]}
            {/if}
          {/snippet}
        </DataTable>
      </section>

      <aside class="activity-region">
        <Timeline label="Recent activity">
          <ActivityItem
            actor="Ada Fen"
            verb="moved"
            target="Eastern Ridge Tea Co. to Won"
            timestamp="09:12"
          />
          <ActivityItem
            actor="Ren Okada"
            verb="left a note on"
            target="Valley Floor Imports"
            timestamp="Yesterday"
          >
            Refund processed against the spring shipment; the account is at risk
            until the replacement order is confirmed.
          </ActivityItem>
          <ActivityItem
            actor="Mira Holt"
            verb="scheduled a call with"
            target="Mist Terrace Roasters"
            timestamp="2 days ago"
          />
        </Timeline>
      </aside>
    </div>

    {#snippet footer()}
      <StatusBar>
        {#snippet left()}
          <span class="metric">{filtered.length} deals</span>
        {/snippet}
        {#snippet right()}
          <span class="metric">Σ {money(pipelineTotal)}</span>
        {/snippet}
      </StatusBar>
    {/snippet}
  </Shell>
</div>

<style>
  .app-mockup-wrapper {
    height: 100dvh;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

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

  .panel-section-title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 0 0 10px;
    padding-left: 12px;
    flex-shrink: 0;
  }

  .views-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .crm-body {
    flex: 1;
    display: flex;
    gap: 32px;
    align-items: flex-start;
    padding: 24px clamp(16px, 3vw, 32px);
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--scroll-thumb) transparent;
  }

  .table-region {
    flex: 1;
    min-width: 0;
  }

  .activity-region {
    width: 300px;
    flex-shrink: 0;
  }

  .filter-control {
    width: 220px;
  }

  .strip-label,
  .selection-count {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-3);
    white-space: nowrap;
  }

  .owner-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    white-space: nowrap;
  }

  .owner-cell span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .metric {
    font-family: var(--font-num);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    color: var(--text-3);
  }

  @media (max-width: 1100px) {
    .crm-body {
      flex-direction: column;
    }

    .activity-region {
      width: 100%;
    }
  }
  /* The rail becomes a bottom tab bar below 760px, so the drawer trigger
     only earns its place there. */
  .nav-trigger {
    display: none;
  }

  @media (max-width: 760px) {
    .nav-trigger {
      display: inline-flex;
    }
  }

  /* 28px seal + 14px gap = a 42px pitch, so adjacent 44px hit boxes would
     overlap by 2px and the later sibling would win. */
  @media (pointer: coarse) {
    .rail-top {
      gap: 16px;
    }
  }
  /* In the phone tab bar the rail runs horizontally, so its own stack must
     flip too — otherwise the seals pile up and the bar grows to ~170px.
     The logo and divider are branding, not destinations; they leave. */
  @media (max-width: 760px) {
    .rail-top {
      flex-direction: row;
      justify-content: space-around;
      gap: 4px;
    }

    .app-logo,
    :global(.rail-divider) {
      display: none;
    }
  }
</style>
