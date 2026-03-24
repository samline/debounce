# Browser

The browser build exposes `window.Debounce`.

```html
<script src="https://unpkg.com/@samline/debounce@0.1.0/dist/browser/debounce.global.js"></script>
<script>
  const debounced = window.Debounce.debounce((value) => {
    console.log(value);
  }, 200);

  debounced("hello");
</script>
```
