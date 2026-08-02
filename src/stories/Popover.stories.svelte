<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Popover from '../lib/organisms/Popover.svelte';

  const { Story } = defineMeta({
    title: 'Organisms/Popover',
    component: Popover,
    tags: ['autodocs']
  });
</script>

<script>
  let standardAnchor = $state();
  let standardOpen = $state(false);

  let topAnchor = $state();
  let topOpen = $state(false);
  let bottomStartAnchor = $state();
  let bottomStartOpen = $state(false);
  let rightAnchor = $state();
  let rightOpen = $state(false);
  let leftAnchor = $state();
  let leftOpen = $state(false);

  let modalAnchor = $state();
  let modalOpen = $state(false);
</script>

<Story name="Standard">
  <div style="padding: 80px; text-align: center;">
    <button
      type="button"
      class="cs-trigger"
      bind:this={standardAnchor}
      onclick={() => (standardOpen = !standardOpen)}
    >
      Recommender status
    </button>
    <Popover bind:open={standardOpen} anchor={standardAnchor} label="Recommender status">
      <div class="cs-pop-body">
        <p class="cs-pop-title">Next-best-exercise service</p>
        <p class="cs-pop-text">
          p99 latency 187µs excluding network hops. BKT diagnosis refreshed 40s ago across 3 skill
          graphs.
        </p>
      </div>
    </Popover>
  </div>
</Story>

<Story name="Placements">
  <div class="cs-grid">
    <div class="cs-grid-cell cs-grid-top">
      <button
        type="button"
        class="cs-trigger"
        bind:this={topAnchor}
        onclick={() => (topOpen = !topOpen)}
      >
        top
      </button>
      <Popover bind:open={topOpen} anchor={topAnchor} placement="top" label="Top placement">
        <div class="cs-pop-body cs-pop-small">Flips to bottom if the viewport runs out of room above.</div>
      </Popover>
    </div>

    <div class="cs-grid-cell cs-grid-bottom-start">
      <button
        type="button"
        class="cs-trigger"
        bind:this={bottomStartAnchor}
        onclick={() => (bottomStartOpen = !bottomStartOpen)}
      >
        bottom-start
      </button>
      <Popover
        bind:open={bottomStartOpen}
        anchor={bottomStartAnchor}
        placement="bottom-start"
        label="Bottom-start placement"
      >
        <div class="cs-pop-body cs-pop-small">Left edge aligns with the anchor's left edge.</div>
      </Popover>
    </div>

    <div class="cs-grid-cell cs-grid-right">
      <button
        type="button"
        class="cs-trigger"
        bind:this={rightAnchor}
        onclick={() => (rightOpen = !rightOpen)}
      >
        right
      </button>
      <Popover bind:open={rightOpen} anchor={rightAnchor} placement="right" label="Right placement">
        <div class="cs-pop-body cs-pop-small">Shifts along the cross axis to stay clear of the viewport edge.</div>
      </Popover>
    </div>

    <div class="cs-grid-cell cs-grid-left">
      <button
        type="button"
        class="cs-trigger"
        bind:this={leftAnchor}
        onclick={() => (leftOpen = !leftOpen)}
      >
        left
      </button>
      <Popover bind:open={leftOpen} anchor={leftAnchor} placement="left" label="Left placement">
        <div class="cs-pop-body cs-pop-small">Flips to the right when the left side is too tight.</div>
      </Popover>
    </div>
  </div>
</Story>

<Story name="Modal">
  <div style="padding: 80px; text-align: center;">
    <button
      type="button"
      class="cs-trigger"
      bind:this={modalAnchor}
      onclick={() => (modalOpen = !modalOpen)}
    >
      Rename skill graph
    </button>
    <Popover bind:open={modalOpen} anchor={modalAnchor} modal label="Rename skill graph">
      <div class="cs-pop-body">
        <p class="cs-pop-title">Rename skill graph</p>
        <label class="cs-field">
          <span>Name</span>
          <input type="text" value="CbKST — algebra I" />
        </label>
        <div class="cs-pop-actions">
          <button type="button" class="cs-btn-ghost" onclick={() => (modalOpen = false)}>Cancel</button>
          <button type="button" class="cs-btn-primary" onclick={() => (modalOpen = false)}>Save</button>
        </div>
      </div>
    </Popover>
  </div>
</Story>

<style>
  .cs-trigger {
    font-family: var(--font-body);
    font-size: 13px;
    padding: var(--pad-control-y) 16px;
    border-radius: var(--radius-s);
    background: transparent;
    color: var(--text-1);
    border: 1.5px solid var(--line-strong);
    cursor: pointer;
  }

  .cs-trigger:hover {
    background: var(--wash);
  }

  .cs-trigger:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 2px;
  }

  .cs-pop-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 220px;
    text-align: left;
  }

  .cs-pop-small {
    width: 180px;
    font-size: 12.5px;
    color: var(--text-2);
  }

  .cs-pop-title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-1);
  }

  .cs-pop-text {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--text-2);
  }

  .cs-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--text-2);
  }

  .cs-field input {
    font-family: var(--font-body);
    font-size: 13px;
    padding: 6px 8px;
    border-radius: var(--radius-s);
    background: var(--canvas);
    color: var(--text-1);
    border: 1.5px solid var(--line-mid);
  }

  .cs-field input:focus-visible {
    outline: 1.5px solid var(--accent);
    outline-offset: 1px;
  }

  .cs-pop-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
  }

  .cs-btn-ghost,
  .cs-btn-primary {
    font-family: var(--font-body);
    font-size: 12.5px;
    padding: 6px 12px;
    border-radius: var(--radius-s);
    cursor: pointer;
    border: 1.5px solid transparent;
  }

  .cs-btn-ghost {
    background: transparent;
    color: var(--text-1);
  }

  .cs-btn-ghost:hover {
    background: var(--wash);
  }

  .cs-btn-primary {
    background: var(--cell-edit-bg);
    color: var(--cell-edit-text);
  }

  .cs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 120px;
    padding: 140px 160px;
    place-items: center;
  }

  .cs-grid-cell {
    position: relative;
  }
</style>
