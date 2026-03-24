# Svelte

Svelte exports:

- `debounce`
- `createDebouncedStore`

```ts
import { createDebouncedStore } from "@samline/debounce/svelte";

const query = createDebouncedStore("", 200);
```
