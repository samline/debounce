import { useEffect, useRef } from "react";
import { debounce, type DebouncedFunction, type DebounceOptions } from "../core/debounce.js";

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<Parameters<T>, ReturnType<T>> => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedRef = useRef<DebouncedFunction<Parameters<T>, ReturnType<T>> | null>(null);

  if (debouncedRef.current === null) {
    debouncedRef.current = debounce((...args: Parameters<T>) => callbackRef.current(...args), wait, options);
  }

  useEffect(() => {
    const current = debouncedRef.current;
    return () => {
      current?.cancel();
    };
  }, []);

  return debouncedRef.current;
};
