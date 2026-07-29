# A Forest — component library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Using it in an app

The components are unstyled without the token stylesheet — every `--hue`,
`--ink-*` and `--wave-mask-*` lives there. Import it once, at the app root:

```js
import 'forest/styles/forest.css';
```

Then import components from the package root:

```js
import { DataTable, Combobox, StatusPill } from 'forest';
```

Prop types are exported alongside them, derived from the components so they
cannot drift, together with the domain shapes you construct:

```ts
import type { DataTableProps, DataTableColumn, Command, Status } from 'forest';
```

Toasts queue rather than replacing one another. Render one region, push from
anywhere:

```svelte
<script>
  import { ToastRegion, toaster } from 'forest';
</script>

<ToastRegion />
<button onclick={() => toaster.success('Saved to the ledger')}>Save</button>
```

`Dialog`, `Drawer` and `CommandPalette` trap Tab while open and hand focus back
to the trigger when they close. The same `focusTrap` action is exported for your
own transient surfaces.

Theming is one number: rotate `--hue` on `:root` (indigo 282, pine 165,
oxblood 20, slate 250). Set `data-mode="light|dark"` and
`data-density="comfortable|compact"` on the same element.

Any component placed on dark "ink" paper (the spine, a drawer, the command
palette) should sit inside a `.on-ink` scope — `PaperTexture` applies it
automatically — which flips the canvas tokens so text, hairlines and washes
read correctly without per-component overrides.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.16.3 create --template library --types ts --add storybook mcp="ide:other+setup:remote" --install bun ./
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
