# @samline/debounce

A debounce utility with a shared core and dedicated entrypoints for vanilla JavaScript, React, Vue, Svelte, and direct browser usage.

## Table of Contents

- [Installation](#installation)
- [CDN / Browser](#cdn--browser)
- [Entrypoints](#entrypoints)
- [Quick Start](#quick-start)
- [API](#api)
- [Supported Locales](#supported-locales)
- [Documentation](#documentation)
- [License](#license)

## Installation

```bash
npm install @samline/debounce
```

```bash
pnpm add @samline/debounce
```

```bash
yarn add @samline/debounce
```

```bash
bun add @samline/debounce
```

## CDN / Browser

Use the browser bundle directly when you do not want a bundler.

```html
<script src="https://unpkg.com/@samline/debounce@0.1.0/dist/browser/debounce.global.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/debounce@0.1.0/dist/browser/debounce.global.js"></script>
```

The global build exposes `window.Debounce`.

## Entrypoints

| Import | Purpose |
| --- | --- |
| `@samline/debounce` | Root debounce API |
| `@samline/debounce/vanilla` | Explicit vanilla entrypoint |
| `@samline/debounce/react` | React hooks for callbacks and values |
| `@samline/debounce/vue` | Vue composables for callbacks and refs |
| `@samline/debounce/svelte` | Svelte helpers and stores |
| `dist/browser/debounce.global.js` | Browser global bundle exposing `window.Debounce` |

## Quick Start

The root import exposes the shared debounce API.

```ts
import { debounce } from "@samline/debounce";

const save = debounce(
  (value: string) => {
    console.log("saved", value);
  },
  200,
  { leading: false, trailing: true, maxWait: 1000 }
);

save("hello");
save.cancel();
```

You can force a pending invocation immediately:

```ts
const commit = debounce(saveToServer, 300);

commit("draft");
commit.flush();
```

## API

The root and vanilla entrypoints export:

- `debounce`
- `createDebounce`
- `DebounceOptions`
- `DebouncedFunction`

### debounce

```ts
debounce(fn, wait, options?)
```

Creates a debounced function that delays execution until the configured wait window is satisfied.

### DebounceOptions

- `leading`: invoke on the first call in a debounce window
- `trailing`: invoke after the last call in a debounce window
- `maxWait`: force execution after a maximum delay even if calls keep arriving

### DebouncedFunction

Every debounced function exposes:

- `cancel()`: drops the pending invocation
- `flush()`: executes the pending invocation immediately and returns its result when available

## Supported Locales

This package is locale-independent. It does not ship locale tables, translations, or locale-specific behavior.

## Documentation

Framework-specific usage is documented in:

- [docs/vanilla.md](docs/vanilla.md)
- [docs/react.md](docs/react.md)
- [docs/vue.md](docs/vue.md)
- [docs/svelte.md](docs/svelte.md)
- [docs/browser.md](docs/browser.md)

## License

MIT. See [LICENSE](LICENSE).
