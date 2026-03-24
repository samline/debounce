# Vue

Vue exports:

- `useDebouncedCallback`
- `useDebouncedRef`

```ts
import { ref, watch } from "vue";
import { useDebouncedCallback, useDebouncedRef } from "@samline/debounce/vue";

const input = ref("");
const debouncedInput = useDebouncedRef(input, 250);
const save = useDebouncedCallback((value: string) => {
  console.log(value);
}, 250);

watch(input, (value) => {
  save(value);
});
```
