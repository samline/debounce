import { getCurrentScope, onScopeDispose, ref, watch, type Ref } from "vue";

export const useDebouncedRef = <T>(source: Ref<T>, wait: number): Ref<T> => {
  const debounced = ref(source.value) as Ref<T>;
  let timerId: ReturnType<typeof setTimeout> | undefined;

  watch(
    source,
    (value) => {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(() => {
        debounced.value = value;
      }, wait);
    },
    { flush: "post" }
  );

  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    });
  }

  return debounced;
};
