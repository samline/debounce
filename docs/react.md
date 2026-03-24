# React

React exports two hooks:

- `useDebouncedCallback`
- `useDebouncedValue`

```tsx
import { useDebouncedCallback, useDebouncedValue } from "@samline/debounce/react";

function Search() {
  const [value, setValue] = useState("");
  const delayedValue = useDebouncedValue(value, 200);
  const onChange = useDebouncedCallback((next: string) => {
    console.log(next);
  }, 200);

  return <input onChange={(event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  }} value={delayedValue} />;
}
```
