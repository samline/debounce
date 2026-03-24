import { effectScope, nextTick, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { useDebouncedCallback, useDebouncedRef } from "../../src/vue/index.js";

describe("vue composables", () => {
  it("debounces callback execution", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    effectScope().run(() => {
      const debounced = useDebouncedCallback(callback, 50);
      debounced("first");
      debounced("second");
    });

    vi.advanceTimersByTime(50);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("debounces ref updates", async () => {
    vi.useFakeTimers();
    const source = ref("a");
    let debouncedValue = "";

    await effectScope().run(async () => {
      const debounced = useDebouncedRef(source, 50);
      debouncedValue = debounced.value;
      source.value = "b";
      await nextTick();
      debouncedValue = debounced.value;
      vi.advanceTimersByTime(50);
      await nextTick();
      debouncedValue = debounced.value;
    });

    expect(debouncedValue).toBe("b");
  });
});
