<!--
  A tiny, self-contained fixture for exercising the tap-target opt-out
  contract in isolation from anything under src/lib — deliberately not a
  real design-system component, so this test never collides with the
  concurrent work happening there.
-->
<script lang="ts">
</script>

<button class="tiny" type="button">Tiny</button>

<button
  class="tiny-exempt"
  type="button"
  data-tap-target-exempt="Fixture: intentionally undersized to prove the opt-out is honored when a reason is written."
>
  Tiny, exempt
</button>

<button class="tiny-empty-exempt" type="button" data-tap-target-exempt="">
  Tiny, empty exemption
</button>

<style>
  .tiny,
  .tiny-exempt,
  .tiny-empty-exempt {
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 0;
  }
</style>
