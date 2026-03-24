import { writable, type Writable } from "svelte/store";

export const createDebouncedStore = <T>(initialValue: T, wait: number): Writable<T> => {
  const store = writable(initialValue);
  let timerId: ReturnType<typeof setTimeout> | undefined;

  const set = (value: T) => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      store.set(value);
    }, wait);
  };

  return {
    subscribe: store.subscribe,
    set,
    update(updater) {
      let nextValue!: T;
      store.update((current) => {
        nextValue = updater(current);
        return current;
      });
      set(nextValue);
    }
  };
};
