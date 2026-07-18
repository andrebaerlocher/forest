<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="error-container">
  <h1>{page.status}</h1>
  <p>{page.error?.message || 'An unexpected error occurred.'}</p>
  <a href="/" data-sveltekit-prefetch>Return Home</a>
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: var(--font-body);
    text-align: center;
    background: var(--canvas);
    color: var(--text-1);
    padding: 24px;
  }

  h1 {
    font-size: 64px;
    font-weight: 300;
    margin: 0 0 16px;
    color: var(--danger);
  }

  p {
    font-size: 16px;
    margin: 0 0 32px;
    color: var(--text-2);
    max-width: 48ch;
  }

  a {
    font-family: var(--font-body);
    font-size: 13px;
    padding: var(--pad-control-y) 18px;
    border-radius: var(--radius-s);
    border: 1.5px solid var(--line-strong);
    color: var(--text-1);
    text-decoration: none;
    transition: background var(--t-fast) var(--ease);
  }

  a:hover {
    background: var(--wash);
  }
</style>
