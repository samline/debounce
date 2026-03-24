# @samline/debounce

A debounce utility package with a shared core and tailored entrypoints for vanilla JavaScript, React, Vue, Svelte, and direct browser usage.

## Entry Points

| Import | Purpose |
| --- | --- |
| `@samline/debounce` | Root debounce API |
| `@samline/debounce/vanilla` | Explicit vanilla entrypoint |
| `@samline/debounce/react` | React hooks for callbacks and values |
| `@samline/debounce/vue` | Vue composables for callbacks and refs |
| `@samline/debounce/svelte` | Svelte helpers and stores |
| `dist/browser/debounce.global.js` | Browser global bundle exposing `window.Debounce` |

## Install

```bash
npm install @samline/debounce
```

## Root Usage

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

## API

The root and vanilla entrypoints export:

- `debounce`
- `createDebounce`
- `DebounceOptions`
- `DebouncedFunction`

See the variant docs for framework-specific usage:

- [docs/vanilla.md](docs/vanilla.md)
- [docs/react.md](docs/react.md)
- [docs/vue.md](docs/vue.md)
- [docs/svelte.md](docs/svelte.md)
- [docs/browser.md](docs/browser.md)

## Release

This package is intended to publish from Git tags matching `v*`. The workflow validates the tag against `package.json`, builds, typechecks, tests, and then publishes to npm.
