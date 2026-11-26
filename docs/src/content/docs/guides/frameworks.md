---
title: 'Framework integrations'
titleAccent: 'integrations'
description: Use @samline/debounce in Node.js, React, Vue, Svelte, Astro, Shopify and WordPress with adapters, a processed script or the pinned classic bundle.
locale: en
sidebar:
  group: guides
  order: 2
---

Each adapter is a subpath and re-exports the root API.

## Node.js

The package root runs without a DOM on Node 20 or newer, in ESM or CommonJS. `debounce` and `throttle` use timers. `rafThrottle` falls back to a roughly 16 ms timer where `requestAnimationFrame` does not exist, so it never throws. No entry point needs a DOM.

```js
import { writeFile } from 'node:fs/promises'
import { debounce } from '@samline/debounce'

const save = debounce(async state => {
  await writeFile('state.json', JSON.stringify(state))
}, 500)

save({ step: 1 })
save({ step: 2 }) // only this one is written, 500 ms after the last call

process.on('SIGTERM', () => {
  save.flush() // run the pending call now instead of dropping it
})
```

Call `cancel()` to drop a pending call and `pending()` to ask whether one is waiting.

## React

```jsx
import { useDebouncedCallback, useDebouncedValue } from '@samline/debounce/react'

const search = useDebouncedCallback(query => fetchResults(query), 300)
const debouncedQuery = useDebouncedValue(query, 300)
```

The returned function is stable and always calls the latest callback. It is recreated only when `wait` or an option changes, and cancelled on unmount. `useThrottledCallback` works the same way with throttle semantics.

## Vue

```js
import { useDebouncedCallback, useDebouncedRef } from '@samline/debounce/vue'

const search = useDebouncedCallback(query => fetchResults(query), 300)
const debouncedQuery = useDebouncedRef(query, 300)
```

Pending calls are cancelled when the effect scope is disposed.

## Svelte

```js
import { createDebouncedStore } from '@samline/debounce/svelte'

const query = createDebouncedStore('', 300)
query.set('pear') // lands after 300 ms of quiet
query.flush() // or now
```

Chained `update` calls see the latest pending value.

## Astro

The wrapped function must be created in the browser, so use a processed client `<script>` rather than the frontmatter. Without client navigation, create it once at the top of the script. With `<ClientRouter />`, create it on `astro:page-load` and cancel the pending call on `astro:before-swap`, so a call never fires into the next page.

```astro
<input id="q" type="search" />

<script>
  import { debounce } from '@samline/debounce'

  let search: { cancel: () => void } | undefined

  // astro:page-load fires only with <ClientRouter />. Without client navigation, run this setup once at the top level.
  document.addEventListener('astro:page-load', () => {
    const input = document.querySelector<HTMLInputElement>('#q')
    if (!input) return
    const run = debounce((query: string) => console.log('search', query), 250)
    search = run
    input.addEventListener('input', () => run(input.value))
  })
  document.addEventListener('astro:before-swap', () => search?.cancel())
</script>
```

## Shopify

Copy `dist/browser/debounce.global.js` of the pinned release into the theme's `assets/` folder and load it once in `layout/theme.liquid`. It defines `window.Debounce`.

```liquid
<script src="{{ 'debounce.global.js' | asset_url }}" defer></script>
```

The theme editor adds and removes sections without a page load. Create the debounced function on `shopify:section:load` and cancel it on `shopify:section:unload`, so no call fires after its section is gone. `event.target` is the section element. Run `mount` once the DOM is ready, for the sections already on the page. Save this mount code as its own file in `assets/` and load it with `defer` after the bundle: deferred scripts run in order and before `DOMContentLoaded`, so `window.Debounce` exists.

```liquid
<script src="{{ 'search.js' | asset_url }}" defer></script>
```

```js
const pending = new Map()

const mount = root => {
  const input = root.querySelector('input[type="search"]')
  if (!input) return
  const { debounce } = window.Debounce
  const search = debounce(query => console.log('search', query), 250)
  input.addEventListener('input', () => search(input.value))
  pending.set(root, search)
}

document.addEventListener('shopify:section:load', event => mount(event.target))
document.addEventListener('shopify:section:unload', event => {
  pending.get(event.target)?.cancel()
  pending.delete(event.target)
})
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shopify-section').forEach(mount)
})
```

Removing a section removes its input and listener with it, so cancelling the pending call is the only cleanup left. See [Shopify's section events](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks).

## WordPress

Enqueue the pinned classic script from your theme or plugin, deferred, on the front end. `'strategy' => 'defer'` needs WordPress 6.3 or newer.

```php
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script(
    'debounce',
    'https://cdn.jsdelivr.net/npm/@samline/debounce@1.0.2/dist/browser/debounce.global.js',
    [],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
  );
  wp_enqueue_script(
    'my-search',
    get_theme_file_uri('assets/search.js'),
    ['debounce'],
    null,
    ['strategy' => 'defer', 'in_footer' => true]
  );
});
```

`assets/search.js` is your own file. Declaring `debounce` as its dependency keeps the order, so `window.Debounce` exists when it runs:

```js
const { debounce } = window.Debounce
const input = document.querySelector('.search-field')
const search = debounce(query => console.log('search', query), 250)
input?.addEventListener('input', () => search(input.value))
```

See [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).
