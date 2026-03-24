import { createDebounce, debounce } from "../core/debounce.js";

const api = {
  createDebounce,
  debounce
};

const globalScope = globalThis as typeof globalThis & {
  Debounce?: typeof api;
};

globalScope.Debounce = api;

export { createDebounce, debounce };
