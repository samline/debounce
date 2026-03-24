# Vanilla

Use the shared debounce API directly when you do not need framework bindings.

```ts
import { debounce } from "@samline/debounce/vanilla";

const debounced = debounce((value: string) => {
  console.log(value);
}, 250);
```

## Options

- `leading`
- `trailing`
- `maxWait`

Each debounced function also exposes `cancel()` and `flush()`.
