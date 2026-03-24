import { getCurrentScope, onScopeDispose } from "vue";
import { debounce, type DebounceOptions, type DebouncedFunction } from "../core/debounce.js";

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<Parameters<T>, ReturnType<T>> => {
  const debounced = debounce(callback, wait, options);

  if (getCurrentScope()) {
    onScopeDispose(() => {
      debounced.cancel();
    });
  }

  return debounced;
};
